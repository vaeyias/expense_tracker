import { actions, Sync } from "@engine";
import { Authentication, Folder, Requesting } from "@concepts";

/**
 * 1️⃣ CreateUserRequest
 * When a request comes in to create a user, we trigger the createUser action
 */
export const CreateUserRequest: Sync = (
  { request, username, displayName, password },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Authentication/createUser",
      username,
      displayName,
      password,
    }, { request }],
  ),
  then: actions(
    [Authentication.createUser, { username, displayName, password }],
  ),
});

/**
 * 2️⃣ CreateUserResponse
 * If the createUser action succeeds, create the .root folder and respond to the request
 */
export const CreateUserResponse: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createUser" }, { request }],
    [Authentication.createUser, {}, { user }],
  ),
  then: actions(
    [Folder.createFolder, {
      owner: user,
      name: ".root",
      parent: ".parent_root",
    }],
    [Requesting.respond, { request, user }],
  ),
});

/**
 * 3️⃣ CreateUserError
 * If the createUser action returns an error, respond to the request with the error
 */
export const CreateUserError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createUser" }, { request }],
    [Authentication.createUser, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

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
