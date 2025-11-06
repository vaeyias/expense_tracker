import { actions, Sync } from "@engine";
import { Authentication, Folder, Requesting } from "@concepts";
import { ID } from "@utils/types.ts";

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
      parent: ".parent_root" as ID,
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
