import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import { PassThrough } from "node:stream";

// Declare collection prefixes
const PREFIX_EXPENSE = "Expense.";
const PREFIX_USERSPLIT = "UserSplit.";

// Generic types
type User = ID;
type Group = ID;
type Expense = ID;
type UserSplit = ID;

/** Represents a single user’s share in an expense */
interface UserSplits {
  _id: UserSplit;
  user: User;
  amountOwed: number;
  expense: Expense;
}

/** Represents an Expense document */
interface Expenses {
  _id: Expense;
  title: string;
  description?: string;
  category: string;
  totalCost: number;
  date: Date;
  group: Group;
  payer: User;
  userSplits: UserSplit[]; // array of UserSplit IDs
}

export default class ExpenseConcept {
  expenses: Collection<Expenses>;
  userSplits: Collection<UserSplits>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX_EXPENSE + "expenses");
    this.userSplits = this.db.collection(PREFIX_USERSPLIT + "usersplits");
  }

  /**
   * @requires user exists and is a member in group, totalCost >= 0, sum of userSplits.amountOwed equals totalCost
   * @effects creates an Expense with the given details
   */
  /**
   * @requires user exists, totalCost >= 0
   * @effects creates an Expense with given details and userSplit IDs if valid
   */
  async createExpense({
    user,
    title,
    category,
    date,
    totalCost,
    description,
    group,
    payer,
    userSplits,
  }: {
    user: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
    payer: User;
    userSplits?: UserSplit[];
  }): Promise<{ expense: Expense } | { error: string }> {
    if (!user) return { error: "user is required" };
    if (!payer) return { error: "payer is required" };

    if (totalCost < 0) return { error: "totalCost cannot be negative" };

    if (userSplits && userSplits.length > 0) {
      const splits = await this.userSplits
        .find({ _id: { $in: userSplits } })
        .toArray();
      const sum = splits.reduce((acc, s) => acc + s.amountOwed, 0);
      if (sum !== totalCost) {
        return { error: "Sum of userSplits amounts must equal totalCost" };
      }
    }

    const newExpenseId = (await freshID()) as Expense;
    const expenseDocument: Expenses = {
      _id: newExpenseId,
      title,
      description,
      category,
      totalCost,
      date,
      group,
      payer,
      userSplits: userSplits || [],
    };

    await this.expenses.insertOne(expenseDocument);
    return { expense: newExpenseId };
  }

  /**
   * @requires expenseToEdit exists, totalCost >= 0, sum of userSplits.amountOwed equals totalCost
   * @effects updates the Expense with the given details
   */

  async editExpense({
    expenseToEdit,
    title,
    description,
    category,
    totalCost,
    date,
    payer,
    userSplits,
  }: {
    expenseToEdit: Expense;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
    payer?: User;
    userSplits?: UserSplit[];
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
    if (payer !== undefined) updateData.payer = payer;

    if (userSplits !== undefined) {
      const splits = await this.userSplits
        .find({ _id: { $in: userSplits } })
        .toArray();
      const targetTotal = totalCost ??
        (await this.expenses.findOne({ _id: expenseToEdit }))?.totalCost;
      if (targetTotal === undefined) return { error: "Expense not found" };
      const sum = splits.reduce((acc, s) => acc + s.amountOwed, 0);
      if (sum !== targetTotal) {
        return { error: "Sum of userSplits amounts must equal totalCost" };
      }

      updateData.userSplits = userSplits;
    }

    const result = await this.expenses.findOneAndUpdate(
      { _id: expenseToEdit },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) return { error: "Expense not found" };
    return { newExpense: expenseToEdit };
  }

  /**
   * @requires expenseToDelete exists
   * @effects deletes expense
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

    return { deletedExpense: result._id };
  }

  /**
   * @requires expense exists, amountOwed>=0, user does not have a userSplit in the expense already
   * @effects adds a user split to the expense and returns its ID
   */
  async addUserSplit({
    expense,
    user,
    amountOwed,
  }: {
    expense: Expense;
    user: User;
    amountOwed: number;
  }): Promise<{ userSplit: UserSplit } | { error: string }> {
    if (amountOwed < 0) return { error: "amountOwed must be >= 0" };

    const expenseExists = await this.expenses.findOne({ _id: expense });
    if (!expenseExists) return { error: "Expense not found" };

    const existingSplit = await this.userSplits.findOne({
      expense: expense,
      user,
    });
    if (existingSplit) {
      return { error: "User already has a split in this expense" };
    }
    const splitId = (await freshID()) as UserSplit;
    await this.userSplits.insertOne({
      _id: splitId,
      user,
      amountOwed,
      expense,
    });

    return { userSplit: splitId };
  }

  /**
   * @requires userSplit exists
   * @effects adds a user split to the expense and returns its ID
   */
  async editUserSplit({
    userSplit,
    user,
    amountOwed,
  }: {
    userSplit: UserSplit;
    user?: User;
    amountOwed?: number;
  }): Promise<{ userSplit: UserSplit } | { error: string }> {
    const updateData: Partial<UserSplits> = {};
    if (amountOwed !== undefined) updateData.amountOwed = amountOwed;
    if (amountOwed !== undefined && amountOwed < 0) {
      return { error: "amountOwed must be >= 0" };
    }
    const userSplitRes = await this.userSplits.findOne({ _id: userSplit });
    if (!userSplitRes) return { error: "User Split not found" };

    // Check if there's already a split with this user in the same expense
    if (user !== undefined) {
      const existingSplit = await this.userSplits.findOne({
        expense: userSplitRes.expense,
        user: user,
      });

      if (existingSplit) {
        return { error: "User already has a split in this expense" };
      }
      updateData.user = user;
    }

    const result = await this.userSplits.findOneAndUpdate(
      { _id: userSplit },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) return { error: "User Split not found" };
    return { userSplit: result._id };
  }

  /**
   * @requires expense exists, amountOwed>=0
   * @effects removes a user split from the expense
   */
  async removeUserSplit({
    expense,
    userSplit,
  }: {
    expense: Expense;
    userSplit: UserSplit;
  }): Promise<{} | { error: string }> {
    const result = await this.expenses.updateOne(
      { _id: expense },
      { $pull: { userSplits: userSplit } },
    );
    if (result.matchedCount === 0) return { error: "Expense not found" };
    await this.userSplits.deleteOne({ _id: userSplit });
    return {};
  }

  // Internal queries
  async _getExpensesByGroup({ group }: { group: Group }): Promise<Expenses[]> {
    return await this.expenses.find({ group }).toArray();
  }

  async _getExpenseById(
    { expenseId }: { expenseId: Expense },
  ): Promise<Expenses | null> {
    return await this.expenses.findOne({ _id: expenseId });
  }

  async _getUserSplitById(
    { userSplit }: { userSplit: UserSplit },
  ): Promise<UserSplits | null> {
    return await this.userSplits.findOne({ _id: userSplit });
  }

  /**
   * @requires valid expense ID
   * @effects returns all user splits associated with the given expense
   */
  async _getSplitsByExpense({ expenseId }: { expenseId: ID }) {
    const splits = await this.userSplits.find({ expense: expenseId }).toArray();
    return { splits };
  }
}
