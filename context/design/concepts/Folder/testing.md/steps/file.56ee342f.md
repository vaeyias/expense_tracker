---
timestamp: 'Wed Oct 15 2025 17:32:20 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251015_173220.d09162f9.md]]'
content_id: 56ee342ff4cb833534555b28fc4c9f76b2a9b4f56d1901d1fc686d4a656f2ff4
---

# file: src/Folder/FolderConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FolderConcept from "./FolderConcept.ts";

Deno.test("📂 FolderConcept - full workflow and edge cases", async (t) => {
  const [db, client] = await testDb();
  const folderConcept = new FolderConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const group1 = "group:G1" as ID;
  const group2 = "group:G2" as ID;
  const group3 = "group:G3" as ID;

  // Test Case #1: Full workflow - create folder, rename folder, add group to folder, remove group from folder, delete folder
  await t.step(
    "Test Case #1: Full workflow - create, rename, add/remove group, delete",
    async () => {
      console.log("[1] Creating folder 'MyDocs' for Alice...");
      const createRes = await folderConcept.createFolder({
        owner: alice,
        name: "MyDocs",
      });
      assertNotEquals("error" in createRes, true, (createRes as any).error);
      const myDocsFolderId = (createRes as { folder: ID }).folder;
      console.log(`[1] Folder 'MyDocs' created with ID: ${myDocsFolderId}`);

      console.log("[1] Renaming folder 'MyDocs' to 'Documents'...");
      const renameRes = await folderConcept.renameFolder({
        user: alice,
        folder: myDocsFolderId,
        name: "Documents",
      });
      assertNotEquals("error" in renameRes, true, (renameRes as any).error);
      console.log("[1] Folder renamed successfully.");

      console.log("[1] Adding group 'G1' to 'Documents' folder...");
      const addGroup1Res = await folderConcept.addToFolder({
        user: alice,
        folderName: "Documents",
        group: group1,
      });
      assertNotEquals("error" in addGroup1Res, true, (addGroup1Res as any).error);
      console.log("[1] Group 'G1' added.");

      console.log("[1] Adding group 'G2' to 'Documents' folder...");
      const addGroup2Res = await folderConcept.addToFolder({
        user: alice,
        folderName: "Documents",
        group: group2,
      });
      assertNotEquals("error" in addGroup2Res, true, (addGroup2Res as any).error);
      console.log("[1] Group 'G2' added.");

      // Verify folder content
      const folderAfterAdds = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(folderAfterAdds.groups.includes(group1), true);
      assertEquals(folderAfterAdds.groups.includes(group2), true);
      assertEquals(folderAfterAdds.groups.length, 2);
      console.log(
        "[1] Verified groups in folder: ",
        folderAfterAdds.groups,
      );

      console.log("[1] Removing group 'G1' from 'Documents' folder...");
      const removeGroup1Res = await folderConcept.removeFromFolder({
        user: alice,
        folder: myDocsFolderId,
        group: group1,
      });
      assertNotEquals("error" in removeGroup1Res, true, (removeGroup1Res as any).error);
      console.log("[1] Group 'G1' removed.");

      // Verify folder content after removal
      const folderAfterRemove = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(folderAfterRemove.groups.includes(group1), false);
      assertEquals(folderAfterRemove.groups.includes(group2), true);
      assertEquals(folderAfterRemove.groups.length, 1);
      console.log(
        "[1] Verified groups in folder after removal: ",
        folderAfterRemove.groups,
      );

      console.log("[1] Deleting 'Documents' folder...");
      const deleteRes = await folderConcept.deleteFolder({
        user: alice,
        folder: myDocsFolderId,
      });
      assertNotEquals("error" in deleteRes, true, (deleteRes as any).error);
      console.log("[1] Folder deleted successfully.");

      // Verify folder no longer exists
      const deletedFolder = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(deletedFolder, null);
      console.log("[1] Verified folder no longer exists in database.");

      // Verify group was moved to a root folder (assuming a root folder exists for Alice)
      const rootFolderForAlice = await db
        .collection<any>("Folder.folders")
        .findOne({ owner: alice, parent: null });
      if (rootFolderForAlice) {
        assertEquals(rootFolderForAlice.groups.includes(group2), true);
        console.log(
          `[1] Verified group '${group2}' moved to root folder '${rootFolderForAlice._id}'`,
        );
      } else {
        console.warn(
          "[1] No root folder found for Alice to verify group migration.",
        );
      }
    },
  );

  // Test Case #2: Trying to Delete Folders with Groups Inside
  await t.step(
    "Test Case #2: Deleting folder with groups and verifying group migration",
    async () => {
      console.log("[2] Creating folder 'Archive' for Alice with groups...");
      const createRes = await folderConcept.createFolder({
        owner: alice,
        name: "Archive",
      });
      assertNotEquals("error" in createRes, true, (createRes as any).error);
      const archiveFolderId = (createRes as { folder: ID }).folder;

      await folderConcept.addToFolder({
        user: alice,
        folderName: "Archive",
        group: group1,
      });
      await folderConcept.addToFolder({
        user: alice,
        folderName: "Archive",
        group: group3,
      });
      console.log(`[2] Folder 'Archive' created with groups '${group1}', '${group3}'.`);

      console.log("[2] Deleting 'Archive' folder...");
      const deleteRes = await folderConcept.deleteFolder({
        user: alice,
        folder: archiveFolderId,
      });
      assertNotEquals("error" in deleteRes, true, (deleteRes as any).error);
      console.log("[2] Folder 'Archive' deleted.");

      // Verify groups are now in a root folder
      const rootFolderForAlice = await db
        .collection<any>("Folder.folders")
        .findOne({ owner: alice, parent: null });
      if (rootFolderForAlice) {
        console.log(
          `[2] Verified groups '${group1}' and '${group3}' are in root folder '${rootFolderForAlice._id}'.`,
        );
        assertEquals(rootFolderForAlice.groups.includes(group1), true);
        assertEquals(rootFolderForAlice.groups.includes(group3), true);
        assertEquals(rootFolderForAlice.groups.length, 2); // Assuming no other root groups for Alice at this point
      } else {
        console.warn(
          "[2] No root folder found for Alice to verify group migration.",
        );
      }
    },
  );

  // Test Case #3: Adding the groups already in folder, Adding group to non-existent folder, Creating folder with duplicate name
  await t.step(
    "Test Case #3: Edge cases for adding groups and creating folders",
    async () => {
      console.log("[3] Creating folder 'Shared' for Bob...");
      const createRes = await folderConcept.createFolder({
        owner: bob,
        name: "Shared",
      });
      assertNotEquals("error" in createRes, true, (createRes as any).error);
      const sharedFolderId = (createRes as { folder: ID }).folder;
      console.log(`[3] Folder 'Shared' created with ID: ${sharedFolderId}`);

      console.log("[3] Adding group 'G1' to 'Shared' folder...");
      await folderConcept.addToFolder({
        user: bob,
        folderName: "Shared",
        group: group1,
      });

      console.log("[3] Attempting to add group 'G1' again to 'Shared' folder...");
      const addGroupAgainRes = await folderConcept.addToFolder({
        user: bob,
        folderName: "Shared",
        group: group1,
      });
      assertNotEquals(
        "error" in addGroupAgainRes,
        true,
        (addGroupAgainRes as any).error,
      ); // Should not error, just be a no-op
      console.log("[3] Adding an existing group has no effect, as expected.");

      const sharedFolderAfterDuplicateAdd = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: sharedFolderId });
      assertEquals(sharedFolderAfterDuplicateAdd.groups.length, 1);
      console.log(
        "[3] Verified folder 'Shared' still contains only one group.",
      );

      console.log(
        "[3] Attempting to add group 'G2' to a non-existent folder 'NonExistent'...",
      );
      const addToNonExistentFolderRes = await folderConcept.addToFolder({
        user: bob,
        folderName: "NonExistent",
        group: group2,
      });
      assertEquals("error" in addToNonExistentFolderRes, true);
      assertEquals(
        (addToNonExistentFolderRes as { error: string }).error,
        'Folder "NonExistent" not found for user user:Bob.',
      );
      console.log(
        "[3] Adding group to non-existent folder returned expected error.",
      );

      console.log("[3] Attempting to create a folder named 'Shared' again for Bob...");
      const createDuplicateFolderRes = await folderConcept.createFolder({
        owner: bob,
        name: "Shared",
      });
      assertEquals("error" in createDuplicateFolderRes, true);
      assertEquals(
        (createDuplicateFolderRes as { error: string }).error,
        'A folder with the name "Shared" already exists for this owner.',
      );
      console.log(
        "[3] Creating a folder with a duplicate name returned expected error.",
      );

      console.log("[3] Attempting to create a folder with missing name...");
      const createMissingNameRes = await folderConcept.createFolder({
        owner: bob,
        name: "",
      });
      assertEquals("error" in createMissingNameRes, true);
      assertEquals(
        (createMissingNameRes as { error: string }).error,
        "Owner and folder name are required.",
      );
      console.log(
        "[3] Creating a folder with a missing name returned expected error.",
      );

      console.log("[3] Attempting to add group with missing user...");
      const addMissingUserRes = await folderConcept.addToFolder({
        user: "" as ID,
        folderName: "Shared",
        group: group3,
      });
      assertEquals("error" in addMissingUserRes, true);
      assertEquals(
        (addMissingUserRes as { error: string }).error,
        "User, folder name, and group are required.",
      );
      console.log(
        "[3] Adding group with missing user returned expected error.",
      );
    },
  );

  // Test Case #4: Permissions and ownership checks
  await t.step(
    "Test Case #4: Permissions and ownership checks",
    async () => {
      console.log("[4] Creating folder 'AliceDocs' for Alice...");
      const createAliceDocsRes = await folderConcept.createFolder({
        owner: alice,
        name: "AliceDocs",
      });
      assertNotEquals("error" in createAliceDocsRes, true, (createAliceDocsRes as any).error);
      const aliceDocsFolderId = (createAliceDocsRes as { folder: ID }).folder;
      console.log(`[4] Folder 'AliceDocs' created with ID: ${aliceDocsFolderId}`);

      console.log("[4] Attempting to rename 'AliceDocs' by Bob (unauthorized)...");
      const renameUnauthorizedRes = await folderConcept.renameFolder({
        user: bob,
        folder: aliceDocsFolderId,
        name: "BobDocs",
      });
      assertEquals("error" in renameUnauthorizedRes, true);
      assertEquals(
        (renameUnauthorizedRes as { error: string }).error,
        `Folder "${aliceDocsFolderId}" not found for user user:Bob.`,
      );
      console.log(
        "[4] Renaming another user's folder returned expected error.",
      );

      console.log("[4] Attempting to add group 'G1' to 'AliceDocs' by Bob...");
      const addToAliceDocsByBobRes = await folderConcept.addToFolder({
        user: bob,
        folderName: "AliceDocs",
        group: group1,
      });
      assertEquals("error" in addToAliceDocsByBobRes, true);
      assertEquals(
        (addToAliceDocsByBobRes as { error: string }).error,
        `Folder "AliceDocs" not found for user user:Bob.`,
      );
      console.log(
        "[4] Adding group to another user's folder returned expected error.",
      );

      console.log("[4] Attempting to delete 'AliceDocs' by Bob...");
      const deleteAliceDocsByBobRes = await folderConcept.deleteFolder({
        user: bob,
        folder: aliceDocsFolderId,
      });
      assertEquals("error" in deleteAliceDocsByBobRes, true);
      assertEquals(
        (deleteAliceDocsByBobRes as { error: string }).error,
        `Folder "${aliceDocsFolderId}" not found for user user:Bob.`,
      );
      console.log(
        "[4] Deleting another user's folder returned expected error.",
      );
    },
  );

  await client.close();
});
```
