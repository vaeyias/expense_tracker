import { Collection, Db } from "npm:mongodb";
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
 *   a group Group
 */
interface Expenses {
  _id: ID;
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

  /**
   * @requires creator and payer exists, creator, payer and all users in debtMapping are in the given group, totalCost > 0, all numbers in debtMapping are nonnegative
   * @effects creates an Expense with the given details
   */
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
  }): Promise<{ expense: Expense } | { error: string }> {
    // Validation: ensure required fields exist
    if (!user) return { error: "user is required" };

    if (totalCost <= 0) return { error: "totalCost must be greater than 0" };

    const newExpenseId = freshID() as Expense;

    const expenseDocument: Expenses = {
      _id: newExpenseId,
      title,
      description,
      category,
      totalCost,
      date,
      group,
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
  }): Promise<{ newExpense: Expense } | { error: string }> {
    const updateData: Partial<Expenses> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (totalCost !== undefined) {
      if (totalCost <= 0) return { error: "totalCost must be greater than 0" };
      updateData.totalCost = totalCost;
    }
    if (date !== undefined) updateData.date = date;

    const result = await this.expenses.findOneAndUpdate(
      { _id: expenseToEdit },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      // Handle non-existent expense
      console.error(`Expense with ID ${expenseToEdit} not found for editing.`);
      return { error: "Expense not found" };
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
  }): Promise<{ deletedExpense: Expense } | { error: string }> {
    const result = await this.expenses.findOneAndDelete({
      _id: expenseToDelete,
    });

    if (!result) {
      // Handle non-existent expense
      console.error(
        `Expense with ID ${expenseToDelete} not found for deletion.`,
      );
      return { error: "Expense not found" };
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
