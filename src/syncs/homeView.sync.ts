// import { actions, Frames, Sync } from "@engine";
// import { Authentication, Folder, Requesting } from "@concepts";

// /* ---------- GET ROOT FOLDERS ---------- */
// export const _GetRootFoldersRequest: Sync = ({ request, user, token }) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/_getRootFolder", user, token }, {
//       request,
//     }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const _GetRootFoldersResponse: Sync = (
//   { request, user, token, folders, results },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/_getRootFolder", user, token }, {
//       request,
//     }],
//     [Authentication.validateToken, {}, { user }],
//   ),
//   where: async (frames) => {
//     frames = await frames.query(Folder._getRootFolder, { user }, { folders });
//     return frames.collectAs([folders], results);
//   },
//   then: actions(
//     [Requesting.respond, { request, results }],
//   ),
// });

// export const _GetRootFoldersResponseError: Sync = (
//   { request, user, token, error },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/_getRootFolder", user, token }, {
//       request,
//     }],
//     [Authentication.validateToken, { user, token }, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });
