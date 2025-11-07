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
