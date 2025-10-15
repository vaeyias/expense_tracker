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

/**
 * a set of UserSplits
 *   a user User
 *   a amountOwed Number
 *   an expense Expense # reference to the Expense
 */
interface UserSplit {
  _id: ID;
  user: User;
  amountOwed: number;
  expense: Expense;
}

export default class ExpenseConcept {
  expenses: Collection<Expenses>;
  userSplits: Collection<UserSplit>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX + "expenses");
    this.userSplits = this.db.collection(PREFIX + "userSplits");
  }

  /**
   * @requires user exists and is a member in group, totalCost >= 0, all splits.amountOwed >= 0
   * @effects creates an Expense with the given details and its UserSplits
   */
  async createExpense({
    user,
    title,
    category,
    date,
    totalCost,
    description,
    group,
    splits = [],
  }: {
    user: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
    splits?: { user: User; amountOwed: number }[];
  }): Promise<{ expense: Expense } | { error: string }> {
    if (!user) return { error: "user is required" };
    if (totalCost < 0) return { error: "totalCost cannot be negative" };

    const totalSplit = splits.reduce((sum, s) => sum + s.amountOwed, 0);
    if (Math.abs(totalSplit - totalCost) > 0.001) {
      return { error: "Sum of splits must equal totalCost" };
    }

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

    // Insert UserSplits
    for (const split of splits) {
      if (split.amountOwed < 0) {
        return { error: "split amountOwed cannot be negative" };
      }
      await this.userSplits.insertOne({
        _id: await freshID(),
        user: split.user,
        amountOwed: split.amountOwed,
        expense: newExpenseId,
      });
    }

    return { expense: newExpenseId };
  }

  /**
   * @requires expenseToEdit exists, totalCost>=0, all numbers in splits.amountOwed >= 0
   * @effects updates the Expense and optionally replaces its UserSplits
   */
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
  }): Promise<{ newExpense: Expense } | { error: string }> {
    const updateData: Partial<Expenses> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (totalCost !== undefined) {
      if (totalCost < 0) return { error: "totalCost cannot be negative" };
      updateData.totalCost = totalCost;
    }
    if (date !== undefined) updateData.date = date;

    const result = await this.expenses.findOneAndUpdate(
      { _id: expenseToEdit },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) return { error: "Expense not found" };

    // Update UserSplits if provided
    if (splits) {
      const totalSplit = splits.reduce((sum, s) => sum + s.amountOwed, 0);
      if (totalCost !== undefined && Math.abs(totalSplit - totalCost) > 0.001) {
        return { error: "Sum of splits must equal totalCost" };
      }

      // Remove existing splits
      await this.userSplits.deleteMany({ expense: expenseToEdit });

      // Insert new splits
      for (const split of splits) {
        if (split.amountOwed < 0) {
          return { error: "split amountOwed cannot be negative" };
        }
        await this.userSplits.insertOne({
          _id: await freshID(),
          user: split.user,
          amountOwed: split.amountOwed,
          expense: expenseToEdit,
        });
      }
    }

    return { newExpense: result._id };
  }

  /**
   * @requires expenseToDelete exists
   * @effects deletes the Expense and all associated UserSplits
   */
  async deleteExpense({
    expenseToDelete,
  }: {
    expenseToDelete: Expense;
  }): Promise<{ deletedExpense: Expense } | { error: string }> {
    const result = await this.expenses.findOneAndDelete({
      _id: expenseToDelete,
    });

    if (!result) return { error: "Expense not found" };

    // Remove all associated UserSplits
    await this.userSplits.deleteMany({ expense: expenseToDelete });

    return { deletedExpense: result._id };
  }

  /**
   * @requires expense exists, amountOwed >= 0
   * @effects adds a split for the user in the given expense
   */
  async addUserSplit({
    expense,
    user,
    amountOwed,
  }: {
    expense: Expense;
    user: User;
    amountOwed: number;
  }): Promise<{ split: UserSplit } | { error: string }> {
    if (amountOwed < 0) return { error: "amountOwed cannot be negative" };
    const expenseExists = await this.expenses.findOne({ _id: expense });
    if (!expenseExists) return { error: "Expense not found" };

    const split: UserSplit = {
      _id: await freshID(),
      user,
      amountOwed,
      expense,
    };
    await this.userSplits.insertOne(split);
    return { split };
  }

  /**
   * @requires expense and user exist in UserSplit, amountOwed >= 0
   * @effects updates the UserSplit with the new amountOwed
   */
  async editUserSplit({
    expense,
    user,
    amountOwed,
  }: {
    expense: Expense;
    user: User;
    amountOwed: number;
  }): Promise<{ split: UserSplit } | { error: string }> {
    if (amountOwed < 0) return { error: "amountOwed cannot be negative" };
    const result = await this.userSplits.findOneAndUpdate(
      { expense, user },
      { $set: { amountOwed } },
      { returnDocument: "after" },
    );
    if (!result) return { error: "UserSplit not found" };
    return { split: result };
  }

  /**
   * @requires splitToRemove exists
   * @effects deletes the UserSplit
   */
  async removeUserSplit({
    splitToRemove,
  }: {
    splitToRemove: ID;
  }): Promise<Empty | { error: string }> {
    const result = await this.userSplits.deleteOne({ _id: splitToRemove });
    if (result.deletedCount === 0) return { error: "UserSplit not found" };
    return {};
  }

  // Queries

  /**
   * @requires group exists
   * @effects returns all expenses in the group
   */
  async _getExpensesByGroup({ group }: { group: Group }): Promise<Expenses[]> {
    return await this.expenses.find({ group }).toArray();
  }

  /**
   * @requires expenseId exists
   * @effects returns the expense document or null if not found
   */
  async _getExpenseById(
    { expenseId }: { expenseId: Expense },
  ): Promise<Expenses | null> {
    return await this.expenses.findOne({ _id: expenseId });
  }

  /**
   * @requires expense exists
   * @effects returns all UserSplits for the expense
   */
  async _getSplitsByExpense(
    { expense }: { expense: Expense },
  ): Promise<UserSplit[]> {
    return await this.userSplits.find({ expense }).toArray();
  }
}
