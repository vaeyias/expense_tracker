---
timestamp: 'Wed Oct 15 2025 16:51:00 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251015_165100.53e98b1a.md]]'
content_id: 741311ddbfd387208dc14b08bb5a921d7c52f4b436952bb8b372900089c05657
---

# file: src/folder/folderConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FolderConcept from "./FolderConcept.ts";

Deno.test("📁 FolderConcept - Folder management", async (t) => {
  const [db, client] = await testDb();
  const folderConcept = new FolderConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const group1 = "group:Group1" as ID;
  const group2 = "group:Group2" as ID;
  const group3 = "group:Group3" as ID;

  // Test Case #1: Create a folder
  await t.step("Test Case #1: Create a folder", async () => {
    const res = await folderConcept.createFolder({ owner: alice, name: "Alice's Docs" });
    assertNotEquals("error" in res, true, (res as { error: string }).error);
    const folderId = (res as { folder: ID }).folder;

    // Verify folder exists
    const createdFolder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(createdFolder?.name, "Alice's Docs");
    assertEquals(createdFolder?.owner, alice);
    assertEquals(createdFolder?.groups.length, 0);
    assertEquals(createdFolder?.parent, null);
  });

  // Test Case #2: Attempt to create a folder with a duplicate name
  await t.step("Test Case #2: Attempt to create duplicate folder name", async () => {
    await folderConcept.createFolder({ owner: alice, name: "Alice's Docs" }); // Create first
    const duplicateRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Docs" });
    assertEquals("error" in duplicateRes, true);
    assertEquals((duplicateRes as { error: string }).error, 'A folder with the name "Alice\'s Docs" already exists for this owner.');
  });

  // Test Case #3: Attempt to create a folder with missing fields
  await t.step("Test Case #3: Create folder with missing fields", async () => {
    const missingOwnerRes = await folderConcept.createFolder({ owner: undefined as any, name: "Test" });
    assertEquals("error" in missingOwnerRes, true);
    assertEquals((missingOwnerRes as { error: string }).error, "Owner and folder name are required.");

    const missingNameRes = await folderConcept.createFolder({ owner: alice, name: "" });
    assertEquals("error" in missingNameRes, true);
    assertEquals((missingNameRes as { error: string }).error, "Owner and folder name are required.");
  });

  // Test Case #4: Add a group to a folder
  await t.step("Test Case #4: Add group to folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "My Files" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const addGroupRes = await folderConcept.addToFolder({ user: alice, folderName: "My Files", group: group1 });
    assertEquals("error" in addGroupRes, false);

    const folder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folder?.groups.includes(group1), true);
    assertEquals(folder?.groups.length, 1);
  });

  // Test Case #5: Add a group that is already in the folder
  await t.step("Test Case #5: Add group already in folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Existing Group Folder" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    await folderConcept.addToFolder({ user: alice, folderName: "Existing Group Folder", group: group1 }); // Add first time
    const folderAfterFirstAdd = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderAfterFirstAdd?.groups.length, 1);

    const addGroupAgainRes = await folderConcept.addToFolder({ user: alice, folderName: "Existing Group Folder", group: group1 }); // Add second time
    assertEquals("error" in addGroupAgainRes, false);

    const folderAfterSecondAdd = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folderAfterSecondAdd?.groups.length, 1); // Length should remain the same
  });

  // Test Case #6: Attempt to add group to a non-existent folder
  await t.step("Test Case #6: Add group to non-existent folder", async () => {
    const addGroupRes = await folderConcept.addToFolder({ user: alice, folderName: "NonExistentFolder", group: group1 });
    assertEquals("error" in addGroupRes, true);
    assertEquals((addGroupRes as { error: string }).error, 'Folder "NonExistentFolder" not found for user user:Alice.');
  });

  // Test Case #7: Attempt to add group to a folder owned by another user
  await t.step("Test Case #7: Add group to another user's folder", async () => {
    const aliceFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Folder" });
    const aliceFolderId = (aliceFolderRes as { folder: ID }).folder;

    const addGroupRes = await folderConcept.addToFolder({ user: bob, folderName: "Alice's Folder", group: group1 });
    assertEquals("error" in addGroupRes, true);
    assertEquals((addGroupRes as { error: string }).error, 'Folder "Alice\'s Folder" not found for user user:Bob.');
  });

  // Test Case #8: Remove a group from a folder
  await t.step("Test Case #8: Remove group from folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Removable Folder" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    await folderConcept.addToFolder({ user: alice, folderName: "Removable Folder", group: group1 });
    await folderConcept.addToFolder({ user: alice, folderName: "Removable Folder", group: group2 });

    let folder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folder?.groups.length, 2);

    const removeGroupRes = await folderConcept.removeFromFolder({ user: alice, folder: folderId, group: group1 });
    assertEquals("error" in removeGroupRes, false);

    folder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folder?.groups.includes(group1), false);
    assertEquals(folder?.groups.includes(group2), true);
    assertEquals(folder?.groups.length, 1);
  });

  // Test Case #9: Attempt to remove a group that is not in the folder
  await t.step("Test Case #9: Remove group not in folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Emptyish Folder" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const removeGroupRes = await folderConcept.removeFromFolder({ user: alice, folder: folderId, group: group1 });
    assertEquals("error" in removeGroupRes, true);
    assertEquals((removeGroupRes as { error: string }).error, `Group "${group1}" is not in folder "${folderId}".`);
  });

  // Test Case #10: Attempt to remove from a non-existent folder
  await t.step("Test Case #10: Remove from non-existent folder", async () => {
    const removeGroupRes = await folderConcept.removeFromFolder({ user: alice, folder: "non-existent-folder-id" as ID, group: group1 });
    assertEquals("error" in removeGroupRes, true);
    assertEquals((removeGroupRes as { error: string }).error, 'Folder "non-existent-folder-id" not found for user user:Alice.');
  });

  // Test Case #11: Attempt to remove from a folder owned by another user
  await t.step("Test Case #11: Remove from another user's folder", async () => {
    const aliceFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Folder for Removal" });
    const aliceFolderId = (aliceFolderRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: alice, folderName: "Alice's Folder for Removal", group: group1 });

    const removeGroupRes = await folderConcept.removeFromFolder({ user: bob, folder: aliceFolderId, group: group1 });
    assertEquals("error" in removeGroupRes, true);
    assertEquals((removeGroupRes as { error: string }).error, `Folder "${aliceFolderId}" not found for user user:Bob.`);
  });

  // Test Case #12: Delete an empty folder
  await t.step("Test Case #12: Delete empty folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Empty Folder" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const deleteRes = await folderConcept.deleteFolder({ user: alice, folder: folderId });
    assertEquals("error" in deleteRes, false);

    const deletedFolder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(deletedFolder, null);
  });

  // Test Case #13: Delete a folder containing groups
  await t.step("Test Case #13: Delete folder with groups", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Folder With Groups" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    await folderConcept.addToFolder({ user: alice, folderName: "Folder With Groups", group: group1 });
    await folderConcept.addToFolder({ user: alice, folderName: "Folder With Groups", group: group2 });

    // Ensure there is a root folder for Alice to move groups to
    const rootFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Root" });
    const rootFolderId = (rootFolderRes as { folder: ID }).folder;

    const deleteRes = await folderConcept.deleteFolder({ user: alice, folder: folderId });
    assertEquals("error" in deleteRes, false);

    const deletedFolder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(deletedFolder, null);

    // Verify groups were moved to the root folder
    const rootFolder = await db.collection("Folder.folders").findOne({ _id: rootFolderId });
    assertEquals(rootFolder?.groups.includes(group1), true);
    assertEquals(rootFolder?.groups.includes(group2), true);
    assertEquals(rootFolder?.groups.length, 2);
  });

  // Test Case #14: Attempt to delete a folder owned by another user
  await t.step("Test Case #14: Delete another user's folder", async () => {
    const aliceFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Folder To Delete" });
    const aliceFolderId = (aliceFolderRes as { folder: ID }).folder;

    const deleteRes = await folderConcept.deleteFolder({ user: bob, folder: aliceFolderId });
    assertEquals("error" in deleteRes, true);
    assertEquals((deleteRes as { error: string }).error, `Folder "${aliceFolderId}" not found for user user:Bob.`);
  });

  // Test Case #15: Rename a folder
  await t.step("Test Case #15: Rename folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: alice, name: "Old Name" });
    const folderId = (createFolderRes as { folder: ID }).folder;

    const renameRes = await folderConcept.renameFolder({ user: alice, folder: folderId, name: "New Name" });
    assertEquals("error" in renameRes, false);

    const folder = await db.collection("Folder.folders").findOne({ _id: folderId });
    assertEquals(folder?.name, "New Name");
  });

  // Test Case #16: Attempt to rename a folder to an existing name
  await t.step("Test Case #16: Rename folder to existing name", async () => {
    await folderConcept.createFolder({ owner: alice, name: "Existing Name" });
    const anotherFolderRes = await folderConcept.createFolder({ owner: alice, name: "Another Folder" });
    const anotherFolderId = (anotherFolderRes as { folder: ID }).folder;

    const renameRes = await folderConcept.renameFolder({ user: alice, folder: anotherFolderId, name: "Existing Name" });
    assertEquals("error" in renameRes, true);
    assertEquals((renameRes as { error: string }).error, 'A folder with the name "Existing Name" already exists for this owner.');
  });

  // Test Case #17: Attempt to rename a non-existent folder
  await t.step("Test Case #17: Rename non-existent folder", async () => {
    const renameRes = await folderConcept.renameFolder({ user: alice, folder: "non-existent-folder-id" as ID, name: "New Name" });
    assertEquals("error" in renameRes, true);
    assertEquals((renameRes as { error: string }).error, 'Folder "non-existent-folder-id" not found for user user:Alice.');
  });

  // Test Case #18: Attempt to rename a folder owned by another user
  await t.step("Test Case #18: Rename another user's folder", async () => {
    const aliceFolderRes = await folderConcept.createFolder({ owner: alice, name: "Alice's Folder To Rename" });
    const aliceFolderId = (aliceFolderRes as { folder: ID }).folder;

    const renameRes = await folderConcept.renameFolder({ user: bob, folder: aliceFolderId, name: "Bob's New Name" });
    assertEquals("error" in renameRes, true);
    assertEquals((renameRes as { error: string }).error, `Folder "${aliceFolderId}" not found for user user:Bob.`);
  });

  // Test Case #19: Delete folder when there is no root folder to move groups to
  await t.step("Test Case #19: Delete folder with no root folder", async () => {
    const createFolderRes = await folderConcept.createFolder({ owner: bob, name: "Bob's Folder With Groups" });
    const folderId = (createFolderRes as { folder: ID }).folder;
    await folderConcept.addToFolder({ user: bob, folderName: "Bob's Folder With Groups", group: group3 });

    // Ensure Bob has no root folders
    const bobFolders = await db.collection("Folder.folders").find({ owner: bob }).toArray();
    for (const folder of bobFolders) {
      await db.collection("Folder.folders").deleteOne({ _id: folder._id });
    }

    // Spy on console.warn to check if it's called
    const consoleWarnSpy = import.meta.mock?.spy(console, "warn");

    const deleteRes = await folderConcept.deleteFolder({ user: bob, folder: folderId });
    assertEquals("error" in deleteRes, false);
    assertEquals(consoleWarnSpy?.called, true);

    // Check that the group is not in any folder for bob (since there was no root to move to)
    const foldersForBob = await db.collection("Folder.folders").find({ owner: bob }).toArray();
    let groupFound = false;
    for (const folder of foldersForBob) {
      if (folder.groups.includes(group3)) {
        groupFound = true;
        break;
      }
    }
    assertEquals(groupFound, false);
  });


  await client.close();
});
```
