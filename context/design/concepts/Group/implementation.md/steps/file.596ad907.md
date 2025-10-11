---
timestamp: 'Sat Oct 11 2025 16:40:09 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_164009.cbc9f250.md]]'
content_id: 596ad90779eb91cb91daa9549a6ba465824648754e67667b21c24852bcda227c
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
   * @returns The ID of the newly created group.
   */
  createGroup({
    creator,
    name,
    description,
  }: {
    creator: User;
    name: string;
    description: string;
  }): { group: Group } {
    const newGroupId = freshID(); // Using freshID helper for string-based IDs
    const newGroup: Groups = {
      _id: newGroupId,
      name,
      description,
      creator,
      members: [creator], // The creator is the first member
    };

    // In a real scenario, you'd also check if 'creator' exists in a User concept.
    // For simplicity here, we assume it does.

    this.groups.insertOne(newGroup);

    return { group: newGroupId };
  }

  /**
   * Adds a new member to an existing group.
   * @param group The ID of the group to add the member to.
   * @param inviter The user inviting the new member (must be in the group).
   * @param newMember The ID of the user to add.
   */
  addUser({
    group,
    inviter,
    newMember,
  }: {
    group: Group;
    inviter: User;
    newMember: User;
  }): Empty {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      // In a real scenario, this would be an error return: {error: "Group not found"}
      // For now, let's assume exceptions for critical data integrity.
      throw new Error("Group not found.");
    }

    // Requires: inviter is in group, newMember is not already in group
    if (!groupDoc.members.includes(inviter)) {
      throw new Error("Inviter is not a member of the group.");
    }
    if (groupDoc.members.includes(newMember)) {
      // In a real scenario, this would be an error return: {error: "User already in group"}
      throw new Error("New member is already in the group.");
    }
    // In a real scenario, you'd also check if 'newMember' exists in a User concept.

    this.groups.updateOne(
      { _id: group },
      { $addToSet: { members: newMember } } // $addToSet ensures uniqueness
    );

    return {};
  }

  /**
   * Removes a member from a group.
   * @param group The ID of the group.
   * @param remover The user performing the removal (must be in the group).
   * @param member The ID of the user to remove.
   */
  removeUser({
    group,
    remover,
    member,
  }: {
    group: Group;
    remover: User;
    member: User;
  }): Empty {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      throw new Error("Group not found.");
    }

    // Requires: remover and member exist in group
    if (!groupDoc.members.includes(remover)) {
      throw new Error("Remover is not a member of the group.");
    }
    if (!groupDoc.members.includes(member)) {
      throw new Error("Member to remove is not in the group.");
    }

    // Prevent removing the last member if it's the creator (optional, but good practice)
    if (member === groupDoc.creator && groupDoc.members.length === 1) {
      throw new Error("Cannot remove the creator if they are the last member.");
    }

    this.groups.updateOne({ _id: group }, { $pull: { members: member } });

    return {};
  }

  /**
   * Allows a member to leave a group.
   * @param group The ID of the group.
   * @param member The ID of the user leaving the group.
   */
  leaveGroup({ group, member }: { group: Group; member: User }): Empty {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      throw new Error("Group not found.");
    }

    // Requires: member is in the group
    if (!groupDoc.members.includes(member)) {
      throw new Error("Member is not in the group.");
    }

    // Prevent leaving if they are the only member and the creator
    if (member === groupDoc.creator && groupDoc.members.length === 1) {
      throw new Error("Cannot leave if you are the only member and the creator.");
    }

    this.groups.updateOne({ _id: group }, { $pull: { members: member } });

    return {};
  }

  /**
   * Deletes a group.
   * @param group The ID of the group to delete.
   */
  deleteGroup({ group }: { group: Group }): Empty {
    // Requires: group exists, no members to exist in group
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      throw new Error("Group not found.");
    }

    if (groupDoc.members.length > 0) {
      throw new Error("Cannot delete a group with active members.");
    }

    this.groups.deleteOne({ _id: group });

    return {};
  }

  /**
   * Lists all members of a group.
   * @param group The ID of the group.
   * @returns A record containing a set of user IDs (represented as an array).
   */
  listMembers({ group }: { group: Group }): { members: User[] } {
    const groupDoc = this.groups.findOne({ _id: group });

    if (!groupDoc) {
      throw new Error("Group not found.");
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
  return new ObjectId().toString() as ID;
}
```

### Explanation of the Implementation:

1. **Imports**: We import `Collection`, `Db`, and `ObjectId` from `mongodb` for database operations. `Empty` and `ID` are assumed to be utility types for handling empty return types and generic IDs.
2. **Type Aliases**: `User` and `Group` are aliased to `ID` to represent their string-based identifiers.
3. **`PREFIX`**: A constant for prepending to collection names, ensuring uniqueness if multiple concepts use similar collection names.
4. **`Groups` Interface**: This interface defines the structure of documents stored in the `Groups` MongoDB collection, directly mapping to the `state` definition of the `Group` concept. `members` is an array of `User` IDs.
5. **`GroupConcept` Class**:
   * **Constructor**: Takes a `Db` instance and initializes the `groups` collection.
   * **`createGroup`**:
     * Generates a `newGroupId` using `freshID()`.
     * Creates a `newGroup` object, setting the `creator` as the first `member`.
     * Inserts the new group document into the `groups` collection.
     * Returns the `group` ID.
   * **`addUser`**:
     * Finds the target group.
     * Performs checks for the `inviter` being a member and `newMember` not being present (throwing errors for simplicity; a production system might return error objects).
     * Uses `$addToSet` in `updateOne` to add the `newMember` to the `members` array, ensuring uniqueness.
     * Returns an `Empty` object (`{}`).
   * **`removeUser`**:
     * Finds the target group.
     * Checks if `remover` and `member` are in the group.
     * Includes a safeguard against removing the creator if they are the last member.
     * Uses `$pull` in `updateOne` to remove the `member` from the `members` array.
     * Returns an `Empty` object (`{}`).
   * **`leaveGroup`**:
     * Similar to `removeUser`, but the `member` is the one leaving.
     * Includes a safeguard against the sole creator leaving.
     * Uses `$pull` to remove the `member`.
     * Returns an `Empty` object (`{}`).
   * **`deleteGroup`**:
     * Finds the target group.
     * Checks if the group has any members. If so, throws an error as per the `requires` clause.
     * Uses `deleteOne` to remove the group.
     * Returns an `Empty` object (`{}`).
   * **`listMembers`**:
     * Finds the target group.
     * Returns the `members` array from the group document.
   * **Private Helper Methods**: `getGroup`, `isMember`, `groupExists`, `userExists` are added to encapsulate common checks and make the action methods cleaner. `userExists` is a placeholder and would typically query another concept or a central user registry.
6. **`freshID()` Helper**: A simple implementation of `freshID` to generate string-based IDs using MongoDB's `ObjectId` for demonstration.
