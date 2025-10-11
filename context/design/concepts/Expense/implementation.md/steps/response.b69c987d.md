---
timestamp: 'Sat Oct 11 2025 11:39:32 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_113932.8791c5de.md]]'
content_id: b69c987d2d34016a60dc3e5421bd31d7249d10420a1b7804200f9db57abe6773
---

# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

// Declare collection prefix, use concept name
const PREFIX = "Expense" + ".";

// Generic types of this concept
type User = ID;
type Group = ID;
type Expense = ID;

/**
 * a set of Expenses
 *   a title String
 *   a description String (optional)
 *   a category String
 *   a totalCost Number
 *   a date Date
 *   a creator User
 *   a payer User
 *   a group Group
 *   a debtMapping Map<User:Number>
 */
interface Expenses {
  _id: Expense;
  title: string;
  description?: string;
  category: string;
  totalCost: number;
  date: Date;
  creator: User;
  payer: User;
  group: Group;
  debtMapping: Record<User, number>; // MongoDB stores maps as nested documents
}

export default class ExpenseConcept {
  expenses: Collection<Expenses>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX + "expenses");
  }

  /**
   * @requires creator and payer exists, creator, payer and all users in debtMapping are in the given group, totalCost > 0, all numbers in debtMapping are nonnegative
   * @effects creates an Expense with the given details
   */
  async createExpense({
    creator,
    payer,
    title,
    category,
    date,
    totalCost,
    description,
    group,
    debtMapping,
  }: {
    creator: User;
    payer: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
    debtMapping: Record<User, number>;
  }): Promise<{ expense: Expense }> {
    // Placeholder for actual validation and DB insertion
    const newExpenseId = "expense:" + Date.now(); // Simulate ID generation

    const expenseDocument: Expenses = {
      _id: newExpenseId as Expense,
      title,
      description,
      category,
      totalCost,
      date,
      creator,
      payer,
      group,
      debtMapping,
    };

    await this.expenses.insertOne(expenseDocument);

    return { expense: newExpenseId };
  }

  /**
   * @requires expenseToEdit exists, totalCost>0, editor and payer are in the expenseToEdit.group. all numbers in debtMapping are nonnegative
   * @effects updates the Expense with the given details.
   */
  async editExpense({
    expenseToEdit,
    editor,
    payer,
    title,
    description,
    category,
    totalCost,
    date,
    debtMapping,
  }: {
    expenseToEdit: Expense;
    editor: User;
    payer?: User;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
    debtMapping?: Record<User, number>;
  }): Promise<{ newExpense: Expense }> {
    const updateData: Partial<Expenses> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (totalCost !== undefined) updateData.totalCost = totalCost;
    if (date !== undefined) updateData.date = date;
    if (payer !== undefined) updateData.payer = payer;
    if (debtMapping !== undefined) updateData.debtMapping = debtMapping;

    const result = await this.expenses.findOneAndUpdate(
      { _id: expenseToEdit },
      { $set: updateData },
      { returnDocument: "after" } // Return the updated document
    );

    if (!result) {
      // Handle the case where expenseToEdit does not exist
      // In a real application, this might throw an error or return a specific error object.
      // For now, we'll return an empty object to signify an issue, though this might not be ideal.
      console.error(`Expense with ID ${expenseToEdit} not found for editing.`);
      return { newExpense: "" as Expense }; // Indicate failure
    }

    return { newExpense: result._id };
  }

  /**
   * @requires expenseToDelete exists.
   * @effects deletes the Expense.
   */
  async deleteExpense({
    expenseToDelete,
  }: {
    expenseToDelete: Expense;
  }): Promise<{ deletedExpense: Expense }> {
    const result = await this.expenses.findOneAndDelete({
      _id: expenseToDelete,
    });

    if (!result) {
      // Handle the case where expenseToDelete does not exist
      console.error(`Expense with ID ${expenseToDelete} not found for deletion.`);
      return { deletedExpense: "" as Expense }; // Indicate failure
    }

    return { deletedExpense: result._id };
  }

  // Example of a query to retrieve expenses
  async _getExpensesByGroup({ group }: { group: Group }): Promise<Expenses[]> {
    return await this.expenses.find({ group: group }).toArray();
  }

  async _getExpenseById({ expenseId }: { expenseId: Expense }): Promise<Expenses | null> {
    return await this.expenses.findOne({ _id: expenseId });
  }
}
```
