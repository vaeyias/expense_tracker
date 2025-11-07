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
    receiver,
    amount,
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
  where: async (frames) => {
    // Fetch expense to get payer, then update debt for this split
    frames = await frames.query(
      async ({ expense: expenseId, user: userId, amountOwed: owed }) => {
        const exp = await Expense._getExpenseById({
          expenseId: expenseId as unknown as ID,
        });
        const payerId = exp?.payer as ID | undefined;
        if (!payerId) return [];

        // The user in the split is the receiver (they owe the payer)
        return [{
          payer: payerId,
          receiver: userId as unknown as ID,
          amount: owed as number,
        }];
      },
      {
        expense: expense as unknown as ID,
        user: user as unknown as ID,
        amountOwed: amountOwed as unknown as number,
      },
      { payer, receiver, amount },
    );

    return frames;
  },
  then: actions(
    [Debt.updateDebt, { payer, receiver, amount }],
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

// export const ListGroupMembersResponse: Sync = (
//   { request, group, members },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/_listMembers", group }, {
//       request,
//     }],
//   ),
//   where: async (frames) => {
//     // Resolve member IDs to full user objects so frontend gets User[] in one
//     // request. Use frames.query with an input mapping for `group` so each
//     // incoming frame's bound `group` value is available.
//     frames = await frames.query(
//       async ({ group }) => {
//         const ids = await Group._listMembers({ group });
//         console.log("ids", ids);
//         const users: Record<string, unknown>[] = [];
//         for (const id of ids) {
//           const r = await Authentication._getUserById({
//             user: String(id) as unknown as ID,
//           });
//           const rr = r as {
//             userInfo?: Record<string, unknown>;
//             error?: string;
//           };
//           if (rr.userInfo) users.push(rr.userInfo);
//         }

//         return [{ members: users }];
//       },
//       { group },
//       { members },
//     );

//     return frames;
//   },
//   then: actions(
//     [Requesting.respond, { request, members }],
//   ),
// });

// export const LeaveGroupRequest: Sync = (
//   { request, group, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
//       request,
//     }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: member, token }],
//   ),
// });

// export const LeaveGroupValidate: Sync = (
//   { request, group, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user: member, token }, { user: member }],
//   ),
//   then: actions(
//     [Group.leaveGroup, { group, member }],
//   ),
// });

// export const LeaveGroupResponse: Sync = (
//   { request, group, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user: member, token }, { user: member }],
//     [Group.leaveGroup, {}, { left: true }],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

// export const LeaveGroupResponseError: Sync = (
//   { request, group, member, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user: member, token }, { user: member }],
//     [Group.leaveGroup, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// export const DeleteGroupRequest: Sync = (
//   { request, group, user, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
//       request,
//     }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const DeleteGroupValidate: Sync = (
//   { request, group, user, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user, token }, { user }],
//   ),
//   then: actions(
//     [Group.deleteGroup, { group }],
//   ),
// });

// export const DeleteGroupResponse: Sync = (
//   { request, group, user, token },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Group.deleteGroup, {}, {}],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

// export const DeleteGroupResponseError: Sync = (
//   { request, group, user, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Group.deleteGroup, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// /* ---------- COMPOSITES TO REDUCE FRONTEND CALLS ---------- */

// export const CreateGroupAndAddToFolderRequest: Sync = (
//   { request, creator, name, description, token, folderName },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//       folderName,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: creator, token }],
//   ),
// });

// export const CreateGroupAndAddToFolderValidate: Sync = (
//   { request, creator, name, description, token, folderName },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//       folderName,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//   ),
//   then: actions(
//     [Group.createGroup, { creator, name, description }],
//   ),
// });

// export const CreateGroupAndAddToFolderResponse: Sync = (
//   { request, creator, name, description, token, folderName, group },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//       folderName,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//     [Group.createGroup, {}, { group }],
//   ),
//   then: actions(
//     [Folder.addGroupToFolder, {
//       user: creator,
//       folderName: folderName ?? ".root",
//       group,
//     }],
//     [Requesting.respond, {
//       request,
//       group: { _id: group, name, description, creator },
//     }],
//   ),
// });

// export const CreateGroupAndAddToFolderResponseError: Sync = (
//   { request, creator, name, description, token, folderName, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//       folderName,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//     [Group.createGroup, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// export const AddUserAndSetupRequest: Sync = (
//   { request, group, inviter, newMember, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/addUser",
//       group,
//       inviter,
//       newMember,
//       token,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: inviter, token }],
//   ),
// });

// export const AddUserAndSetupValidate: Sync = (
//   { request, group, inviter, newMember, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/addUser",
//       group,
//       inviter,
//       newMember,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
//   ),
//   then: actions(
//     [Group.addUser, { group, inviter, newMember }],
//   ),
// });

// export const AddUserAndSetupResponse: Sync = (
//   { request, group, inviter, newMember, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/addUser",
//       group,
//       inviter,
//       newMember,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
//     [Group.addUser, {}, {}],
//   ),
//   then: actions(
//     [Folder.addGroupToFolder, { user: newMember, folderName: ".root", group }],
//     [Requesting.respond, { request }],
//   ),
// });

// export const AddUserAndSetupResponseError: Sync = (
//   { request, group, inviter, newMember, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/addUser",
//       group,
//       inviter,
//       newMember,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
//     [Group.addUser, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// export const RemoveUserAndCleanupRequest: Sync = (
//   { request, group, remover, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: remover, token }],
//   ),
// });

// export const RemoveUserAndCleanupValidate: Sync = (
//   { request, group, remover, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//     [Authentication.validateToken, { user: remover, token }, { user: remover }],
//   ),
//   then: actions(
//     [Folder.removeGroupFromFolder, {
//       user: member,
//       folder: memberFolder,
//       group,
//     }],
//     [Group.removeUser, { group, remover, member }],
//   ),
// });

// export const RemoveUserAndCleanupResponse: Sync = (
//   { request, group, remover, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//     [Authentication.validateToken, { user: remover, token }, { user: remover }],
//     [Folder.removeGroupFromFolder, {}, {}],
//     [Group.removeUser, {}, {}],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

// export const LeaveGroupAndCleanupRequest: Sync = (
//   { request, group, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/leaveGroup",
//       group,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: member, token }],
//   ),
// });

// export const LeaveGroupAndCleanupValidate: Sync = (
//   { request, group, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/leaveGroup",
//       group,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//     [Authentication.validateToken, { user: member, token }, { user: member }],
//   ),
//   then: actions(
//     [Folder.removeGroupFromFolder, {
//       user: member,
//       folder: memberFolder,
//       group,
//     }],
//     [Group.leaveGroup, { group, member }],
//   ),
// });

// export const LeaveGroupAndCleanupResponse: Sync = (
//   { request, group, member, token, memberFolder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/leaveGroup",
//       group,
//       member,
//       token,
//       memberFolder,
//     }, { request }],
//     [Authentication.validateToken, { user: member, token }, { user: member }],
//     [Folder.removeGroupFromFolder, {}, {}],
//     [Group.leaveGroup, {}, {}],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

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
