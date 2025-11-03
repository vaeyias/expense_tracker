import { actions, Frames, Sync } from "@engine";
import { Authentication, Folder, Group, Requesting } from "@concepts";

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

/* ---------- RENAME FOLDER ---------- */
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

// /* ---------- DELETE FOLDER ---------- */
// export const DeleteFolderRequest: Sync = (
//   { request, user, folder, token },
// ) => ({
//   when: actions(
//     [
//       Requesting.request,
//       { path: "/Folder/deleteFolder", user, folder, token },
//       { request },
//     ],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const DeleteFolderValidate: Sync = (
//   { request, user, folder, token },
// ) => ({
//   when: actions(
//     [
//       Requesting.request,
//       { path: "/Folder/deleteFolder", user, folder, token },
//       { request },
//     ],
//     [Authentication.validateToken, { user, token }, { user }],
//   ),
//   then: actions(
//     [Folder.deleteFolder, { folder }],
//   ),
// });

// export const DeleteFolderResponse: Sync = (
//   { request, user, folder, token, folderDeleted },
// ) => ({
//   when: actions(
//     [
//       Requesting.request,
//       { path: "/Folder/deleteFolder", user, folder, token },
//       { request },
//     ],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.deleteFolder, {}, { folder: folderDeleted }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, folder: folderDeleted }],
//   ),
// });

// export const DeleteFolderResponseError: Sync = (
//   { request, user, folder, token, error },
// ) => ({
//   when: actions(
//     [
//       Requesting.request,
//       { path: "/Folder/deleteFolder", user, folder, token },
//       { request },
//     ],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.deleteFolder, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// /* ---------- MOVE FOLDER ---------- */
// export const MoveFolderRequest: Sync = (
//   { request, user, folderToMove, newParent, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveFolder",
//       user,
//       folderToMove,
//       newParent,
//       token,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const MoveFolderValidate: Sync = (
//   { request, user, folderToMove, newParent, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveFolder",
//       user,
//       folderToMove,
//       newParent,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//   ),
//   then: actions(
//     [Folder.moveFolder, { folderToMove, newParent }],
//   ),
// });

// export const MoveFolderResponse: Sync = (
//   { request, user, folderToMove, newParent, token, folder },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveFolder",
//       user,
//       folderToMove,
//       newParent,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.moveFolder, {}, { folder }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, folder }],
//   ),
// });

// export const MoveFolderResponseError: Sync = (
//   { request, user, folderToMove, newParent, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveFolder",
//       user,
//       folderToMove,
//       newParent,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.moveFolder, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

// /* ---------- CREATE GROUP ---------- */
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

// /* ---------- MOVE GROUP ---------- */
// export const MoveGroupRequest: Sync = (
//   { request, user, group, targetFolder, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveGroup",
//       user,
//       group,
//       targetFolder,
//       token,
//     }, { request }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const MoveGroupValidate: Sync = (
//   { request, user, group, targetFolder, token },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveGroup",
//       user,
//       group,
//       targetFolder,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//   ),
//   then: actions(
//     [Folder.moveGroup, { group, targetFolder }],
//   ),
// });

// export const MoveGroupResponse: Sync = (
//   { request, user, group, targetFolder, token, movedGroup },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveGroup",
//       user,
//       group,
//       targetFolder,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.moveGroup, {}, { group: movedGroup }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, group: movedGroup }],
//   ),
// });

// export const MoveGroupResponseError: Sync = (
//   { request, user, group, targetFolder, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Folder/moveGroup",
//       user,
//       group,
//       targetFolder,
//       token,
//     }, { request }],
//     [Authentication.validateToken, { user, token }, { user }],
//     [Folder.moveGroup, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });
