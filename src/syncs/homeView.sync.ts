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

/* ---------- FOLDER: CREATE ---------- */
export const CreateFoldersRequest: Sync = (
  { request, owner, name, parent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/createFolder",
      owner,
      parent,
      name,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: owner, token }],
  ),
});

export const CreateFoldersValidate: Sync = (
  { request, owner, name, parent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/createFolder",
      owner,
      parent,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user: owner, token }, { user: owner }],
  ),
  then: actions(
    [Folder.createFolder, { owner, name, parent }],
  ),
});

export const CreateFoldersResponse: Sync = (
  { request, owner, name, parent, token, folder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/createFolder",
      owner,
      parent,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user: owner, token }, { user: owner }],
    [Folder.createFolder, {}, { folder }],
  ),
  then: actions(
    [Requesting.respond, { request, folder }],
  ),
});

export const CreateFoldersResponseError: Sync = (
  { request, owner, name, parent, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/createFolder",
      owner,
      parent,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user: owner, token }, { user: owner }],
    [Folder.createFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- FOLDER: RENAME ---------- */
export const RenameFolderRequest: Sync = (
  { request, user, folder, name, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/renameFolder",
      user,
      folder,
      name,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const RenameFolderValidate: Sync = (
  { request, user, folder, name, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/renameFolder",
      user,
      folder,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.renameFolder, { user, folder, name }],
  ),
});

export const RenameFolderResponse: Sync = (
  { request, user, folder, name, token, success },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/renameFolder",
      user,
      folder,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.renameFolder, {}, { success }],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const RenameFolderResponseError: Sync = (
  { request, user, folder, name, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/renameFolder",
      user,
      folder,
      name,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.renameFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- FOLDER: DELETE ---------- */
export const DeleteFolderRequest: Sync = (
  { request, user, folder, token },
) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Folder/deleteFolder", user, folder, token },
      { request },
    ],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const DeleteFolderValidate: Sync = (
  { request, user, folder, token },
) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Folder/deleteFolder", user, folder, token },
      { request },
    ],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.deleteFolder, { user, folder }],
  ),
});

export const DeleteFolderResponse: Sync = (
  { request, user, folder, token, folderDeleted },
) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Folder/deleteFolder", user, folder, token },
      { request },
    ],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.deleteFolder, {}, { folderDeleted }],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const DeleteFolderResponseError: Sync = (
  { request, user, folder, token, error },
) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Folder/deleteFolder", user, folder, token },
      { request },
    ],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.deleteFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- FOLDER: MOVE ---------- */
export const MoveFolderRequest: Sync = (
  { request, user, folderToMove, newParent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/moveFolder",
      user,
      folderToMove,
      newParent,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const MoveFolderValidate: Sync = (
  { request, user, folderToMove, newParent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/moveFolder",
      user,
      folderToMove,
      newParent,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.moveFolder, { user, folderToMove, newParent }],
  ),
});

export const MoveFolderResponse: Sync = (
  { request, user, folderToMove, newParent, token, folder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/moveFolder",
      user,
      folderToMove,
      newParent,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.moveFolder, {}, { folder }],
  ),
  then: actions(
    [Requesting.respond, { request, folder }],
  ),
});

export const MoveFolderResponseError: Sync = (
  { request, user, folderToMove, newParent, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/moveFolder",
      user,
      folderToMove,
      newParent,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.moveFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- FOLDER: ADD/REMOVE GROUP ---------- */
export const AddGroupToFolderRequest: Sync = (
  { request, user, folderName, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/addGroupToFolder",
      user,
      folderName,
      group,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const AddGroupToFolderValidate: Sync = (
  { request, user, folderName, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/addGroupToFolder",
      user,
      folderName,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.addGroupToFolder, { user, folderName, group }],
  ),
});

export const AddGroupToFolderResponse: Sync = (
  { request, user, folderName, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/addGroupToFolder",
      user,
      folderName,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.addGroupToFolder, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const AddGroupToFolderResponseError: Sync = (
  { request, user, folderName, group, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/addGroupToFolder",
      user,
      folderName,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.addGroupToFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const RemoveGroupFromFolderRequest: Sync = (
  { request, user, folder, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/removeGroupFromFolder",
      user,
      folder,
      group,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const RemoveGroupFromFolderValidate: Sync = (
  { request, user, folder, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/removeGroupFromFolder",
      user,
      folder,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.removeGroupFromFolder, { user, folder, group }],
  ),
});

export const RemoveGroupFromFolderResponse: Sync = (
  { request, user, folder, group, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/removeGroupFromFolder",
      user,
      folder,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.removeGroupFromFolder, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const RemoveGroupFromFolderResponseError: Sync = (
  { request, user, folder, group, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/removeGroupFromFolder",
      user,
      folder,
      group,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.removeGroupFromFolder, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- FOLDER QUERIES (TOKEN-PROTECTED) ---------- */
export const ListSubfoldersRequest: Sync = (
  { request, user, parent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/listSubfolders",
      user,
      parent,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const ListSubfoldersValidate: Sync = (
  { request, user, parent, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/listSubfolders",
      user,
      parent,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Folder.listSubfolders, { user, parent }],
  ),
});

export const ListSubfoldersResponse: Sync = (
  { request, user, parent, token, folders },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Folder/listSubfolders",
      user,
      parent,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Folder.listSubfolders, { user, parent }, { folders }],
  ),
  then: actions(
    [Requesting.respond, { request, folders }],
  ),
});

// _getFolderById is handled via passthrough; no sync needed.

// _listGroupsInFolder is handled via passthrough; no sync needed.

// _listGroupsInFolderByName is handled via passthrough; no sync needed.

// _listFolders is handled via passthrough; no sync needed.

/* ---------- GROUP: CREATE / MEMBERSHIP / DELETE ---------- */
// export const CreateGroupRequest: Sync = (
//   { request, creator, name, description, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: creator, token }],
//   ),
// });

// export const CreateGroupValidate: Sync = (
//   { request, creator, name, description, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//   ),
//   then: actions(
//     [Group.createGroup, { creator, name, description }],
//   ),
// });

// export const CreateGroupResponse: Sync = (
//   { request, creator, name, description, token, group },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//     [Group.createGroup, {}, { group }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, group }],
//   ),
// });

// export const CreateGroupResponseError: Sync = (
//   { request, creator, name, description, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/createGroup",
//       creator,
//       name,
//       description,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: creator, token }, { user: creator }],
//     [Group.createGroup, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// export const AddUserToGroupRequest: Sync = (
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

// export const AddUserToGroupValidate: Sync = (
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

// export const AddUserToGroupResponse: Sync = (
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
//     [Requesting.respond, { request }],
//   ),
// });

// export const AddUserToGroupResponseError: Sync = (
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

// export const RemoveUserFromGroupRequest: Sync = (
//   { request, group, remover, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user: remover, token }],
//   ),
// });

// export const RemoveUserFromGroupValidate: Sync = (
//   { request, group, remover, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: remover, token }, { user: remover }],
//   ),
//   then: actions(
//     [Group.removeUser, { group, remover, member }],
//   ),
// });

// export const RemoveUserFromGroupResponse: Sync = (
//   { request, group, remover, member, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: remover, token }, { user: remover }],
//     [Group.removeUser, {}, {}],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

// export const RemoveUserFromGroupResponseError: Sync = (
//   { request, group, remover, member, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Group/removeUser",
//       group,
//       remover,
//       member,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user: remover, token }, { user: remover }],
//     [Group.removeUser, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });
export const AddUserSplitRequest: Sync = (
  { request, expense, user, amountOwed, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      amountOwed,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const AddUserSplitValidate: Sync = (
  { request, expense, user, amountOwed, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Expense.addUserSplit, { expense, user, amountOwed }],
  ),
});

export const AddUserSplitResponse: Sync = (
  { request, expense, user, amountOwed, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.addUserSplit, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const AddUserSplitResponseError: Sync = (
  { request, expense, user, amountOwed, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/addUserSplit",
      expense,
      user,
      amountOwed,
      token,
    }, { request }],
    [Authentication.validateToken, { user, token }, { user }],
    [Expense.addUserSplit, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const ListGroupMembersResponse: Sync = (
  { request, group, members },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/_listMembers", group }, {
      request,
    }],
  ),
  where: async (frames) => {
    // Resolve member IDs to full user objects so frontend gets User[] in one
    // request. Use frames.query with an input mapping for `group` so each
    // incoming frame's bound `group` value is available.
    frames = await frames.query(
      async ({ group }) => {
        const ids = await Group._listMembers({ group });
        console.log("ids", ids);
        const users: Record<string, unknown>[] = [];
        for (const id of ids) {
          const r = await Authentication._getUserById({
            user: String(id) as unknown as ID,
          });
          const rr = r as {
            userInfo?: Record<string, unknown>;
            error?: string;
          };
          if (rr.userInfo) users.push(rr.userInfo);
        }

        return [{ members: users }];
      },
      { group },
      { members },
    );

    return frames;
  },
  then: actions(
    [Requesting.respond, { request, members }],
  ),
});

export const LeaveGroupRequest: Sync = (
  { request, group, member, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user: member, token }],
  ),
});

export const LeaveGroupValidate: Sync = (
  { request, group, member, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
      request,
    }],
    [Authentication.validateToken, { user: member, token }, { user: member }],
  ),
  then: actions(
    [Group.leaveGroup, { group, member }],
  ),
});

export const LeaveGroupResponse: Sync = (
  { request, group, member, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
      request,
    }],
    [Authentication.validateToken, { user: member, token }, { user: member }],
    [Group.leaveGroup, {}, { left: true }],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const LeaveGroupResponseError: Sync = (
  { request, group, member, token, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/leaveGroup", group, member, token }, {
      request,
    }],
    [Authentication.validateToken, { user: member, token }, { user: member }],
    [Group.leaveGroup, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const DeleteGroupRequest: Sync = (
  { request, group, user, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user, token }],
  ),
});

export const DeleteGroupValidate: Sync = (
  { request, group, user, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Group.deleteGroup, { group }],
  ),
});

export const DeleteGroupResponse: Sync = (
  { request, group, user, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, { user }],
    [Group.deleteGroup, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const DeleteGroupResponseError: Sync = (
  { request, group, user, token, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Group/deleteGroup", group, user, token }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, { user }],
    [Group.deleteGroup, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

/* ---------- COMPOSITES TO REDUCE FRONTEND CALLS ---------- */

export const CreateGroupAndAddToFolderRequest: Sync = (
  { request, creator, name, description, token, folderName },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/createGroup",
      creator,
      name,
      description,
      token,
      folderName,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: creator, token }],
  ),
});

export const CreateGroupAndAddToFolderValidate: Sync = (
  { request, creator, name, description, token, folderName },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/createGroup",
      creator,
      name,
      description,
      token,
      folderName,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
  ),
  then: actions(
    [Group.createGroup, { creator, name, description }],
  ),
});

export const CreateGroupAndAddToFolderResponse: Sync = (
  { request, creator, name, description, token, folderName, group },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/createGroup",
      creator,
      name,
      description,
      token,
      folderName,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Group.createGroup, {}, { group }],
  ),
  then: actions(
    [Folder.addGroupToFolder, {
      user: creator,
      folderName: folderName ?? ".root",
      group,
    }],
    [Requesting.respond, {
      request,
      group: { _id: group, name, description, creator },
    }],
  ),
});

export const CreateGroupAndAddToFolderResponseError: Sync = (
  { request, creator, name, description, token, folderName, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/createGroup",
      creator,
      name,
      description,
      token,
      folderName,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Group.createGroup, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const AddUserAndSetupRequest: Sync = (
  { request, group, inviter, newMember, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/addUser",
      group,
      inviter,
      newMember,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: inviter, token }],
  ),
});

export const AddUserAndSetupValidate: Sync = (
  { request, group, inviter, newMember, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/addUser",
      group,
      inviter,
      newMember,
      token,
    }, { request }],
    [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
  ),
  then: actions(
    [Group.addUser, { group, inviter, newMember }],
  ),
});

export const AddUserAndSetupResponse: Sync = (
  { request, group, inviter, newMember, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/addUser",
      group,
      inviter,
      newMember,
      token,
    }, { request }],
    [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
    [Group.addUser, {}, {}],
  ),
  then: actions(
    [Folder.addGroupToFolder, { user: newMember, folderName: ".root", group }],
    [Requesting.respond, { request }],
  ),
});

export const AddUserAndSetupResponseError: Sync = (
  { request, group, inviter, newMember, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/addUser",
      group,
      inviter,
      newMember,
      token,
    }, { request }],
    [Authentication.validateToken, { user: inviter, token }, { user: inviter }],
    [Group.addUser, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const RemoveUserAndCleanupRequest: Sync = (
  { request, group, remover, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/removeUser",
      group,
      remover,
      member,
      token,
      memberFolder,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: remover, token }],
  ),
});

export const RemoveUserAndCleanupValidate: Sync = (
  { request, group, remover, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/removeUser",
      group,
      remover,
      member,
      token,
      memberFolder,
    }, { request }],
    [Authentication.validateToken, { user: remover, token }, { user: remover }],
  ),
  then: actions(
    [Folder.removeGroupFromFolder, {
      user: member,
      folder: memberFolder,
      group,
    }],
    [Group.removeUser, { group, remover, member }],
  ),
});

export const RemoveUserAndCleanupResponse: Sync = (
  { request, group, remover, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/removeUser",
      group,
      remover,
      member,
      token,
      memberFolder,
    }, { request }],
    [Authentication.validateToken, { user: remover, token }, { user: remover }],
    [Folder.removeGroupFromFolder, {}, {}],
    [Group.removeUser, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const LeaveGroupAndCleanupRequest: Sync = (
  { request, group, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/leaveGroup",
      group,
      member,
      token,
      memberFolder,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: member, token }],
  ),
});

export const LeaveGroupAndCleanupValidate: Sync = (
  { request, group, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/leaveGroup",
      group,
      member,
      token,
      memberFolder,
    }, { request }],
    [Authentication.validateToken, { user: member, token }, { user: member }],
  ),
  then: actions(
    [Folder.removeGroupFromFolder, {
      user: member,
      folder: memberFolder,
      group,
    }],
    [Group.leaveGroup, { group, member }],
  ),
});

export const LeaveGroupAndCleanupResponse: Sync = (
  { request, group, member, token, memberFolder },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Group/leaveGroup",
      group,
      member,
      token,
      memberFolder,
    }, { request }],
    [Authentication.validateToken, { user: member, token }, { user: member }],
    [Folder.removeGroupFromFolder, {}, {}],
    [Group.leaveGroup, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
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
    [Authentication.validateToken, { user, token }],
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
    [Authentication.validateToken, { user: user, token }, { user: user }],
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
    newExpense,
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
    [Authentication.validateToken, { user: user, token: token }],
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
    newExpense,
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
      newExpense,
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
    receiver,
    amount,
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
  where: async (frames) => {
    // After the edit, fetch updated splits and bind payer/receiver/amount
    frames = await frames.query(
      async ({ expenseToEdit: id }) => {
        const exp = await Expense._getExpenseById({
          expenseId: id as unknown as ID,
        });
        const payerId = exp?.payer as ID | undefined;

        const r = await Expense._getSplitsByExpense({
          expenseId: id as unknown as ID,
        });

        console.log("splits", r.splits);

        // Return mapped payer/receiver/amount list
        return (r.splits as { user: ID; amountOwed: number }[])
          .filter((s) => String(s.user) !== String(payerId))
          .map((s) => ({
            payer: payerId,
            receiver: s.user,
            amount: s.amountOwed,
          }));
      },
      { expenseToEdit: expenseToEdit as unknown as ID },
      { payer, receiver, amount },
    );

    console.log("BIII", frames);

    return frames;
  },
  then: actions(
    [Debt.updateDebt, { payer, receiver, amount }],
    [Requesting.respond, { request }],
  ),
});

export const EditExpenseResponseError: Sync = (
  { request, user, expenseToEdit, newExpense, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Expense/editExpense",
      user,
      expenseToEdit,
      newExpense,
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
export const DeleteExpenseAndReverseDebts: Sync = (
  { request, expenseToDelete, payer, receiver, amount },
) => ({
  when: actions(
    [Requesting.request, { path: "/Expense/deleteExpense", expenseToDelete }, {
      request,
    }],
  ),
  where: async (frames) => {
    // Fetch expense details and splits, return frames with payer/receiver/amount
    frames = await frames.query(
      async ({ expenseToDelete: id }) => {
        const exp = await Expense._getExpenseById({
          expenseId: id as unknown as ID,
        });
        const payerId = exp?.payer as ID | undefined;
        const r = await Expense._getSplitsByExpense({
          expenseId: id as unknown as ID,
        });
        return (r.splits as { user: ID; amountOwed: number }[])
          .filter((s) => String(s.user) !== String(payerId))
          .map((s) => ({
            payer: payerId,
            receiver: s.user,
            amount: -s.amountOwed,
          }));
      },
      { expenseToDelete: expenseToDelete as unknown as ID },
      { payer, receiver, amount },
    );

    return frames;
  },
  then: actions(
    // reverse each debt
    [Debt.updateDebt, { payer, receiver, amount }],
    // finally delete the expense
    [Expense.deleteExpense, { expenseToDelete }, {}],
    [Requesting.respond, { request }],
  ),
});

/* ---------- DEBT: CREATE / UPDATE / DELETE ---------- */

export const CreateDebtRequest: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user: user, token }, { user }],
  ),
});

export const CreateDebtValidate: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user: user, token }, { user: user }],
  ),
  then: actions(
    [Debt.createDebt, { userA, userB }],
  ),
});

export const CreateDebtResponse: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user: user, token }, { user: user }],
    [Debt.createDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const CreateDebtResponseError: Sync = (
  { request, user, userA, userB, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user: user, token }, { user: user }],
    [Debt.createDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const UpdateDebtRequest: Sync = (
  { request, payer, receiver, amount, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: payer, token }, { user: payer }],
  ),
});

export const UpdateDebtValidate: Sync = (
  { request, payer, receiver, amount, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
    }, { request }],
    [Authentication.validateToken, { user: payer, token }, { user: payer }],
  ),
  then: actions(
    [Debt.updateDebt, { payer, receiver, amount }],
  ),
});

export const UpdateDebtResponse: Sync = (
  { request, payer, receiver, amount, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
    }, { request }],
    [Authentication.validateToken, { user: payer, token }, { user: payer }],
    [Debt.updateDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const UpdateDebtResponseError: Sync = (
  { request, payer, receiver, amount, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
    }, { request }],
    [Authentication.validateToken, { user: payer, token }, { user: payer }],
    [Debt.updateDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const DeleteDebtRequest: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
  ),
});

export const DeleteDebtValidate: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
  ),
  then: actions(
    [Debt.deleteDebt, { userA, userB }],
  ),
});

export const DeleteDebtResponse: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
    [Debt.deleteDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const DeleteDebtResponseError: Sync = (
  { request, userA, userB, token, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
    [Debt.deleteDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});
