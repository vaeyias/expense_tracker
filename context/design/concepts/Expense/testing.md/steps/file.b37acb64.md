---
timestamp: 'Sat Oct 11 2025 12:24:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_122416.81982c7a.md]]'
content_id: b37acb642abfd2cf937375d715a4deb412b681def127f05d754a6ae825f21102
---

# file: src/Expense/ExpenseConcept.ts

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Generic types of this concept
type User = ID;
type Category = ID;
type ExpenseID = ID;

// Define the structure of an Expense document in MongoDB
interface ExpenseDocument {
  _id: ExpenseID;
  user: User;
  category: Category;
  amount: number;
  description: string;
  date: Date;
}

export default class ExpenseConcept {
  private readonly expenses: Collection<ExpenseDocument>;
  private readonly expenseCollectionName = "expenses";

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection<ExpenseDocument>(this.expenseCollectionName);
  }

  /**
   * Adds a new expense to the user's records.
   * @param user The ID of the user who incurred the expense.
   * @param category The ID of the category the expense belongs to.
   * @param amount The amount of the expense.
   * @param description A brief description of the expense.
   * @param date The date the expense was incurred.
   * @returns The created expense object.
   */
  async addExpense({
    user,
    category,
    amount,
    description,
    date,
  }: {
    user: User;
    category: Category;
    amount: number;
    description: string;
    date: Date;
  }): Promise<{ expense: ExpenseDocument }> {
    // Precondition: true, so no explicit check needed for the spec.
    // In a real-world scenario, we might add checks for valid user/category IDs, amount > 0, etc.

    const newExpense: ExpenseDocument = {
      _id: freshID(),
      user: user,
      category: category,
      amount: amount,
      description: description,
      date: date,
    };

    await this.expenses.insertOne(newExpense);

    return { expense: newExpense };
  }

  /**
   * Deletes an expense from the records.
   * @param expense The ID of the expense to delete.
   * @returns An empty object indicating success.
   */
  async deleteExpense({ expense }: { expense: ExpenseID }): Promise<Empty> {
    // Precondition: the expense exists in the state
    const result = await this.expenses.deleteOne({ _id: expense });
    if (result.deletedCount === 0) {
      throw new Error(`Expense with ID ${expense} not found.`);
    }
    return {};
  }

  /**
   * Retrieves a list of expenses for a given user and category.
   * @param user The ID of the user.
   * @param category The ID of the category.
   * @returns A list of expense objects.
   */
  async getExpenses({
    user,
    category,
  }: {
    user: User;
    category: Category;
  }): Promise<{ expenses: ExpenseDocument[] }> {
    // Precondition: the user and category exist.
    // This spec implies that if they don't exist, we'd still return an empty list.
    // In a more robust system, we might check for existence first.

    const expenses = await this.expenses
      .find({ user: user, category: category })
      .toArray();

    return { expenses };
  }
}
```
