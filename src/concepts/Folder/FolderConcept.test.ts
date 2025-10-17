import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FolderConcept from "./FolderConcept.ts";

Deno.test("--------------- 📂 FolderConcept - full workflow and edge cases 📂 ---------------", async (t) => {
  const [db, client] = await testDb();
  const folderConcept = new FolderConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const group1 = "group:G1" as ID;
  const group2 = "group:G2" as ID;
  const group3 = "group:G3" as ID;

  // Ensure root folders exist for all users
  async function ensureRootFolder(owner: ID) {
    const existingRoot = await db
      .collection<any>("Folder.folders")
      .findOne({ owner, parent: null });
    if (!existingRoot) {
      const rootRes = await folderConcept.createFolder({
        owner,
        name: "Root",
      });
      assertNotEquals("error" in rootRes, true, (rootRes as any).error);
      console.log(`Created root folder for ${owner} using createFolder action`);
    }
  }

  await ensureRootFolder(alice);
  await ensureRootFolder(bob);

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

      console.log("[1.1] Renaming folder 'MyDocs' to 'Documents'...");
      const renameRes = await folderConcept.renameFolder({
        user: alice,
        folder: myDocsFolderId,
        name: "Documents",
      });
      assertNotEquals("error" in renameRes, true);
      console.log("[1.1] Folder renamed successfully.");

      console.log("[1.2] Adding group 'G1' to 'Documents' folder...");
      const addGroup1Res = await folderConcept.addGroupToFolder({
        user: alice,
        folderName: "Documents",
        group: group1,
      });
      assertNotEquals("error" in addGroup1Res, true);

      // Verify folder content
      const folderAfterAdds = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(folderAfterAdds.groups.includes(group1), true);
      assertEquals(folderAfterAdds.groups.length, 1);
      console.log(
        "[1.2] Group 'G1' successfully added. Verified groups in folder:",
        folderAfterAdds.groups,
      );

      console.log("[1.3] Removing group 'G1' from 'Documents' folder...");
      const removeGroup1Res = await folderConcept.removeGroupFromFolder({
        user: alice,
        folder: myDocsFolderId,
        group: group1,
      });
      assertNotEquals("error" in removeGroup1Res, true);

      const folderAfterRemove = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(folderAfterRemove.groups.includes(group1), false);
      assertEquals(folderAfterRemove.groups.length, 0);
      console.log(
        "[1.3] Group 'G1' successfully removed. Verified groups in folder after removal:",
        folderAfterRemove.groups,
      );

      console.log("[1.4] Deleting 'Documents' folder...");
      const deleteRes = await folderConcept.deleteFolder({
        user: alice,
        folder: myDocsFolderId,
      });
      assertNotEquals("error" in deleteRes, true);

      const deletedFolder = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: myDocsFolderId });
      assertEquals(deletedFolder, null);
      console.log(
        "[1.4] Folder deleted successfully. Verified folder no longer exists in database.",
      );
    },
  );

  // Test Case #2: Deleting Folders with Groups Inside
  await t.step(
    "Test Case #2: Deleting folder with groups and verifying group migration",
    async () => {
      console.log("[2] Creating folder 'Archive' for Alice...");
      const createRes = await folderConcept.createFolder({
        owner: alice,
        name: "Archive",
      });
      assertNotEquals("error" in createRes, true, (createRes as any).error);
      const archiveFolderId = (createRes as { folder: ID }).folder;

      await folderConcept.addGroupToFolder({
        user: alice,
        folderName: "Archive",
        group: group1,
      });
      await folderConcept.addGroupToFolder({
        user: alice,
        folderName: "Archive",
        group: group3,
      });
      console.log("[2] Folder 'Archive' created with groups G1 and G3.");

      console.log("[2] Deleting 'Archive' folder...");
      const deleteRes = await folderConcept.deleteFolder({
        user: alice,
        folder: archiveFolderId,
      });
      assertNotEquals("error" in deleteRes, true);
      console.log("[2] Folder deleted.");

      const rootFolderForAlice = await db
        .collection<any>("Folder.folders")
        .findOne({ owner: alice, parent: null });
      assertEquals(rootFolderForAlice.groups.includes(group1), true);
      assertEquals(rootFolderForAlice.groups.includes(group3), true);
      console.log("[2] Groups migrated to root folder.");
    },
  );

  // Test Case #3: Moving folders
  await t.step(
    "Test Case #3: Moving folders (root to folder and nested)",
    async () => {
      console.log("[3] Creating three folders under Alice's root...");
      const folderARes = await folderConcept.createFolder({
        owner: alice,
        name: "FolderA",
      });
      const folderBRes = await folderConcept.createFolder({
        owner: alice,
        name: "FolderB",
      });
      const folderCRes = await folderConcept.createFolder({
        owner: alice,
        name: "FolderC",
      });

      const folderA = (folderARes as { folder: ID }).folder;
      const folderB = (folderBRes as { folder: ID }).folder;
      const folderC = (folderCRes as { folder: ID }).folder;

      console.log("[3] Moving FolderA inside FolderB...");
      const moveA = await folderConcept.moveFolder({
        user: alice,
        folderToMove: "FolderA",
        newParent: "FolderB",
      });
      assertNotEquals(
        "error" in moveA,
        true,
        (moveA as { error: string }).error,
      );

      const folderAAfter = await db.collection<any>("Folder.folders").findOne({
        _id: folderA,
      });
      assertEquals(folderAAfter.parent, folderB);
      console.log(`[3] Verified FolderA is now inside FolderB.`);

      console.log("[3] Moving FolderC inside FolderA (nested move)...");
      const moveC = await folderConcept.moveFolder({
        user: alice,
        folderToMove: "FolderC",
        newParent: "FolderA",
      });
      assertNotEquals("error" in moveC, true);

      const folderCAfter = await db.collection<any>("Folder.folders").findOne({
        _id: folderC,
      });
      assertEquals(folderCAfter.parent, folderA);
      console.log(`[5] Verified FolderC is now inside FolderA (nested).`);
    },
  );

  // Test Case #4: Adding the groups already in folder, Adding group to non-existent folder, Creating folder with duplicate name
  await t.step(
    "Test Case #4: Edge cases for adding groups and creating folders",
    async () => {
      console.log("[4] Creating folder 'Shared' for Bob...");
      const createRes = await folderConcept.createFolder({
        owner: bob,
        name: "Shared",
      });
      assertNotEquals("error" in createRes, true);
      const sharedFolderId = (createRes as { folder: ID }).folder;

      console.log("[4] Adding group 'G1' to Bob's 'Shared' folder...");
      await folderConcept.addGroupToFolder({
        user: bob,
        folderName: "Shared",
        group: group1,
      });

      console.log("[4] Bob attempting to add group 'G1' again...");
      const addGroupAgainRes = await folderConcept.addGroupToFolder({
        user: bob,
        folderName: "Shared",
        group: group1,
      });
      assertNotEquals("error" in addGroupAgainRes, true);
      const sharedFolderAfter = await db
        .collection<any>("Folder.folders")
        .findOne({ _id: sharedFolderId });
      assertEquals(sharedFolderAfter.groups.length, 1);
      console.log("[4] Success. Only one G1 in 'Shared' Folder");

      console.log("[4] Attempting to add group 'G2' to non-existent folder...");
      const addNonExistentRes = await folderConcept.addGroupToFolder({
        user: bob,
        folderName: "NonExistent",
        group: group2,
      });
      assertEquals("error" in addNonExistentRes, true);
      console.log(
        "[4] Got an error as expected",
        (addNonExistentRes as { error: string }).error,
      );

      console.log("[4] Attempting to create a folder named 'Shared' again...");
      const duplicateFolderRes = await folderConcept.createFolder({
        owner: bob,
        name: "Shared",
      });
      assertEquals("error" in duplicateFolderRes, true);

      console.log(
        "[4] Got an error as expected",
        (duplicateFolderRes as { error: string }).error,
      );
    },
  );

  // Test Case #5: Independence of Folders between Users
  await t.step(
    "Test Case #5: Independence of Folders between Users",
    async () => {
      console.log("[5] Creating folders for multiple users…");

      const alice = "user:Alice" as ID;
      const bob = "user:Bob" as ID;
      const group1 = "group:G1" as ID;

      const folderConcept = new FolderConcept(db);

      // Alice creates a folder
      const aliceFolder1Res = await folderConcept.createFolder({
        owner: alice,
        name: "AliceFolder",
      });
      assertNotEquals(
        "error" in aliceFolder1Res,
        true,
        (aliceFolder1Res as { error: string }).error,
      );
      const aliceFolder1 = (aliceFolder1Res as { folder: ID }).folder;
      console.log(`[5] Alice created folder: ${aliceFolder1}`);

      // Bob creates a folder
      const bobFolderRes = await folderConcept.createFolder({
        owner: bob,
        name: "BobFolder",
      });
      assertNotEquals(
        "error" in bobFolderRes,
        true,
        (bobFolderRes as { error: string }).error,
      );
      const bobFolder = (bobFolderRes as { folder: ID }).folder;
      console.log(`[5] Bob created folder: ${bobFolder}`);

      // Charlie creates no folders

      console.log(
        "[5] Alice adds group1 to AliceFolder and and Bob adds group1 to BobFolder…",
      );
      const addToAlice = await folderConcept.addGroupToFolder({
        user: alice,
        folderName: "AliceFolder",
        group: group1,
      });
      assertEquals("error" in addToAlice, false);

      const addToBob = await folderConcept.addGroupToFolder({
        user: bob,
        folderName: "BobFolder",
        group: group1,
      });
      assertEquals("error" in addToBob, false);

      console.log("[5] Verifying group locations for each user…");
      const aliceFolders = await folderConcept._listFolders({ user: alice });
      const bobFolders = await folderConcept._listFolders({ user: bob });
      assertEquals(
        (aliceFolders as any[]).find((f) => f.name === "AliceFolder").groups
          .includes(group1),
        true,
      );
      assertEquals(
        (bobFolders as any[]).find((f) => f.name === "BobFolder").groups
          .includes(group1),
        true,
      );

      console.log(
        "[5] ✅ group1 exists in Alice's folder and Bob's folder independently.",
      );
    },
  );

  await client.close();
});
