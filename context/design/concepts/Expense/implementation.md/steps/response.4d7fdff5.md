---
timestamp: 'Tue Oct 14 2025 21:58:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251014_215844.54ade9f9.md]]'
content_id: 4d7fdff548e835d3d4da7895be842f43482398870961bcf31c86620fd82103ae
---

# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

// Generic types of this concept
type Item = ID; // An item that can have an expense associated with it.
type Currency = ID; // The currency in which the expense is recorded.

const PREFIX = "Expense" + ".";

/**
 * Represents the details of an expense.
 * _id is the ID of the item this expense is associated with.
 * amount is the monetary value of the expense.
 * currency is the currency of the expense.
 */
interface Expenses {
  _id: Item;
  amount: number;
  currency: Currency;
}

export default class ExpenseConcept {
  expenses: Collection<Expenses>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX + "expenses");
  }

  /**
   * Records an expense for a given item.
   *
   * @param {object} args - The arguments for the action.
   * @param {Item} args.item - The ID of the item the expense is for.
   * @param {number} args.amount - The amount of the expense.
   * @param {Currency} args.currency - The currency of the expense.
   * @returns {Promise<Empty | { error: string }>} An empty object on success, or an error object.
   */
  async record({
    item,
    amount,
    currency,
  }: {
    item: Item;
    amount: number;
    currency: Currency;
  }): Promise<Empty | { error: string }> {
    // requires: amount >= 0
    if (amount < 0) {
      return { error: "Amount cannot be negative." };
    }

    // effects: record the expense for the item
    try {
      await this.expenses.updateOne(
        { _id: item },
        { $set: { amount, currency } },
        { upsert: true },
      );
      return {};
    } catch (e) {
      // Handle potential database errors
      console.error("Error recording expense:", e);
      return { error: "Failed to record expense due to a database error." };
    }
  }

  /**
   * Retrieves the expense associated with a given item.
   *
   * @param {object} args - The arguments for the query.
   * @param {Item} args.item - The ID of the item to retrieve the expense for.
   * @returns {Promise<{ expense: Expenses | null }>} The expense details or null if not found.
   */
  async _getExpense({ item }: { item: Item }): Promise<{ expense: Expenses | null }> {
    const expense = await this.expenses.findOne({ _id: item });
    return { expense };
  }

  /**
   * Retrieves all expenses.
   *
   * @returns {Promise<{ expenses: Expenses[] }>} A list of all expenses.
   */
  async _getAllExpenses(): Promise<{ expenses: Expenses[] }> {
    const expenses = await this.expenses.find().toArray();
    return { expenses };
  }
}
```
