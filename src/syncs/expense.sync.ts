import { actions, Sync } from "@engine";
import {
  Authentication,
  Debt,
  Expense,
  Folder,
  Group,
  Requesting,
} from "@concepts";
import { ID } from "@utils/types.ts";

/* ---------- EXPENSE: ADD USER SPLIT (WITH DEBT UPDATE) ---------- */
export const AddUserSplitRequest: Sync = (
  { request, expense, creator, user, payer, amountOwed, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      creator,
      payer,
      amountOwed,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
  ),
});

export const AddUserSplitValidate: Sync = (
  { request, expense, creator, payer, user, amountOwed, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      creator,
      payer,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
  ),
  then: actions(
    [Expense.addUserSplit, { expense, user, amountOwed }],
  ),
});

export const AddUserSplitResponse: Sync = (
  {
    request,
    expense,
    user,
    creator,
    amountOwed,
    token,
    payer,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      payer,
      creator,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Expense.addUserSplit, {}, {}],
  ),
  then: user !== payer
    ? actions(
      [Debt.updateDebt, { payer, receiver: user, amount: amountOwed }],
      [Requesting.respond, { request }],
    )
    : actions(
      [Requesting.respond, { request }],
    ),
});

export const AddUserSplitResponseError: Sync = (
  { request, expense, creator, user, amountOwed, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      creator,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Expense.addUserSplit, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- EXPENSE: REMOVE USER SPLIT (WITH DEBT REVERSAL) ---------- */
// Note: RemoveUserSplit is typically called as part of authenticated expense editing
// Auth validation is handled at the expense editing level, so we skip it here
export const RemoveUserSplitRequest: Sync = (
  { request, expense, creator, userSplit, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/removeUserSplit",
      expense,
      userSplit,
      creator,
      token,
    }, { request }],
  ),
  then: actions([Authentication.validateToken, { user: creator, token }, {
    user: creator,
  }]), // No auth validation needed - handled at expense editing level
});

export const RemoveUserSplitValidate: Sync = (
  { request, expense, userSplit, token, creator, payer, receiver, amount },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/removeUserSplit",
      expense,
      userSplit,
      creator,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
  ),
  where: async (frames) => {
    // Fetch split and expense info BEFORE deletion to reverse debt later
    frames = await frames.query(
      async ({ expense: expenseId, userSplit: splitId }) => {
        const exp = await Expense._getExpenseById({
          expenseId: expenseId as unknown as ID,
        });
        const payerId = exp?.payer as ID | undefined;

        const split = await Expense._getUserSplitById({
          userSplit: splitId as unknown as ID,
        });
        const receiverId = split?.user as ID | undefined;
        const amountOwed = split?.amountOwed as number | undefined;

        if (!payerId || !receiverId || amountOwed === undefined) return [];

        // Bind payer/receiver/amount for use in Response phase
        return [{
          payer: payerId,
          receiver: receiverId,
          amount: -amountOwed, // Negative to reverse the debt
        }];
      },
      {
        expense: expense as unknown as ID,
        userSplit: userSplit as unknown as ID,
      },
      { payer, receiver, amount },
    );

    return frames;
  },
  then: actions(
    [Debt.updateDebt, { payer, receiver, amount }],
    [Expense.removeUserSplit, { expense, userSplit }],
  ),
});

export const RemoveUserSplitResponse: Sync = (
  { request, expense, userSplit, creator, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/removeUserSplit",
      expense,
      userSplit,
      creator,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Expense.removeUserSplit, {}, {}],
  ),
  then: actions(
    // Use the payer/receiver/amount fetched in Validate phase
    [Requesting.respond, { request }],
  ),
});

export const RemoveUserSplitResponseError: Sync = (
  { request, expense, creator, userSplit, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/removeUserSplit",
      expense,
      creator,
      userSplit,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Expense.removeUserSplit, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const CreateExpenseFullRequest: Sync = (
  {
    request,
    group,
    user,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/createExpense",
      group,
      user,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: user, token: token }],
  ),
});

export const CreateExpenseFullValidate: Sync = (
  {
    request,
    group,
    user,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/createExpense",
      group,
      user,
      token,
    }, { request }],
    [Authentication.validateToken, { user: user, token: token }, {
      user: user,
    }],
  ),
  then: actions(
    [Expense.createExpense, { user: user, group }],
  ),
});

export const CreateExpenseFullResponse: Sync = (
  {
    request,
    group,
    user,
    token,
    expense,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/createExpense",
      group,
      user,
      token,
    }, { request }],
    [Authentication.validateToken, { user: user, token }, { user: user }],
    [Expense.createExpense, {}, { expense }],
  ),
  then: actions(
    [Requesting.respond, { request, expense }],
  ),
});

export const CreateExpenseFullResponseError: Sync = (
  {
    request,
    group,
    user,
    token,
    error,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/createExpense",
      group,
      user,
      token,
    }, { request }],
    [Authentication.validateToken, { user: user, token }, { user: user }],
    [Expense.createExpense, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- EXPENSE -> DEBT COMPOSITES ---------- */

export const EditExpenseRequest: Sync = (
  {
    request,
    title,
    description,
    category,
    totalCost,
    date,
    payer,
    user,
    expenseToEdit,
    newExpense: _newExpense,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/editExpense",
      user,
      expenseToEdit,
      token,
      title,
      description,
      category,
      totalCost,
      date,
      payer,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const EditExpenseValidate: Sync = (
  {
    request,
    user,
    expenseToEdit,
    totalCost,
    date,
    payer,
    category,
    title,
    newExpense: _newExpense,
    description,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/editExpense",
      user,
      expenseToEdit,
      token,
      title,
      description,
      category,
      totalCost,
      date,
      payer,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Expense.editExpense, {
      expenseToEdit,
      newExpense: expenseToEdit,
      totalCost,
      token,
      description,
      date,
      payer,
      category,
      title,
    }],
  ),
});

export const EditExpenseResponse: Sync = (
  {
    request,
    user,
    expenseToEdit,
    title,
    description,
    category,
    totalCost,
    date,
    token,
    payer,
    newExpense,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/editExpense",
      user,
      expenseToEdit,
      token,
      title,
      description,
      category,
      totalCost,
      date,
      payer,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.editExpense, {}, { newExpense }],
  ),

  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const EditExpenseResponseError: Sync = (
  { request, user, expenseToEdit, newExpense: _newExpense, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/editExpense",
      user,
      expenseToEdit,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.editExpense, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

// When an expense is deleted, reverse debts for all splits then delete the expense
export const DeleteExpenseRequest: Sync = (
  {
    request,
    user,
    expenseToDelete,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/deleteExpense",
      user,
      expenseToDelete,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: user, token: token }],
  ),
});

export const DeleteExpenseValidate: Sync = (
  {
    request,
    user,
    expenseToDelete,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/deleteExpense",
      user,
      expenseToDelete,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Expense.deleteExpense, {
      expenseToDelete,
    }],
  ),
});

export const DeleteExpenseResponse: Sync = (
  {
    request,
    user,
    expenseToDelete,
    token,
  },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/deleteExpense",
      user,
      expenseToDelete,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.deleteExpense, {}, {}],
  ),

  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const DeleteExpenseResponseError: Sync = (
  { request, user, expenseToDelete, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/deleteExpense",
      user,
      expenseToDelete,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.deleteExpense, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});
