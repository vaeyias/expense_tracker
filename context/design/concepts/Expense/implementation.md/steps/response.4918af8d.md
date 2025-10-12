---
timestamp: 'Sat Oct 11 2025 23:01:15 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_230115.f68ebc42.md]]'
content_id: 4918af8d65f8ae6d230618657d046f787c1c49ee64022e713c77edcb6b53c52f
---

# response:

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

const PREFIX = "Expense" + ".";

// Generic types
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
 *   a group Group # reference to the group it belongs to
 */
interface Expenses {
  _id: Expense;
  user: User;
  title: string;
  description?: string;
  category: string;
  totalCost: number;
  date: Date;
  group: Group;
}

export default class ExpenseConcept {
  expenses: Collection<Expenses>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX + "expenses");
  }

  async createExpense({
    user,
    title,
    category,
    date,
    totalCost,
    description,
    group,
  }: {
    user: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
  }): Promise<{ expense: Expense }> {
    // Assuming user exists and is a member in group is handled by syncs or other concepts.
    // We'll just check totalCost > 0 here as per requires.
    if (totalCost <= 0) {
      throw new Error("Total cost must be greater than 0.");
    }

    const newExpense: Expenses = {
      _id: await freshID(), // Using freshID utility for MongoDB compatibility
      user: user,
      title: title,
      description: description,
      category: category,
      totalCost: totalCost,
      date: new Date(date), // Ensure date is a Date object
      group: group,
    };

    await this.expenses.insertOne(newExpense);

    return { expense: newExpense._id };
  }

  async editExpense({
    expenseToEdit,
    title,
    description,
    category,
    totalCost,
    date,
  }: {
    expenseToEdit: Expense;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
  }): Promise<{ newExpense: Expense }> {
    // Requires expenseToEdit exists, totalCost > 0 (if provided)
    const existingExpense = await this.expenses.findOne({ _id: expenseToEdit });
    if (!existingExpense) {
      throw new Error("Expense to edit does not exist.");
    }

    if (totalCost !== undefined && totalCost <= 0) {
      throw new Error("Total cost must be greater than 0.");
    }

    const update: Partial<Expenses> = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (category !== undefined) update.category = category;
    if (totalCost !== undefined) update.totalCost = totalCost;
    if (date !== undefined) update.date = new Date(date); // Ensure date is a Date object

    await this.expenses.updateOne({ _id: expenseToEdit }, { $set: update });

    return { newExpense: expenseToEdit };
  }

  async deleteExpense({
    expenseToDelete,
  }: {
    expenseToDelete: Expense;
  }): Promise<{ deletedExpense: Expense }> {
    // Requires expenseToDelete exists.
    const result = await this.expenses.deleteOne({ _id: expenseToDelete });
    if (result.deletedCount === 0) {
      throw new Error("Expense to delete does not exist.");
    }
    return { deletedExpense: expenseToDelete };
  }

  // Helper function to get a fresh ID for MongoDB, similar to ObjectId but string-based
  // In a real scenario, this would be imported from @utils/database.ts
  private async freshID(): Promise<Expense> {
    // Mock implementation: In a real app, this would generate a unique string ID.
    // For demonstration, we'll use a simple prefix to simulate string IDs.
    // In a real implementation with MongoDB, you'd likely use ObjectId and then convert to string.
    // For this example, we'll use a simpler approach that aligns with the generic ID concept.
    // In a real MongoDB setup, you would use `new ObjectId().toString()`.
    // For this context, let's assume a utility function `freshID` exists.
    // Since we don't have the actual @utils/database.ts, we'll simulate it.
    // In a true Deno/MongoDB setup, you'd use something like:
    // return new ObjectId().toString() as Expense;

    // For this mock, let's just return a placeholder string ID
    // In a real setup, ensure this conforms to your ID type (e.g., string)
    // and generates unique values.
    // Let's simulate a unique ID generation:
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `expense:${timestamp}:${random}` as Expense;
  }
}
```
