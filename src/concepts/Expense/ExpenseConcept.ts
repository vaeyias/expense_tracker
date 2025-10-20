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

/** Represents a single user’s share in an expense */
interface UserSplits {
  _id: UserSplit;
  user: User;
  amountOwed: number;
  expense: Expense;
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
    group,
  }: {
    user: User;
    group: Group;
  }): Promise<{ expense: Expense } | { error: string }> {
    if (!group) return { error: "group is required" };

    const title = "";
    const description = "";
    const category = "";
    const totalCost = 0;
    const date = new Date();
    const payer = user;
    const userSplits: UserSplit[] = [];

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
      userSplits,
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
  }: {
    expenseToEdit: Expense;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
    payer?: User;
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

    const expenseDetails = await this.expenses.findOne({ _id: expenseToEdit });
    if (expenseDetails === undefined) return { error: "Expense not found" };
    const splitsList = expenseDetails?.userSplits;

    // check that splits add up to total cost
    const splits = await this.userSplits
      .find({ _id: { $in: splitsList } })
      .toArray();
    const targetTotal = totalCost ?? expenseDetails;
    if (targetTotal === undefined) return { error: "Expense not found" };
    const sum = splits.reduce((acc, s) => acc + s.amountOwed, 0);
    if (sum !== targetTotal) {
      return { error: "Sum of splits amounts must equal total cost" };
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

    const result = await this.expenses.updateOne(
      { _id: expense },
      { $addToSet: { userSplits: splitId } },
    );
    if (result.matchedCount === 0) return { error: "Expense not found" };

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

  /**
   * @requires user exists
   * @effects returns all expenses where the user is the payer or part of the userSplits
   */
  async _getExpensesByUser({ user }: { user: User }): Promise<Expenses[]> {
    const expensesAsPayer = await this.expenses.find({ payer: user }).toArray();

    // Get userSplit IDs for this user
    const splits = await this.userSplits.find({ user }).toArray();
    const expenseIds = splits.map((s) => s.expense);

    const expensesAsParticipant = await this.expenses
      .find({ _id: { $in: expenseIds } })
      .toArray();

    // Merge and remove duplicates
    const allExpenses = [
      ...expensesAsPayer,
      ...expensesAsParticipant.filter(
        (e) => !expensesAsPayer.some((p) => p._id === e._id),
      ),
    ];

    return allExpenses;
  }
}
