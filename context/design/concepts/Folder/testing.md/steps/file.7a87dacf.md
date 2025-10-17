---
timestamp: 'Wed Oct 15 2025 16:31:31 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251015_163131.a0570577.md]]'
content_id: 7a87dacf93233ad8c04f38ecf42257829660f33e0eda088637d77402e583f56b
---

# file: src/Folder/FolderConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FolderConcept from "./FolderConcept.ts";

Deno.test("📁 FolderConcept", async (t) => {
  const [db, client] = await testDb();
  const folderConcept = new FolderConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const group1 = "group:group1" as ID;
  const group2 = "group:group2" as ID;
  const group3 = "group:group3" as ID;

  // --- Test Setup ---
  // Ensure Alice has a root folder for deleteFolder testing
  await folderConcept.createFolder({ owner: alice, name: "Root" });

  // --- Tests ---

  await t.step("createFolder: Successfully creates a new folder", async () => {
    const result = await folderConcept.createFolder({ owner: alice, name: "My Stuff" });
    assertEquals("folder" in result, true);
    const folderId = (result as { folder: ID }).folder;
    const folderDoc = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDoc?.name, "My Stuff");
    assertEquals(folderDoc?.owner, alice);
    assertEquals(folderDoc?.parent, null);
    assertEquals(folderDoc?.groups.length, 0);
  });

  await t.step("createFolder: Fails to create a folder with a duplicate name for the same owner", async () => {
    await folderConcept.createFolder({ owner: alice, name: "My Stuff" }); // First creation
    const result = await folderConcept.createFolder({ owner: alice, name: "My Stuff" });
    assertEquals("error" in result, true);
    assertEquals(result.error, "A folder with the name \"My Stuff\" already exists for this owner.");
  });

  await t.step("createFolder: Fails to create a folder with missing owner or name", async () => {
    const res1 = await folderConcept.createFolder({ owner: alice, name: "" });
    assertEquals("error" in res1, true);
    assertEquals(res1.error, "Owner and folder name are required.");

    const res2 = await folderConcept.createFolder({ owner: "" as ID, name: "My Stuff" });
    assertEquals("error" in res2, true);
    assertEquals(res2.error, "Owner and folder name are required.");
  });

  await t.step("addToFolder: Successfully adds a group to a folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Documents" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const result = await folderConcept.addToFolder({ user: alice, folderName: "Documents", group: group1 });
    assertEquals("error" in result, false);

    const folderDoc = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDoc?.groups.includes(group1), true);
  });

  await t.step("addToFolder: Fails to add a group to a non-existent folder", async () => {
    const result = await folderConcept.addToFolder({ user: alice, folderName: "NonExistent", group: group1 });
    assertEquals("error" in result, true);
    assertEquals(result.error, "Folder \"NonExistent\" not found for user user:Alice.");
  });

  await t.step("addToFolder: Fails to add a group to a folder owned by a different user", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: bob, name: "Bob's Stuff" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const result = await folderConcept.addToFolder({ user: alice, folderName: "Bob's Stuff", group: group1 });
    assertEquals("error" in result, true);
    assertEquals(result.error, "Folder \"Bob's Stuff\" not found for user user:Alice.");
  });

  await t.step("addToFolder: Adding an existing group has no effect", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Photos" });
    const folderId = (createFolderRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: alice, folderName: "Photos", group: group1 }); // Add first time

    const folderDocBefore = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDocBefore?.groups.length, 1);

    await folderConcept.addToFolder({ user: alice, folderName: "Photos", group: group1 }); // Add second time

    const folderDocAfter = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDocAfter?.groups.length, 1); // Length should remain 1
    assertEquals(folderDocAfter?.groups.includes(group1), true);
  });

  await t.step("addToFolder: Fails with missing user, folderName, or group", async () => {
    const res1 = await folderConcept.addToFolder({ user: alice, folderName: "", group: group1 });
    assertEquals("error" in res1, true);
    assertEquals(res1.error, "User, folder name, and group are required.");

    const res2 = await folderConcept.addToFolder({ user: alice, folderName: "Docs", group: "" as ID });
    assertEquals("error" in res2, true);
    assertEquals(res2.error, "User, folder name, and group are required.");

    const res3 = await folderConcept.addToFolder({ user: "" as ID, folderName: "Docs", group: group1 });
    assertEquals("error" in res3, true);
    assertEquals(res3.error, "User, folder name, and group are required.");
  });

  await t.step("removeFromFolder: Successfully removes a group from a folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Music" });
    const folderId = (createFolderRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: alice, folderName: "Music", group: group1 });

    const folderDocBefore = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDocBefore?.groups.includes(group1), true);

    const result = await folderConcept.removeFromFolder({ user: alice, folder: folderId, group: group1 });
    assertEquals("error" in result, false);

    const folderDocAfter = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDocAfter?.groups.includes(group1), false);
  });

  await t.step("removeFromFolder: Fails to remove a group not in the folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Videos" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const result = await folderConcept.removeFromFolder({ user: alice, folder: folderId, group: group1 });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Group "${group1}" is not in folder "${folderId}".`);
  });

  await t.step("removeFromFolder: Fails to remove from a folder not owned by the user", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: bob, name: "Bob's Media" });
    const folderId = (createFolderRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: bob, folderName: "Bob's Media", group: group1 });

    const result = await folderConcept.removeFromFolder({ user: alice, folder: folderId, group: group1 });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "${folderId}" not found for user user:Alice.`);
  });

  await t.step("removeFromFolder: Fails to remove from a non-existent folder", async () => {
    const result = await folderConcept.removeFromFolder({ user: alice, folder: "folder:NonExistent" as ID, group: group1 });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "folder:NonExistent" not found for user user:Alice.`);
  });

  await t.step("removeFromFolder: Fails with missing user, folder, or group", async () => {
    const res1 = await folderConcept.removeFromFolder({ user: alice, folder: "" as ID, group: group1 });
    assertEquals("error" in res1, true);
    assertEquals(res1.error, "User, folder, and group are required.");

    const res2 = await folderConcept.removeFromFolder({ user: alice, folder: "folder:1" as ID, group: "" as ID });
    assertEquals("error" in res2, true);
    assertEquals(res2.error, "User, folder, and group are required.");

    const res3 = await folderConcept.removeFromFolder({ user: "" as ID, folder: "folder:1" as ID, group: group1 });
    assertEquals("error" in res3, true);
    assertEquals(res3.error, "User, folder, and group are required.");
  });

  await t.step("deleteFolder: Deletes a folder and moves its groups to a root folder", async () => {
    // Setup: Alice has a root folder named "Root"
    const folderToDelRes = await folderConcept.createFolder({ owner: alice, name: "ToDelete" });
    const folderIdToDelete = (folderToDelRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: alice, folderName: "ToDelete", group: group1 });
    await folderConcept.addToFolder({ user: alice, folderName: "ToDelete", group: group2 });

    const folderDocBefore = await db.collection("Folder.folders").findOne({ _id: folderIdToDelete });
    assertEquals(folderDocBefore?.groups.length, 2);

    const result = await folderConcept.deleteFolder({ user: alice, folder: folderIdToDelete });
    assertEquals("error" in result, false);

    // Verify folder is deleted
    const deletedFolderDoc = await db.collection("Folder.folders").findOne({ _id: folderIdToDelete });
    assertEquals(deletedFolderDoc, null);

    // Verify groups are in the root folder
    const rootFolderDoc = await db.collection("Folder.folders").findOne({ owner: alice, parent: null, name: "Root" });
    assertEquals(rootFolderDoc?.groups.includes(group1), true);
    assertEquals(rootFolderDoc?.groups.includes(group2), true);
  });

  await t.step("deleteFolder: Deletes an empty folder", async () => {
    const emptyFolderRes = await folderConcept.createFolder({ owner: alice, name: "EmptyFolder" });
    const emptyFolderId = (emptyFolderRes as { folder: ID }).folder;

    const result = await folderConcept.deleteFolder({ user: alice, folder: emptyFolderId });
    assertEquals("error" in result, false);

    const deletedFolderDoc = await db.collection("Folder.folders").findOne({ _id: emptyFolderId });
    assertEquals(deletedFolderDoc, null);
  });

  await t.step("deleteFolder: Fails to delete a non-existent folder", async () => {
    const result = await folderConcept.deleteFolder({ user: alice, folder: "folder:NonExistent" as ID });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "folder:NonExistent" not found for user user:Alice.`);
  });

  await t.step("deleteFolder: Fails to delete a folder owned by another user", async () => {
    const bobFolderRes = await folderConcept.createFolder({ owner: bob, name: "Bob's Folder" });
    const bobFolderId = (bobFolderRes as { folder: ID }).folder;

    const result = await folderConcept.deleteFolder({ user: alice, folder: bobFolderId });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "${bobFolderId}" not found for user user:Alice.`);
  });

  await t.step("deleteFolder: Fails with missing user or folder", async () => {
    const res1 = await folderConcept.deleteFolder({ user: alice, folder: "" as ID });
    assertEquals("error" in res1, true);
    assertEquals(res1.error, "User and folder are required.");

    const res2 = await folderConcept.deleteFolder({ user: "" as ID, folder: "folder:1" as ID });
    assertEquals("error" in res2, true);
    assertEquals(res2.error, "User and folder are required.");
  });

  await t.step("renameFolder: Successfully renames a folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "OldName" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const result = await folderConcept.renameFolder({ user: alice, folder: folderId, name: "NewName" });
    assertEquals("error" in result, false);

    const folderDoc = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderDoc?.name, "NewName");
  });

  await t.step("renameFolder: Fails to rename to an existing folder name for the owner", async () => {
    const folder1Res = await folderConcept.createFolder({ owner: alice, name: "FolderA" });
    const folder1Id = (folder1Res as { folder: ID }).folder;
    await folderConcept.createFolder({ owner: alice, name: "FolderB" });

    const result = await folderConcept.renameFolder({ user: alice, folder: folder1Id, name: "FolderB" });
    assertEquals("error" in result, true);
    assertEquals(result.error, `A folder with the name "FolderB" already exists for this owner.`);
  });

  await t.step("renameFolder: Fails to rename a non-existent folder", async () => {
    const result = await folderConcept.renameFolder({ user: alice, folder: "folder:NonExistent" as ID, name: "NewName" });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "folder:NonExistent" not found for user user:Alice.`);
  });

  await t.step("renameFolder: Fails to rename a folder owned by another user", async () => {
    const bobFolderRes = await folderConcept.createFolder({ owner: bob, name: "Bob's Folder" });
    const bobFolderId = (bobFolderRes as { folder: ID }).folder;

    const result = await folderConcept.renameFolder({ user: alice, folder: bobFolderId, name: "NewName" });
    assertEquals("error" in result, true);
    assertEquals(result.error, `Folder "${bobFolderId}" not found for user user:Alice.`);
  });

  await t.step("renameFolder: Fails with missing user, folder, or name", async () => {
    const res1 = await folderConcept.renameFolder({ user: alice, folder: "" as ID, name: "NewName" });
    assertEquals("error" in res1, true);
    assertEquals(res1.error, "User, folder, and new name are required.");

    const res2 = await folderConcept.renameFolder({ user: alice, folder: "folder:1" as ID, name: "" });
    assertEquals("error" in res2, true);
    assertEquals(res2.error, "User, folder, and new name are required.");

    const res3 = await folderConcept.renameFolder({ user: "" as ID, folder: "folder:1" as ID, name: "NewName" });
    assertEquals("error" in res3, true);
    assertEquals(res3.error, "User, folder, and new name are required.");
  });

  // --- Trace for Principle: Users can organize groups into custom structures ---

  await t.step("trace: Users can organize groups into custom structures", async () => {
    // 1. Alice creates a root folder.
    const rootFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Files" });
    const rootFolderId = (rootFolderRes as { folder: ID }).folder;
    assertEquals("folder" in rootFolderRes, true);

    // 2. Alice creates a sub-folder.
    const subFolderRes = await folderConcept.createFolder({ owner: alice, name: "Projects" });
    const subFolderId = (subFolderRes as { folder: ID }).folder;
    assertEquals("folder" in subFolderRes, true);

    // (Implicitly, the sub-folder is created as a root folder first, then needs to be linked as a child.
    // The current concept implementation for `createFolder` does not support parent parameter.
    // This means the 'parent' field is always null on creation.
    // To test folder hierarchy, we would need to update the `createFolder` action to accept a `parent` parameter
    // or add a `moveFolder` action.
    // Assuming for this trace that `parent` can be set directly for testing hierarchy.)

    // Manually set parent for demonstration of hierarchy
    await db.collection("Folder.folders").updateOne(
      { _id: subFolderId },
      { $set: { parent: rootFolderId } },
    );

    // 3. Alice adds groups to the root folder.
    await folderConcept.addToFolder({ user: alice, folderName: "Alice's Files", group: group1 });
    await folderConcept.addToFolder({ user: alice, folderName: "Alice's Files", group: group2 });

    // 4. Alice adds a group to the sub-folder.
    await folderConcept.addToFolder({ user: alice, folderName: "Projects", group: group3 });

    // 5. Verify the structure and group assignments.
    const aliceFilesFolder = await db.collection("Folder.folders").findOne({ _id: rootFolderId });
    assertEquals(aliceFilesFolder?.groups.includes(group1), true);
    assertEquals(aliceFilesFolder?.groups.includes(group2), true);
    assertEquals(aliceFilesFolder?.groups.includes(group3), false);

    const projectsFolder = await db.collection("Folder.folders").findOne({ _id: subFolderId });
    assertEquals(projectsFolder?.parent, rootFolderId);
    assertEquals(projectsFolder?.groups.includes(group1), false);
    assertEquals(projectsFolder?.groups.includes(group2), false);
    assertEquals(projectsFolder?.groups.includes(group3), true);

    // 6. Alice renames a folder.
    await folderConcept.renameFolder({ user: alice, folder: subFolderId, name: "Completed Projects" });
    const renamedProjectsFolder = await db.collection("Folder.folders").findOne({ _id: subFolderId });
    assertEquals(renamedProjectsFolder?.name, "Completed Projects");

    // 7. Alice removes a group from the root folder.
    await folderConcept.removeFromFolder({ user: alice, folder: rootFolderId, group: group1 });
    const aliceFilesAfterRemove = await db.collection("Folder.folders").findOne({ _id: rootFolderId });
    assertEquals(aliceFilesAfterRemove?.groups.includes(group1), false);

    // 8. Alice deletes the sub-folder.
    // Note: In the current implementation, deleting a folder moves its groups to a *root* folder.
    // If the sub-folder has a parent, the groups from the sub-folder will be moved to *a* root folder (parent: null).
    // This might not be the most intuitive behavior if the intention is to move to the parent folder.
    // For this trace, we'll demonstrate the current behavior.
    await folderConcept.deleteFolder({ user: alice, folder: subFolderId });
    const deletedProjectsFolder = await db.collection("Folder.folders").findOne({ _id: subFolderId });
    assertEquals(deletedProjectsFolder, null);

    const rootFolderAfterDelete = await db.collection("Folder.folders").findOne({ _id: rootFolderId });
    // The group that was in the deleted sub-folder should now be in the root folder.
    assertEquals(rootFolderAfterDelete?.groups.includes(group3), true);
  });

  await client.close();
});
```
