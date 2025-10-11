---
timestamp: 'Sat Oct 11 2025 16:40:09 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_164009.cbc9f250.md]]'
content_id: f87cf6d10a103797c90a8bef434aa75c40a4213a177e23aa99c7e2e643b2b2e9
---

# file: src/Group/GroupConcept.ts

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

// Assume User is a generic ID type managed elsewhere (e.g., UserAuthentication concept)
type User = ID;
type Group = ID;

const PREFIX = "Group" + ".";

/**
 * Represents a group with its associated properties.
 */
interface Groups {
  _id: Group;
  name: string;
  description: string;
  creator: User;
  members: User[]; // Storing members as an array of User IDs
}

// Define a generic result type that can either be successful or contain an error
type Result<T> = T | { error: string };

export default class GroupConcept {
  private groups: Collection<Groups>;

  constructor(private readonly db: Db) {
    this.groups = this.db.collection(PREFIX + "groups");
  }

  /**
   * Creates a new group.
   * @param creator The user creating the group.
   * @param name The name of the group.
   * @param description The description of the group.
   * @returns The ID of the newly created group, or an error object.
   */
  createGroup({
    creator,
    name,
    description,
  }: {
    creator: User;
    name: string;
    description: string;
  }): Result<{ group: Group }> {
    // Simulate user existence check
    if (!this.userExists(creator)) {
      return { error: "Creator user does not exist." };
    }
    if (!name || name.trim() === "") {
        return { error: "Group name cannot be empty." };
    }

    const newGroupId = freshID(); // Using freshID helper for string-based IDs
    const newGroup: Groups = {
      _id: newGroupId,
      name,
      description,
      creator,
      members: [creator], // The creator is the first member
    };

    try {
        this.groups.insertOne(newGroup);
        return { group: newGroupId };
    } catch (e) {
        console.error("Error creating group:", e);
        return { error: "An unexpected error occurred while creating the group." };
    }
  }

  /**
   * Adds a new member to an existing group.
   * @param group The ID of the group to add the member to.
   * @param inviter The user inviting the new member (must be in the group).
   * @param newMember The ID of the user to add.
   * @returns An empty object on success, or an error object.
   */
  addUser({
    group,
    inviter,
    newMember,
  }: {
    group: Group;
    inviter: User;
    newMember: User;
  }): Result<Empty> {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: inviter is in group, newMember is not already in group
    if (!groupDoc.members.includes(inviter)) {
      return { error: "Inviter is not a member of the group." };
    }
    if (groupDoc.members.includes(newMember)) {
      return { error: "New member is already in the group." };
    }

    if (!this.userExists(newMember)) {
        return { error: "New member user does not exist." };
    }

    try {
        this.groups.updateOne(
            { _id: group },
            { $addToSet: { members: newMember } } // $addToSet ensures uniqueness
        );
        return {};
    } catch (e) {
        console.error(`Error adding user ${newMember} to group ${group}:`, e);
        return { error: "An unexpected error occurred while adding the member." };
    }
  }

  /**
   * Removes a member from a group.
   * @param group The ID of the group.
   * @param remover The user performing the removal (must be in the group).
   * @param member The ID of the user to remove.
   * @returns An empty object on success, or an error object.
   */
  removeUser({
    group,
    remover,
    member,
  }: {
    group: Group;
    remover: User;
    member: User;
  }): Result<Empty> {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: remover and member exists in group
    if (!groupDoc.members.includes(remover)) {
      return { error: "Remover is not a member of the group." };
    }
    if (!groupDoc.members.includes(member)) {
      return { error: "Member to remove is not in the group." };
    }

    // Prevent removing the last member if it's the creator (optional, but good practice)
    if (member === groupDoc.creator && groupDoc.members.length === 1) {
      return { error: "Cannot remove the creator if they are the last member." };
    }

    try {
        this.groups.updateOne({ _id: group }, { $pull: { members: member } });
        return {};
    } catch (e) {
        console.error(`Error removing user ${member} from group ${group}:`, e);
        return { error: "An unexpected error occurred while removing the member." };
    }
  }

  /**
   * Allows a member to leave a group.
   * @param group The ID of the group.
   * @param member The ID of the user leaving the group.
   * @returns An empty object on success, or an error object.
   */
  leaveGroup({ group, member }: { group: Group; member: User }): Result<Empty> {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: member is in the group
    if (!groupDoc.members.includes(member)) {
      return { error: "Member is not in the group." };
    }

    // Prevent leaving if they are the only member and the creator
    if (member === groupDoc.creator && groupDoc.members.length === 1) {
      return { error: "Cannot leave if you are the only member and the creator." };
    }

    try {
        this.groups.updateOne({ _id: group }, { $pull: { members: member } });
        return {};
    } catch (e) {
        console.error(`Error user ${member} leaving group ${group}:`, e);
        return { error: "An unexpected error occurred while leaving the group." };
    }
  }

  /**
   * Deletes a group.
   * @param group The ID of the group to delete.
   * @returns An empty object on success, or an error object.
   */
  deleteGroup({ group }: { group: Group }): Result<Empty> {
    // Requires: group exists, no members to exist in group
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    if (groupDoc.members.length > 0) {
      return { error: "Cannot delete a group with active members." };
    }

    try {
        this.groups.deleteOne({ _id: group });
        return {};
    } catch (e) {
        console.error(`Error deleting group ${group}:`, e);
        return { error: "An unexpected error occurred while deleting the group." };
    }
  }

  /**
   * Lists all members of a group.
   * @param group The ID of the group.
   * @returns A record containing a set of user IDs (represented as an array), or an error object.
   */
  listMembers({ group }: { group: Group }): Result<{ members: User[] }> {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    return { members: groupDoc.members };
  }

  // Helper to get group by ID for other operations
  private getGroup(group: Group): Groups | null {
    return this.groups.findOne({ _id: group });
  }

  // Helper for checking if a user is a member of a group
  private isMember(group: Group, user: User): boolean {
    const groupDoc = this.getGroup(group);
    return groupDoc ? groupDoc.members.includes(user) : false;
  }

  // Helper to check if group exists
  private groupExists(group: Group): boolean {
    return this.groups.countDocuments({ _id: group }) > 0;
  }

  // Helper for checking if a user exists (simulated)
  private userExists(user: User): boolean {
    // In a real system, this would query the User concept or a user registry.
    // For this implementation, we'll assume any non-empty string ID is a valid user.
    return typeof user === "string" && user.length > 0;
  }
}

// Helper to generate a fresh ID (mimics the utility)
// In a real project, this would be imported from "@utils/database.ts"
function freshID(): ID {
  // Use ObjectId to generate a unique ID, then convert to string.
  // This mimics the ID type which is string-branded.
  return new ObjectId().toString() as ID;
}
```
