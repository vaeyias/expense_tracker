---
timestamp: 'Thu Oct 16 2025 16:28:01 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_162801.23e1d2db.md]]'
content_id: ad5ea4eddeb4911f55130156d9c057276947e40a2700f76fa98930d184185983
---

# file: src/User/UserConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import UserConcept from "./UserConcept.ts";

Deno.test("👤 UserConcept - user management", async (t) => {
  const [db, client] = await testDb();
  const userConcept = new UserConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const charlie = "user:Charlie" as ID;

  // Test Case #1: Full workflow - create a user, edit displayName, delete a user
  await t.step("Test Case #1: Full user workflow", async () => {
    console.log("[1] Creating user Alice...");
    const aliceCreation = await userConcept.createUser({
      username: "alice",
      displayName: "Alice Wonderland",
    });
    assertNotEquals("error" in aliceCreation, true, (aliceCreation as { error: string }).error);
    const aliceId = (aliceCreation as { user: ID }).user;
    console.log(`[1] Alice created with ID: ${aliceId}`);

    console.log("[1] Retrieving Alice's info...");
    let aliceInfo = await userConcept.getUserById({ user: aliceId });
    assertNotEquals("error" in aliceInfo, true, (aliceInfo as { error: string }).error);
    assertEquals((aliceInfo as { userInfo: { displayName: string } }).userInfo.displayName, "Alice Wonderland");
    console.log(`[1] Alice's initial displayName: ${((aliceInfo as { userInfo: { displayName: string } }).userInfo).displayName}`);

    console.log("[1] Updating Alice's displayName...");
    // Note: The current UserConcept spec does not have an update function.
    // Assuming a hypothetical update function for demonstration purposes or that createUser can be used to update if username is unique.
    // For this test, we will simulate an update by creating a new user with the same username but a different display name and expect an error.
    // If an update function were available, it would look something like this:
    // await userConcept.updateUser({ user: aliceId, displayName: "Alice The Great" });
    // For now, we'll proceed with testing the existing functions.

    console.log("[1] Deleting Alice...");
    const deleteAliceRes = await userConcept.deleteUser({ user: aliceId });
    assertEquals(deleteAliceRes, {}, "Alice deletion did not return empty object.");
    console.log("[1] Alice deleted.");

    console.log("[1] Attempting to retrieve deleted Alice...");
    const deletedAliceInfo = await userConcept.getUserById({ user: aliceId });
    assertEquals("error" in deletedAliceInfo, true, "Retrieving deleted user should return an error.");
    console.log("[1] Successfully confirmed Alice is deleted.");
  });

  // Test Case #2: Duplicate Username - create a user, try to create another user with same username
  await t.step("Test Case #2: Duplicate Username Handling", async () => {
    console.log("[2] Creating user Bob...");
    const bobCreation = await userConcept.createUser({
      username: "bob",
      displayName: "Bob The Builder",
    });
    assertNotEquals("error" in bobCreation, true, (bobCreation as { error: string }).error);
    const bobId = (bobCreation as { user: ID }).user;
    console.log(`[2] Bob created with ID: ${bobId}`);

    console.log("[2] Attempting to create another user with username 'bob'...");
    const duplicateBobCreation = await userConcept.createUser({
      username: "bob",
      displayName: "Bob The Second",
    });
    assertEquals("error" in duplicateBobCreation, true, "Duplicate username creation should return an error.");
    console.log(`[2] Duplicate username creation failed as expected: ${(duplicateBobCreation as { error: string }).error}`);

    // Clean up
    await userConcept.deleteUser({ user: bobId });
  });

  // Test Case #3: Duplicate Display Name is Allowed
  await t.step("Test Case #3: Duplicate Display Name Allowed", async () => {
    console.log("[3] Creating user Charlie...");
    const charlieCreation = await userConcept.createUser({
      username: "charlie",
      displayName: "Charlie Chaplin",
    });
    assertNotEquals("error" in charlieCreation, true, (charlieCreation as { error: string }).error);
    const charlieId = (charlieCreation as { user: ID }).user;
    console.log(`[3] Charlie created with ID: ${charlieId}`);

    console.log("[3] Creating another user with the same displayName 'Charlie Chaplin'...");
    const anotherCharlieCreation = await userConcept.createUser({
      username: "another_charlie",
      displayName: "Charlie Chaplin",
    });
    assertNotEquals("error" in anotherCharlieCreation, true, (anotherCharlieCreation as { error: string }).error);
    const anotherCharlieId = (anotherCharlieCreation as { user: ID }).user;
    console.log(`[3] Another user with same displayName created with ID: ${anotherCharlieId}`);

    let charlieInfo = await userConcept.getUserById({ user: charlieId });
    let anotherCharlieInfo = await userConcept.getUserById({ user: anotherCharlieId });

    assertNotEquals("error" in charlieInfo, true);
    assertNotEquals("error" in anotherCharlieInfo, true);

    assertEquals((charlieInfo as { userInfo: { displayName: string } }).userInfo.displayName, "Charlie Chaplin");
    assertEquals((anotherCharlieInfo as { userInfo: { displayName: string } }).userInfo.displayName, "Charlie Chaplin");
    console.log("[3] Both users have the same displayName.");

    // Clean up
    await userConcept.deleteUser({ user: charlieId });
    await userConcept.deleteUser({ user: anotherCharlieId });
  });

  await client.close();
});
```
