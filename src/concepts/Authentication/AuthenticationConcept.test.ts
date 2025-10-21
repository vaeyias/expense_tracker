import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import AuthenticationConcept from "./AuthenticationConcept.ts";

Deno.test("--------------- 🧑 authenticationConcept - user management 🧑 ---------------", async (t) => {
  const [db, client] = await testDb();
  const authenticationConcept = new AuthenticationConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const charlie = "user:Charlie" as ID;

  // Test Case #1: Full workflow - create a user, edit displayName, delete a user
  await t.step("Test Case #1: Full user workflow", async () => {
    console.log("[1] Creating user Alice...");
    const aliceCreation = await authenticationConcept.createUser({
      username: "alice",
      displayName: "Alice Wonderland",
      password: "alicePass123",
    });
    assertNotEquals(
      "error" in aliceCreation,
      true,
      (aliceCreation as { error: string }).error,
    );
    const aliceId = (aliceCreation as { user: ID }).user;
    console.log(`[1] Alice created with ID: ${aliceId}`);

    console.log("[1] Retrieving Alice's info...");
    let aliceInfo = await authenticationConcept._getUserById({ user: aliceId });
    assertNotEquals(
      "error" in aliceInfo,
      true,
      (aliceInfo as { error: string }).error,
    );
    assertEquals(
      (aliceInfo as { userInfo: { displayName: string } }).userInfo.displayName,
      "Alice Wonderland",
    );
    console.log(
      `[1] Alice's initial displayName: ${
        (aliceInfo as { userInfo: { displayName: string } }).userInfo
          .displayName
      }`,
    );

    console.log("[1] Updating Alice's displayName...");

    const newAlice = await authenticationConcept.editUser({
      user: aliceId,
      newDisplayName: "Alice Borderland",
    });

    aliceInfo = await authenticationConcept._getUserById({ user: aliceId });
    assertNotEquals(
      "error" in aliceInfo,
      true,
      (aliceInfo as { error: string }).error,
    );

    assertEquals(
      (aliceInfo as { userInfo: { displayName: string } }).userInfo.displayName,
      "Alice Borderland",
    );

    console.log(
      `[1] Alice's new displayName: ${
        (aliceInfo as { userInfo: { displayName: string } }).userInfo
          .displayName
      }`,
    );

    console.log("[1] Deleting Alice...");
    const deleteAliceRes = await authenticationConcept.deleteUser({
      user: aliceId,
    });
    assertEquals(
      deleteAliceRes,
      {},
      "Alice deletion did not return empty object.",
    );
    console.log("[1] Alice deleted.");

    console.log("[1] Attempting to retrieve deleted Alice...");
    const deletedAliceInfo = await authenticationConcept._getUserById({
      user: aliceId,
    });
    assertEquals(
      "error" in deletedAliceInfo,
      true,
      "Retrieving deleted user should return an error.",
    );
    console.log("[1] Successfully confirmed Alice is deleted.");
  });

  // Test Case #2: Duplicate Username - create a user, try to create another user with same username
  await t.step("Test Case #2: Duplicate Username Handling", async () => {
    console.log("[2] Creating user Bob...");
    const bobCreation = await authenticationConcept.createUser({
      username: "bob",
      displayName: "Bob The Builder",
      password: "bobPass123",
    });
    assertNotEquals(
      "error" in bobCreation,
      true,
      (bobCreation as { error: string }).error,
    );
    const bobId = (bobCreation as { user: ID }).user;
    console.log(`[2] Bob created with ID: ${bobId}`);

    console.log("[2] Attempting to create another user with username 'bob'...");
    const duplicateBobCreation = await authenticationConcept.createUser({
      username: "bob",
      displayName: "Bob The Second",
      password: "anotherPass",
    });
    assertEquals(
      "error" in duplicateBobCreation,
      true,
      "Duplicate username creation should return an error.",
    );
    console.log(
      `[2] Duplicate username creation failed as expected: ${
        (duplicateBobCreation as { error: string }).error
      }`,
    );

    // Clean up
    await authenticationConcept.deleteUser({ user: bobId });
  });

  // Test Case #3: Duplicate Display Name is Allowed
  await t.step("Test Case #3: Duplicate Display Name Allowed", async () => {
    console.log("[3] Creating user Charlie...");
    const charlieCreation = await authenticationConcept.createUser({
      username: "charlie",
      displayName: "Charlie Chaplin",
      password: "charliePass123",
    });
    assertNotEquals(
      "error" in charlieCreation,
      true,
      (charlieCreation as { error: string }).error,
    );
    const charlieId = (charlieCreation as { user: ID }).user;
    console.log(`[3] Charlie created with ID: ${charlieId}`);

    console.log(
      "[3] Creating another user with the same displayName 'Charlie Chaplin'...",
    );
    const anotherCharlieCreation = await authenticationConcept.createUser({
      username: "another_charlie",
      displayName: "Charlie Chaplin",
      password: "anotherCharliePass",
    });
    assertNotEquals(
      "error" in anotherCharlieCreation,
      true,
      (anotherCharlieCreation as { error: string }).error,
    );
    const anotherCharlieId = (anotherCharlieCreation as { user: ID }).user;
    console.log(
      `[3] Another user with same displayName created with ID: ${anotherCharlieId}`,
    );

    const charlieInfo = await authenticationConcept._getUserById({
      user: charlieId,
    });
    const anotherCharlieInfo = await authenticationConcept._getUserById({
      user: anotherCharlieId,
    });

    assertNotEquals("error" in charlieInfo, true);
    assertNotEquals("error" in anotherCharlieInfo, true);

    assertEquals(
      (charlieInfo as { userInfo: { displayName: string } }).userInfo
        .displayName,
      "Charlie Chaplin",
    );
    assertEquals(
      (anotherCharlieInfo as { userInfo: { displayName: string } }).userInfo
        .displayName,
      "Charlie Chaplin",
    );
    console.log(
      "[3] Successfully created two users with the same displayName.",
    );

    // Clean up
    await authenticationConcept.deleteUser({ user: charlieId });
    await authenticationConcept.deleteUser({ user: anotherCharlieId });
  });

  await client.close();
});
