import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import GroupConcept from "./GroupConcept.ts";

Deno.test("--------------- 👥 GroupConcept - operational principle & scenarios 👥 ---------------", async (t) => {
  const [db, client] = await testDb();
  const groupConcept = new GroupConcept(db);

  const user1 = "user-1" as ID;
  const user2 = "user-2" as ID;
  const user3 = "user-3" as ID;

  const cleanup = async () => {
    await db.collection("Group.groups").deleteMany({});
  };

  await t.step(
    "Test Case #1: Operational principle: Create, add, leave, delete",
    async () => {
      await cleanup();

      console.log("[1] Creating group by user1...");
      const groupRes = await groupConcept.createGroup({
        creator: user1,
        name: "Project Alpha",
        description: "A group for Project Alpha tasks",
      });
      assertNotEquals(
        "error" in groupRes,
        true,
        "Group creation should not fail.",
      );
      const { group: groupId } = groupRes as { group: ID };
      assertExists(groupId);
      console.log("[1] Created group ID:", groupId);

      console.log("[1] Adding user2 to the group...");
      const addRes = await groupConcept.addUser({
        group: groupId,
        inviter: user1,
        newMember: user2,
      });
      assertNotEquals("error" in addRes, true, "Adding user2 should not fail.");

      let membersRes = await groupConcept._listMembers({ group: groupId });
      assertNotEquals(
        "error" in membersRes,
        true,
        "Listing members should not fail.",
      );
      let { members } = membersRes as { members: ID[] };
      console.log("[1] Members after add:", members);
      assertEquals(members.sort(), [user1, user2].sort());

      console.log("[1] User1 removes User2 from the group...");
      const removeRes = await groupConcept.removeUser({
        group: groupId,
        remover: user1,
        member: user2,
      });
      assertNotEquals(
        "error" in removeRes,
        true,
        "Removing user2 should not fail.",
      );

      membersRes = await groupConcept._listMembers({ group: groupId });
      assertNotEquals(
        "error" in membersRes,
        true,
        "Listing members should not fail.",
      );
      members = (membersRes as { members: ID[] }).members;
      console.log("[1] Members after removal:", members);
      assertEquals(members, [user1]);

      console.log("[1] User1 leaves the group...");
      const leaveRes = await groupConcept.leaveGroup({
        group: groupId,
        member: user1,
      });
      assertNotEquals(
        "error" in leaveRes,
        true,
        "User1 leaving should not fail.",
      );

      membersRes = await groupConcept._listMembers({ group: groupId });
      assertNotEquals(
        "error" in membersRes,
        true,
        "Listing members should not fail.",
      );
      members = (membersRes as { members: ID[] }).members;
      console.log("[1] Members after removal:", members);
      assertEquals(members, []);

      console.log("[1] Deleting the group...");
      const deleteRes = await groupConcept.deleteGroup({ group: groupId });
      assertNotEquals(
        "error" in deleteRes,
        true,
        "Deleting group should not fail.",
      );

      const exists = await db.collection("Group.groups").countDocuments({
        _id: groupId,
      });
      assertEquals(exists, 0);
      console.log("[1] Group deleted successfully.");
    },
  );

  await t.step(
    "Test Case #2: Actions on non-existent group should return errors",
    async () => {
      await cleanup();
      const nonExistentGroupId = "non-existent-group-id" as ID;

      console.log("[2] Trying to add user to non-existent group...");
      let result = await groupConcept.addUser({
        group: nonExistentGroupId,
        inviter: user1,
        newMember: user2,
      });
      assertEquals(result.error, "Group not found.");

      console.log("[2] Trying to remove user from non-existent group...");
      result = await groupConcept.removeUser({
        group: nonExistentGroupId,
        remover: user1,
        member: user2,
      });
      assertEquals(result.error, "Group not found.");

      console.log("[2] Trying to delete non-existent group...");
      result = await groupConcept.deleteGroup({ group: nonExistentGroupId });
      assertEquals(result.error, "Group not found.");
    },
  );

  await t.step("Test Case #3: Scenario: Permissions & integrity", async () => {
    await cleanup();
    const groupRes = await groupConcept.createGroup({
      creator: user1,
      name: "Team Nebula",
      description: "Nebula team",
    });
    assertNotEquals(
      "error" in groupRes,
      true,
      "Group creation should not fail.",
    );
    const { group: groupId } = groupRes as { group: ID };
    assertExists(groupId);

    const addRes = await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    assertNotEquals(
      "error" in addRes,
      true,
      `Adding user2 should not fail. ${addRes.error}`,
    );

    console.log("[3] Removing user2 by non-member user3...");
    let result = await groupConcept.removeUser({
      group: groupId,
      remover: user3,
      member: user2,
    });
    assertEquals(result.error, "Remover is not a member of the group.");

    console.log("[3] Adding user3 by non-member user3...");
    result = await groupConcept.addUser({
      group: groupId,
      inviter: user3,
      newMember: user3,
    });
    assertEquals(result.error, "Inviter is not a member of the group.");

    console.log("[3] Adding existing user2 again...");
    result = await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    assertEquals(result.error, "New member is already in the group.");

    console.log("[3] Removing non-member user3...");
    result = await groupConcept.removeUser({
      group: groupId,
      remover: user1,
      member: user3,
    });
    assertEquals(result.error, "Member to remove is not in the group.");

    console.log("[3] User3 leaving without being in the group...");
    result = await groupConcept.leaveGroup({ group: groupId, member: user3 });
    assertEquals(result.error, "Member is not in the group.");
  });

  await t.step("Test Case #4: Deletion constraints", async () => {
    await cleanup();
    const groupRes = await groupConcept.createGroup({
      creator: user1,
      name: "Dev Team",
      description: "Development",
    });
    assertNotEquals(
      "error" in groupRes,
      true,
      "Group creation should not fail.",
    );
    const { group: groupId } = groupRes as { group: ID };
    assertExists(groupId);

    const addRes = await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    assertNotEquals("error" in addRes, true, "Adding user2 should not fail.");

    console.log("[4] Attempting to delete group with active members...");
    const result = await groupConcept.deleteGroup({ group: groupId });
    assertEquals(result.error, "Cannot delete a group with active members.");

    console.log("[4] User2 leaves group...");
    const leaveRes = await groupConcept.leaveGroup({
      group: groupId,
      member: user2,
    });
    assertNotEquals(
      "error" in leaveRes,
      true,
      "User2 leaving should not fail.",
    );

    console.log("[4] User1 leaves group...");
    const leaveRes2 = await groupConcept.leaveGroup({
      group: groupId,
      member: user1,
    });
    assertNotEquals(
      "error" in leaveRes2,
      true,
      "User1 leaving should not fail.",
    );

    console.log("[4] Deleting group after members left...");
    const deleteRes = await groupConcept.deleteGroup({ group: groupId });
    assertNotEquals(
      "error" in deleteRes,
      true,
      "Deleting group should not fail.",
    );

    const exists = await db.collection("Group.groups").countDocuments({
      _id: groupId,
    });
    assertEquals(exists, 0);
  });

  await client.close();
});
