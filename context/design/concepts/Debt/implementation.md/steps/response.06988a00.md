---
timestamp: 'Sat Oct 11 2025 23:43:45 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_234345.079815b4.md]]'
content_id: 06988a0068c17b05f829d0630f055c77709fcb0c6e2ce5758e308e2ca8b397b8
---

# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts"; // Assuming ID is a type alias for string with branding

// Define User and Expense types (assuming they are globally defined or imported)
// For demonstration, we'll define them as ID
type User = ID;
type Expense = ID; // Reference to an expense object

// Declare collection prefix
const PREFIX = "Debt" + ".";

/**
 * Represents a personal debt between two users.
 * userA owes userB if balance is positive.
 */
interface PersonalDebt {
  _id: ID; // Unique identifier for the personal debt record
  userA: User;
  userB: User;
  balance: number; // positive if userA owes userB, negative if userB owes userA
}

/**
 * Represents a record of a specific debt transaction, usually tied to an expense.
 */
interface DebtRecord {
  _id: ID; // Unique identifier for the debt record
  payer: User;
  receivers: Map<User, number>; // Map of user to the amount they owe the payer for this record
  totalCost: number;
  expense: Expense; // Reference to the associated expense
}

export default class DebtConcept {
  personalDebts: Collection<PersonalDebt>;
  debtRecords: Collection<DebtRecord>;

  constructor(private readonly db: Db) {
    this.personalDebts = this.db.collection(PREFIX + "personalDebts");
    this.debtRecords = this.db.collection(PREFIX + "debtRecords");
  }

  /**
   * Creates a new personal debt record between two users.
   * @param userA The first user.
   * @param userB The second user.
   * @returns The newly created personal debt record.
   */
  async createPersonalDebt({
    userA,
    userB,
  }: {
    userA: User;
    userB: User;
  }): Promise<{ debt: PersonalDebt }> {
    // Requires: both users exist and a PersonalDebt between them does not already exist
    // This check would typically involve querying user collection (not provided here)
    // and checking for existing personalDebts between userA and userB.
    // For simplicity, we'll assume the existence and uniqueness checks are handled externally or by caller.

    const existingDebt = await this.personalDebts.findOne({
      $or: [
        { userA: userA, userB: userB },
        { userA: userB, userB: userA },
      ],
    });

    if (existingDebt) {
      return { error: "Personal debt already exists between these users." };
    }

    const newDebt: PersonalDebt = {
      _id: await freshID(), // Assuming freshID() is available for generating unique IDs
      userA: userA,
      userB: userB,
      balance: 0,
    };
    await this.personalDebts.insertOne(newDebt);
    return { debt: newDebt };
  }

  /**
   * Updates the balance of an existing personal debt between two users.
   * @param payer The user who is paying.
   * @param receiver The user who is receiving the payment.
   * @param amount The amount of the payment.
   * @returns The updated balance between the payer and receiver.
   */
  async updatePersonalDebt({
    payer,
    receiver,
    amount,
  }: {
    payer: User;
    receiver: User;
    amount: number;
  }): Promise<{ balance: number }> {
    // Requires: a PersonalDebt exists between payer and receiver
    const debt = await this.personalDebts.findOne({
      $or: [
        { userA: payer, userB: receiver },
        { userA: receiver, userB: payer },
      ],
    });

    if (!debt) {
      return { error: "Personal debt does not exist between payer and receiver." };
    }

    let updatedBalance: number;

    if (debt.userA === payer) {
      // payer is userA, receiver is userB
      // If payer pays receiver, payer's balance should decrease (they owe less to receiver)
      // If payer is userA, and userA pays userB, the balance (userA owes userB) should decrease.
      // So, debt.balance = debt.balance - amount
      updatedBalance = debt.balance - amount;
    } else {
      // payer is userB, receiver is userA
      // If payer pays receiver, payer's balance should increase (they owe more to receiver)
      // If payer is userB, and userB pays userA, the balance (userA owes userB) should increase.
      // So, debt.balance = debt.balance + amount
      updatedBalance = debt.balance + amount;
    }

    await this.personalDebts.updateOne(
      { _id: debt._id },
      { $set: { balance: updatedBalance } },
    );

    return { balance: updatedBalance };
  }

  /**
   * Creates a new debt record for a shared expense.
   * @param payer The user who paid for the expense.
   * @param totalCost The total cost of the expense.
   * @param receiversSplit A map of users to the amount they owe the payer for this expense.
   * @returns The newly created debt record.
   */
  async createDebtRecord({
    payer,
    totalCost,
    receiversSplit,
  }: {
    payer: User;
    totalCost: number;
    receiversSplit: Map<User, number>;
  }): Promise<{ debtRecord: DebtRecord }> {
    // Requires: payer and all receivers exist, all numbers in receiversSplit are nonnegative, and sum to totalCost
    // User existence checks would typically be against a User concept.
    const receiverUsers = Array.from(receiversSplit.keys());
    const sumOfSplits = Array.from(receiversSplit.values()).reduce((sum, val) => sum + val, 0);

    if (receiversSplit.size === 0) {
        return { error: "Receivers split cannot be empty." };
    }
    if (totalCost < 0) {
        return { error: "Total cost cannot be negative." };
    }
    for (const amount of receiversSplit.values()) {
      if (amount < 0) {
        return { error: "Amounts in receivers split cannot be negative." };
      }
    }
    if (Math.abs(sumOfSplits - totalCost) > 0.001) { // Use tolerance for float comparison
      return { error: "Sum of receiver splits must equal total cost." };
    }

    const newDebtRecord: DebtRecord = {
      _id: await freshID(),
      payer: payer,
      receivers: receiversSplit,
      totalCost: totalCost,
      expense: await freshID(), // Placeholder for expense ID
    };

    // Update personal debt balances
    for (const [receiver, amountOwed] of receiversSplit.entries()) {
      if (payer !== receiver) { // Don't update debt if payer is also receiver for this split amount
        await this.updatePersonalDebt({
          payer: receiver, // The receiver owes the payer
          receiver: payer,
          amount: amountOwed,
        });
      }
    }

    await this.debtRecords.insertOne(newDebtRecord);
    return { debtRecord: newDebtRecord };
  }

  /**
   * Edits an existing debt record and recalculates affected personal debt balances.
   * @param debtRecordId The ID of the debt record to edit.
   * @param totalCost The new total cost of the expense.
   * @param receiversSplit The new map of users and amounts owed.
   * @returns The updated debt record.
   */
  async editDebtRecord({
    debtRecordId,
    totalCost,
    receiversSplit,
  }: {
    debtRecordId: ID;
    totalCost: number;
    receiversSplit: Map<User, number>;
  }): Promise<{ debtRecord: DebtRecord }> {
    // Requires: debtRecord exists, totalCost > 0, all receivers exist, numbers in receiversSplit are nonnegative and sum to totalCost

    const existingDebtRecord = await this.debtRecords.findOne({ _id: debtRecordId });

    if (!existingDebtRecord) {
      return { error: "Debt record not found." };
    }

    const receiverUsers = Array.from(receiversSplit.keys());
    const sumOfSplits = Array.from(receiversSplit.values()).reduce((sum, val) => sum + val, 0);

    if (totalCost <= 0) {
        return { error: "Total cost must be positive." };
    }
    for (const amount of receiversSplit.values()) {
      if (amount < 0) {
        return { error: "Amounts in receivers split cannot be negative." };
      }
    }
    if (Math.abs(sumOfSplits - totalCost) > 0.001) { // Use tolerance for float comparison
      return { error: "Sum of receiver splits must equal total cost." };
    }

    // To accurately recalculate balances, we first need to reverse the effects of the old record.
    // For each receiver in the old record, subtract their owed amount from the payer.
    for (const [receiver, amountOwed] of existingDebtRecord.receivers.entries()) {
      if (existingDebtRecord.payer !== receiver) {
        await this.updatePersonalDebt({
          payer: receiver,
          receiver: existingDebtRecord.payer,
          amount: -amountOwed, // Subtract the old amount
        });
      }
    }

    // Then, apply the effects of the new receivers split.
    for (const [receiver, amountOwed] of receiversSplit.entries()) {
      if (existingDebtRecord.payer !== receiver) {
        await this.updatePersonalDebt({
          payer: receiver,
          receiver: existingDebtRecord.payer,
          amount: amountOwed, // Add the new amount
        });
      }
    }

    const updatedDebtRecord: DebtRecord = {
      ...existingDebtRecord,
      totalCost: totalCost,
      receivers: receiversSplit,
    };

    await this.debtRecords.updateOne(
      { _id: debtRecordId },
      { $set: updatedDebtRecord },
    );

    return { debtRecord: updatedDebtRecord };
  }

  /**
   * Deletes a debt record and adjusts affected personal debt balances.
   * @param debtRecordId The ID of the debt record to delete.
   * @returns An empty object on success, or an error object.
   */
  async deleteDebtRecord({
    debtRecordId,
  }: {
    debtRecordId: ID;
  }): Promise<any> { // Returning 'any' to allow for error object or empty success
    // Requires: debtRecord exists
    const existingDebtRecord = await this.debtRecords.findOne({ _id: debtRecordId });

    if (!existingDebtRecord) {
      return { error: "Debt record not found." };
    }

    // Reverse the effects of the debt record
    for (const [receiver, amountOwed] of existingDebtRecord.receivers.entries()) {
      if (existingDebtRecord.payer !== receiver) {
        await this.updatePersonalDebt({
          payer: receiver,
          receiver: existingDebtRecord.payer,
          amount: -amountOwed, // Subtract the owed amount
        });
      }
    }

    await this.debtRecords.deleteOne({ _id: debtRecordId });

    return {}; // Success, return empty object
  }

  /**
   * Gets the net balance between two users.
   * @param userA The first user.
   * @param userB The second user.
   * @returns The net balance between userA and userB.
   */
  async getDebt({
    userA,
    userB,
  }: {
    userA: User;
    userB: User;
  }): Promise<{ balance: number }> {
    // Requires: a PersonalDebt exists between the two users
    const debt = await this.personalDebts.findOne({
      $or: [
        { userA: userA, userB: userB },
        { userA: userB, userB: userA },
      ],
    });

    if (!debt) {
      return { error: "Personal debt does not exist between these users." };
    }

    // The balance is stored as 'userA owes userB'.
    // If the query is for userB owes userA, we need to invert the sign.
    if (debt.userA === userA && debt.userB === userB) {
      return { balance: debt.balance };
    } else if (debt.userA === userB && debt.userB === userA) {
      return { balance: -debt.balance }; // Invert balance if userA is the receiver in the stored record
    } else {
      // This case should ideally not be reached due to the $or query, but as a safeguard:
      return { error: "Unexpected debt record structure." };
    }
  }

  // Helper function to simulate fresh ID generation if not provided by utils
  private async freshID(): Promise<ID> {
    // In a real implementation, this would interact with a database or utility
    // to generate a unique string ID. For now, using a placeholder.
    // Replace with actual implementation from @utils/database.ts
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `debt:${randomStr}` as ID;
  }
}
```
