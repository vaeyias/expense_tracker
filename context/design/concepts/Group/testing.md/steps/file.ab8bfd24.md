---
timestamp: 'Sat Oct 11 2025 17:40:12 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_174012.ff5c559a.md]]'
content_id: ab8bfd24049107c09dbe256a3030751242b1a5215619982f5ddbc5ca65ef700f
---

# file: src/Group/GroupConcept.test.ts

```typescript
import { testDb } from "@utils/database.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import GroupConcept from "./GroupConcept.ts";

Deno.test("Group Concept", async (t) => {
  const [db, client] = await testDb();
  const groupConcept = new GroupConcept(db);

  const user1: string = "user1";
  const user2: string = "user2";
  const user3: string = "user3";
  const user4: string = "user4";

  await t.step("Operational Principle: Creating, adding members, and listing", async () => {
    console.log("--- Operational Principle: Creating, adding members, and listing ---");

    // Create a group
    const createResult1 = groupConcept.createGroup({
      creator: user1,
      name: "Project Alpha",
      description: "Team for Project Alpha",
    });
    const groupId1 = createResult1.group;
    console.log(`Created group: ${groupId1} by ${user1}`);
    assertEquals(typeof groupId1, "string", "Group ID should be a string.");

    // Add another member
    await groupConcept.addUser({
      group: groupId1,
      inviter: user1,
      newMember: user2,
    });
    console.log(`Added ${user2} to group ${groupId1} by ${user1}`);

    // Add a third member
    await groupConcept.addUser({
      group: groupId1,
      inviter: user2,
      newMember: user3,
    });
    console.log(`Added ${user3} to group ${groupId1} by ${user2}`);

    // List members
    const listMembersResult1 = await groupConcept.listMembers({ group: groupId1 });
    console.log(`Members of group ${groupId1}:`, listMembersResult1.members);
    assertEquals(listMembersResult1.members.length, 3, "Group should have 3 members.");
    assertEquals(listMembersResult1.members.sort(), [user1, user2, user3].sort(), "Members should match expected.");

    // Try to add an existing member again (should not change count)
    await groupConcept.addUser({
      group: groupId1,
      inviter: user1,
      newMember: user2,
    });
    console.log(`Attempted to add existing member ${user2} to group ${groupId1}`);
    const listMembersResult2 = await groupConcept.listMembers({ group: groupId1 });
    assertEquals(listMembersResult2.members.length, 3, "Adding existing member should not change member count.");

    // User leaves the group
    await groupConcept.leaveGroup({ group: groupId1, member: user2 });
    console.log(`${user2} left group ${groupId1}`);
    const listMembersResult3 = await groupConcept.listMembers({ group: groupId1 });
    console.log(`Members of group ${groupId1} after ${user2} left:`, listMembersResult3.members);
    assertEquals(listMembersResult3.members.length, 2, "Group should have 2 members after leave.");
    assertEquals(listMembersResult3.members.includes(user2), false, "User2 should no longer be a member.");

    console.log("--- Operational Principle Test Passed ---");
  });

  await t.step("Interesting Scenario: Group Not Found Errors", async () => {
    console.log("--- Interesting Scenario: Group Not Found Errors ---");

    const nonExistentGroupId = "nonExistentGroup123";

    // Test addUser with non-existent group
    assertThrows(
      async () => {
        await groupConcept.addUser({
          group: nonExistentGroupId,
          inviter: user1,
          newMember: user2,
        });
      },
      Error,
      "Group not found.",
      "addUser should throw 'Group not found' for non-existent group.",
    );
    console.log("addUser correctly threw 'Group not found' for non-existent group.");

    // Test removeUser with non-existent group
    assertThrows(
      async () => {
        await groupConcept.removeUser({
          group: nonExistentGroupId,
          remover: user1,
          member: user2,
        });
      },
      Error,
      "Group not found.",
      "removeUser should throw 'Group not found' for non-existent group.",
    );
    console.log("removeUser correctly threw 'Group not found' for non-existent group.");

    // Test leaveGroup with non-existent group
    assertThrows(
      async () => {
        await groupConcept.leaveGroup({ group: nonExistentGroupId, member: user1 });
      },
      Error,
      "Group not found.",
      "leaveGroup should throw 'Group not found' for non-existent group.",
    );
    console.log("leaveGroup correctly threw 'Group not found' for non-existent group.");

    // Test deleteGroup with non-existent group
    assertThrows(
      async () => {
        await groupConcept.deleteGroup({ group: nonExistentGroupId });
      },
      Error,
      "Group not found.",
      "deleteGroup should throw 'Group not found' for non-existent group.",
    );
    console.log("deleteGroup correctly threw 'Group not found' for non-existent group.");

    // Test listMembers with non-existent group
    assertThrows(
      async () => {
        await groupConcept.listMembers({ group: nonExistentGroupId });
      },
      Error,
      "Group not found.",
      "listMembers should throw 'Group not found' for non-existent group.",
    );
    console.log("listMembers correctly threw 'Group not found' for non-existent group.");

    console.log("--- Group Not Found Errors Test Passed ---");
  });

  await t.step("Interesting Scenario: Membership Authorization Errors", async () => {
    console.log("--- Interesting Scenario: Membership Authorization Errors ---");

    // Create a group
    const createResult = groupConcept.createGroup({
      creator: user1,
      name: "Project Beta",
      description: "Team for Project Beta",
    });
    const groupId = createResult.group;
    console.log(`Created group: ${groupId} by ${user1}`);

    // Add user2
    await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    console.log(`Added ${user2} to group ${groupId} by ${user1}`);

    // Try to add a member by someone not in the group
    assertThrows(
      async () => {
        await groupConcept.addUser({
          group: groupId,
          inviter: user3, // user3 is not in the group
          newMember: user4,
        });
      },
      Error,
      "Inviter is not a member of the group.",
      "addUser should throw if inviter is not a member.",
    );
    console.log("addUser correctly threw 'Inviter is not a member of the group.'");

    // Try to remove a member by someone not in the group
    assertThrows(
      async () => {
        await groupConcept.removeUser({
          group: groupId,
          remover: user3, // user3 is not in the group
          member: user2,
        });
      },
      Error,
      "Remover is not a member of the group.",
      "removeUser should throw if remover is not a member.",
    );
    console.log("removeUser correctly threw 'Remover is not a member of the group.'");

    // Try to remove a member who is not in the group
    assertThrows(
      async () => {
        await groupConcept.removeUser({
          group: groupId,
          remover: user1,
          member: user4, // user4 is not in the group
        });
      },
      Error,
      "Member to remove is not in the group.",
      "removeUser should throw if member to remove is not in the group.",
    );
    console.log("removeUser correctly threw 'Member to remove is not in the group.'");

    // Try to leave a group the user is not in
    assertThrows(
      async () => {
        await groupConcept.leaveGroup({ group: groupId, member: user3 }); // user3 is not in the group
      },
      Error,
      "Member is not in the group.",
      "leaveGroup should throw if member is not in the group.",
    );
    console.log("leaveGroup correctly threw 'Member is not in the group.'");

    console.log("--- Membership Authorization Errors Test Passed ---");
  });

  await t.step("Interesting Scenario: Deleting a Group with Members", async () => {
    console.log("--- Interesting Scenario: Deleting a Group with Members ---");

    // Create a group
    const createResult = groupConcept.createGroup({
      creator: user1,
      name: "Project Gamma",
      description: "Team for Project Gamma",
    });
    const groupId = createResult.group;
    console.log(`Created group: ${groupId} by ${user1}`);

    // Add user2
    await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    console.log(`Added ${user2} to group ${groupId} by ${user1}`);

    // Attempt to delete the group with members
    assertThrows(
      async () => {
        await groupConcept.deleteGroup({ group: groupId });
      },
      Error,
      "Cannot delete a group with active members.",
      "deleteGroup should throw if group has members.",
    );
    console.log("deleteGroup correctly threw 'Cannot delete a group with active members.'");

    // Remove the member and then try to delete again
    await groupConcept.removeUser({
      group: groupId,
      remover: user1,
      member: user2,
    });
    console.log(`Removed ${user2} from group ${groupId} by ${user1}`);

    // Delete the group now that it has no members
    await groupConcept.deleteGroup({ group: groupId });
    console.log(`Deleted group ${groupId}`);

    // Verify group deletion by trying to list members (should throw)
    assertThrows(
      async () => {
        await groupConcept.listMembers({ group: groupId });
      },
      Error,
      "Group not found.",
      "listMembers should throw if group is deleted.",
    );
    console.log("listMembers correctly threw 'Group not found.' after deletion.");

    console.log("--- Deleting a Group with Members Test Passed ---");
  });

  await t.step("Interesting Scenario: Creator Leaving as Last Member", async () => {
    console.log("--- Interesting Scenario: Creator Leaving as Last Member ---");

    // Create a group
    const createResult = groupConcept.createGroup({
      creator: user1,
      name: "Solo Project",
      description: "A project for one",
    });
    const groupId = createResult.group;
    console.log(`Created group: ${groupId} by ${user1}`);

    // Attempt to leave the group as the creator and only member
    assertThrows(
      async () => {
        await groupConcept.leaveGroup({ group: groupId, member: user1 });
      },
      Error,
      "Cannot leave if you are the only member and the creator.",
      "leaveGroup should prevent creator from leaving if they are the last member.",
    );
    console.log("leaveGroup correctly threw 'Cannot leave if you are the only member and the creator.'");

    // Remove the creator by another (non-existent) user should also fail due to auth
    assertThrows(
      async () => {
        await groupConcept.removeUser({
          group: groupId,
          remover: user2, // user2 is not in the group
          member: user1,
        });
      },
      Error,
      "Remover is not a member of the group.",
      "removeUser should fail if remover is not a member.",
    );
    console.log("removeUser correctly threw 'Remover is not a member of the group.'");

    // To actually delete the group, the creator must leave, which is prevented.
    // This scenario highlights a limitation if no other mechanism exists to disband.
    // For this test, we'll confirm the error is thrown.

    console.log("--- Creator Leaving as Last Member Test Passed ---");
  });

  await t.step("Interesting Scenario: Removing Creator as Last Member", async () => {
    console.log("--- Interesting Scenario: Removing Creator as Last Member ---");

    // Create a group
    const createResult = groupConcept.createGroup({
      creator: user1,
      name: "Last Stand",
      description: "The final group.",
    });
    const groupId = createResult.group;
    console.log(`Created group: ${groupId} by ${user1}`);

    // Attempt to remove the creator by themselves (which is not allowed by the 'remover' logic if remover is not in group)
    // The logic in removeUser expects the remover to be in the group, so this needs another member first.

    // Add another member
    await groupConcept.addUser({
      group: groupId,
      inviter: user1,
      newMember: user2,
    });
    console.log(`Added ${user2} to group ${groupId} by ${user1}`);

    // Now attempt to remove the creator (user1) by user2
    assertThrows(
      async () => {
        await groupConcept.removeUser({
          group: groupId,
          remover: user2,
          member: user1, // removing the creator
        });
      },
      Error,
      "Cannot remove the creator if they are the last member.",
      "removeUser should prevent removing creator if they are the last member.",
    );
    console.log("removeUser correctly threw 'Cannot remove the creator if they are the last member.'");

    // Verify members are still present
    const listMembersResult = await groupConcept.listMembers({ group: groupId });
    assertEquals(listMembersResult.members.length, 2, "Group should still have 2 members.");
    assertEquals(listMembersResult.members.sort(), [user1, user2].sort(), "Members should be the original two.");

    console.log("--- Removing Creator as Last Member Test Passed ---");
  });

  await client.close();
});
```
