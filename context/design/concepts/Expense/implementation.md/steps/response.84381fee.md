---
timestamp: 'Tue Oct 14 2025 22:02:10 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251014_220210.2410444b.md]]'
content_id: 84381fee938da84e75bb4dc1b1d3368c1f2556f48a22eca12dfdcbcff6745a9b
---

# response:

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID, Result, UserId, ExpenseId, GroupId, UserSplitId } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Define types based on concept specification
type User = UserId;
type Expense = ExpenseId;
type Group = GroupId;
type UserSplit = UserSplitId;

// Interface for the Expense document in MongoDB
interface ExpenseDocument {
  _id: Expense;
  title: string;
  description?: string;
  category: string;
  date: Date;
  payer: User;
  totalCost: number;
  group: Group;
}

// Interface for the UserSplit document in MongoDB
interface UserSplitDocument {
  _id: UserSplitId;
  user: User;
  amountOwed: number;
  expense: Expense;
}

export default class ExpenseConcept {
  private readonly expenses: Collection<ExpenseDocument>;
  private readonly userSplits: Collection<UserSplitDocument>;

  constructor(private readonly db: Db) {
    const PREFIX = "Expense.";
    this.expenses = this.db.collection(PREFIX + "expenses");
    this.userSplits = this.db.collection(PREFIX + "userSplits");
  }

  // Helper to validate user splits sum to total cost
  private async validateSplits(
    expenseId: Expense,
    splits: { user: User; amountOwed: number }[],
    totalCost: number
  ): Promise<{ error: string } | null> {
    let sumOwed = 0;
    for (const split of splits) {
      if (split.amountOwed < 0) {
        return { error: `User split amount owed cannot be negative for user ${split.user}.` };
      }
      sumOwed += split.amountOwed;
    }

    if (Math.abs(sumOwed - totalCost) > 1e-6) { // Using tolerance for floating point comparison
      return { error: `The sum of amounts owed (${sumOwed}) does not equal the total cost (${totalCost}).` };
    }
    return null;
  }

  // Helper to check if user is in group (assuming a Group concept exists elsewhere)
  // This is a placeholder and would need to be implemented if Group concept is available
  private async isUserInGroup(user: User, group: Group): Promise<boolean> {
    // Replace with actual check against a Group concept or data source
    console.warn("isUserInGroup not implemented. Assuming user is in group.");
    return true;
  }

  // Helper to check if expense exists
  private async doesExpenseExist(expenseId: Expense): Promise<boolean> {
    const expense = await this.expenses.findOne({ _id: expenseId });
    return expense !== null;
  }

  // Helper to check if user split exists
  private async doesUserSplitExist(splitId: UserSplitId): Promise<boolean> {
    const split = await this.userSplits.findOne({ _id: splitId });
    return split !== null;
  }

  async createExpense({
    user,
    title,
    category,
    date,
    totalCost,
    description,
    group,
    splits,
  }: {
    user: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
    splits: { user: User; amountOwed: number }[];
  }): Promise<Result<{ expense: Expense }>> {
    if (totalCost < 0) {
      return { error: "Total cost cannot be negative." };
    }
    if (!(await this.isUserInGroup(user, group))) {
      return { error: `User ${user} is not a member of group ${group}.` };
    }

    const validationError = await this.validateSplits(freshID() as Expense, splits, totalCost); // Temporary ID for validation
    if (validationError) {
      return validationError;
    }

    const expenseId = freshID() as Expense;
    const newExpense: ExpenseDocument = {
      _id: expenseId,
      title,
      description,
      category,
      date,
      payer: user,
      totalCost,
      group,
    };

    try {
      const insertedExpense = await this.expenses.insertOne(newExpense);

      for (const split of splits) {
        const userSplitId = freshID() as UserSplitId;
        const newUserSplit: UserSplitDocument = {
          _id: userSplitId,
          user: split.user,
          amountOwed: split.amountOwed,
          expense: expenseId,
        };
        await this.userSplits.insertOne(newUserSplit);
      }

      return { expense: expenseId };
    } catch (e) {
      console.error("Error creating expense:", e);
      return { error: "Failed to create expense due to a database error." };
    }
  }

  async editExpense({
    expenseToEdit,
    title,
    description,
    category,
    totalCost,
    date,
    splits,
  }: {
    expenseToEdit: Expense;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
    splits?: { user: User; amountOwed: number }[];
  }): Promise<Empty | { error: string }> {
    const existingExpense = await this.expenses.findOne({ _id: expenseToEdit });
    if (!existingExpense) {
      return { error: `Expense with ID ${expenseToEdit} not found.` };
    }

    let newTotalCost = totalCost !== undefined ? totalCost : existingExpense.totalCost;
    let newSplits = splits !== undefined ? splits : await this.getUserSplitsForExpense(expenseToEdit);

    if (newTotalCost < 0) {
      return { error: "Total cost cannot be negative." };
    }

    const validationError = await this.validateSplits(expenseToEdit, newSplits, newTotalCost);
    if (validationError) {
      return validationError;
    }

    // Update expense
    const updateFields: Partial<ExpenseDocument> = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (totalCost !== undefined) updateFields.totalCost = totalCost;
    if (date !== undefined) updateFields.date = date;

    try {
      await this.expenses.updateOne({ _id: expenseToEdit }, { $set: updateFields });

      // Update user splits
      // First, delete existing splits for this expense if new splits are provided
      if (splits !== undefined) {
        await this.userSplits.deleteMany({ expense: expenseToEdit });

        // Then, insert the new splits
        for (const split of newSplits) {
          const userSplitId = freshID() as UserSplitId;
          const newUserSplit: UserSplitDocument = {
            _id: userSplitId,
            user: split.user,
            amountOwed: split.amountOwed,
            expense: expenseToEdit,
          };
          await this.userSplits.insertOne(newUserSplit);
        }
      }
      return {};
    } catch (e) {
      console.error("Error editing expense:", e);
      return { error: "Failed to edit expense due to a database error." };
    }
  }

  async deleteExpense({ expenseToDelete }: { expenseToDelete: Expense }): Promise<Result<{ deletedExpense: Expense }>> {
    const existingExpense = await this.expenses.findOne({ _id: expenseToDelete });
    if (!existingExpense) {
      return { error: `Expense with ID ${expenseToDelete} not found.` };
    }

    try {
      const deleteResultExpense = await this.expenses.deleteOne({ _id: expenseToDelete });
      if (deleteResultExpense.deletedCount === 0) {
        return { error: `Failed to delete expense with ID ${expenseToDelete}.` };
      }

      const deleteResultSplits = await this.userSplits.deleteMany({ expense: expenseToDelete });

      return { deletedExpense: expenseToDelete };
    } catch (e) {
      console.error("Error deleting expense:", e);
      return { error: "Failed to delete expense due to a database error." };
    }
  }

  async addUserSplit({
    expense,
    user,
    group,
    amountOwed,
  }: {
    expense: Expense;
    user: User;
    group: Group;
    amountOwed: number;
  }): Promise<Empty | { error: string }> {
    const existingExpense = await this.expenses.findOne({ _id: expense });
    if (!existingExpense) {
      return { error: `Expense with ID ${expense} not found.` };
    }
    if (amountOwed < 0) {
      return { error: "Amount owed cannot be negative." };
    }
    if (!(await this.isUserInGroup(user, group))) {
      return { error: `User ${user} is not a member of group ${group}.` };
    }

    // Check if a split for this user already exists for this expense
    const existingSplit = await this.userSplits.findOne({ expense: expense, user: user });
    if (existingSplit) {
      return { error: `A user split for user ${user} already exists for expense ${expense}. Use editUserSplit to modify it.` };
    }

    // Validate if adding this split would exceed the total cost
    const currentSplits = await this.getUserSplitsForExpense(expense);
    const currentTotalOwed = currentSplits.reduce((sum, s) => sum + s.amountOwed, 0);
    if (currentTotalOwed + amountOwed > existingExpense.totalCost) {
      return { error: `Adding this split would exceed the total cost of the expense (${existingExpense.totalCost}).` };
    }

    try {
      const userSplitId = freshID() as UserSplitId;
      const newUserSplit: UserSplitDocument = {
        _id: userSplitId,
        user,
        amountOwed,
        expense,
      };
      await this.userSplits.insertOne(newUserSplit);
      return {};
    } catch (e) {
      console.error("Error adding user split:", e);
      return { error: "Failed to add user split due to a database error." };
    }
  }

  async editUserSplit({
    expense,
    user,
    amountOwed,
  }: {
    expense: Expense;
    user: User;
    amountOwed: number;
  }): Promise<Empty | { error: string }> {
    const existingExpense = await this.expenses.findOne({ _id: expense });
    if (!existingExpense) {
      return { error: `Expense with ID ${expense} not found.` };
    }
    if (amountOwed < 0) {
      return { error: "Amount owed cannot be negative." };
    }

    const existingSplit = await this.userSplits.findOne({ expense: expense, user: user });
    if (!existingSplit) {
      return { error: `User split for user ${user} not found for expense ${expense}. Use addUserSplit to create it.` };
    }

    // Validate if the new amountOwed, when summed with other splits, exceeds total cost
    const currentSplits = await this.userSplits.find({ expense: expense }).toArray();
    let sumOfOtherSplits = 0;
    for (const split of currentSplits) {
      if (split.user !== user) {
        sumOfOtherSplits += split.amountOwed;
      }
    }
    if (sumOfOtherSplits + amountOwed > existingExpense.totalCost) {
      return { error: `Editing this split would exceed the total cost of the expense (${existingExpense.totalCost}).` };
    }

    try {
      await this.userSplits.updateOne(
        { _id: existingSplit._id },
        { $set: { amountOwed } }
      );
      return {};
    } catch (e) {
      console.error("Error editing user split:", e);
      return { error: "Failed to edit user split due to a database error." };
    }
  }

  async removeUserSplit({ splitToRemove }: { splitToRemove: UserSplitId }): Promise<Empty | { error: string }> {
    const existingSplit = await this.userSplits.findOne({ _id: splitToRemove });
    if (!existingSplit) {
      return { error: `User split with ID ${splitToRemove} not found.` };
    }

    try {
      const deleteResult = await this.userSplits.deleteOne({ _id: splitToRemove });
      if (deleteResult.deletedCount === 0) {
        return { error: `Failed to remove user split with ID ${splitToRemove}.` };
      }
      return {};
    } catch (e) {
      console.error("Error removing user split:", e);
      return { error: "Failed to remove user split due to a database error." };
    }
  }

  // Query to get all user splits for a given expense
  private async getUserSplitsForExpense(expenseId: Expense): Promise<UserSplitDocument[]> {
    return await this.userSplits.find({ expense: expenseId }).toArray();
  }

  // Example query (not part of spec but useful for testing/understanding)
  async _getExpenseDetails(expenseId: Expense): Promise<Result<{ expense: ExpenseDocument; splits: UserSplitDocument[] }>> {
    const expense = await this.expenses.findOne({ _id: expenseId });
    if (!expense) {
      return { error: `Expense with ID ${expenseId} not found.` };
    }
    const splits = await this.userSplits.find({ expense: expenseId }).toArray();
    return { expense, splits };
  }
}
```
