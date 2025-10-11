
[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

## AI generated then manually fixed:

```import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
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
    // Validation: ensure required fields exist
    if (!creator) throw new Error("creator is required");
    if (!payer) throw new Error("payer is required");
    if (totalCost <= 0) throw new Error("totalCost must be greater than 0");

    // Validation: all debtMapping amounts are non-negative
    for (const [user, amount] of Object.entries(debtMapping)) {
      if (amount < 0) {
        throw new Error(`Debt for user ${user} cannot be negative`);
      }
    }

    // Validation: sum of debtMapping equals totalCost
    const totalDebt = Object.values(debtMapping).reduce((a, b) => a + b, 0);
    if (Math.abs(totalDebt - totalCost) > 0.001) {
      throw new Error(
        `Sum of debtMapping (${totalDebt}) does not equal totalCost (${totalCost})`,
      );
    }

    // TODO: validate creator, payer, and all users in debtMapping are in the group
    // Placeholder for group membership validation
    // e.g., check against a Group collection if implemented

    const newExpenseId = freshID() as Expense;

    const expenseDocument: Expenses = {
      _id: newExpenseId,
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
    if (totalCost !== undefined) {
      if (totalCost <= 0) throw new Error("totalCost must be greater than 0");
      updateData.totalCost = totalCost;
    }
    if (date !== undefined) updateData.date = date;
    if (payer !== undefined) updateData.payer = payer;
    if (debtMapping !== undefined) {
      for (const [user, amount] of Object.entries(debtMapping)) {
        if (amount < 0) {
          throw new Error(`Debt for user ${user} cannot be negative`);
        }
      }
      if (totalCost !== undefined) {
        const totalDebt = Object.values(debtMapping).reduce((a, b) => a + b, 0);
        if (Math.abs(totalDebt - totalCost) > 0.001) {
          throw new Error(
            `Sum of debtMapping (${totalDebt}) does not equal totalCost (${totalCost})`,
          );
        }
      }
      updateData.debtMapping = debtMapping;
    }

    // TODO: validate editor and payer (if changed) are in the group
    const result = await this.expenses.findOneAndUpdate(
      { _id: expenseToEdit },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      // Handle non-existent expense
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
      // Handle non-existent expense
      console.error(
        `Expense with ID ${expenseToDelete} not found for deletion.`,
      );
      return { deletedExpense: "" as Expense }; // Indicate failure
    }

    return { deletedExpense: result._id };
  }

  // Example of a query to retrieve expenses
  async _getExpensesByGroup({ group }: { group: Group }): Promise<Expenses[]> {
    return await this.expenses.find({ group: group }).toArray();
  }

  async _getExpenseById(
    { expenseId }: { expenseId: Expense },
  ): Promise<Expenses | null> {
    return await this.expenses.findOne({ _id: expenseId });
  }
}
```
