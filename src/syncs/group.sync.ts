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
