// import { actions, Frames, Sync } from "@engine";
// import { Authentication, Folder, Group, Requesting } from "@concepts";

// // /* ---------- GET ROOT FOLDERS ---------- */
// export const GetRootFoldersRequest: Sync = ({ request, user, token }) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/getRootFolder", user, token }, {
//       request,
//     }],
//   ),
//   then: actions(
//     [Authentication.validateToken, { user, token }],
//   ),
// });

// export const GetRootFoldersTrigger: Sync = ({ request, user, token }) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/getRootFolder", user, token }, {
//       request,
//     }],
//   ),
//   then: actions(
//     [Folder.getRootFolder, { user }],
//   ),
// });

// export const GetRootFoldersTriggerResponse: Sync = (
//   { request, user, token, folders },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Folder/getRootFolder", user, token }, {
//       request,
//     }],
//     [Folder.getRootFolder, { user }, { folders }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, folders }],
//   ),
// });
