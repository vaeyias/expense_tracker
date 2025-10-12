---
timestamp: 'Sun Oct 12 2025 12:25:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251012_122504.221fa3a9.md]]'
content_id: d7654bc52f852b448eadc51428f172b4397adba511bd56b0d14a5f487d820ca9
---

# file: src/Group/GroupConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

// Declare collection prefix, use concept name
const PREFIX = "Group" + ".";

// Generic types of this concept
type Group = ID;
type User = ID;

/**
 * a set of Groups with
 *   a name String
 *   a members set of User
 */
interface Groups {
  _id: Group;
  name: string;
  members: User[];
}

export default class GroupConcept {
  groups: Collection<Groups>;

  constructor(private readonly db: Db) {
    this.groups = this.db.collection(PREFIX + "groups");
  }

  /**
   * Creates a new group with a given name.
   * @param name - The name of the new group.
   * @returns An empty object upon successful creation.
   */
  createUserGroup({ name }: { name: string }): Empty {
    if (!name) {
      return { error: "Group name cannot be empty." };
    }
    // Check if a group with the same name already exists
    const existingGroup = this.groups.findOne({ name });
    if (existingGroup) {
      return { error: `A group with the name "${name}" already exists.` };
    }

    const newGroup = {
      _id: this.freshID(), // Use freshID for MongoDB ObjectId
      name: name,
      members: [],
    };
    this.groups.insertOne(newGroup);
    return {};
  }

  /**
   * Adds a user to an existing group.
   * @param group - The ID of the group.
   * @param user - The ID of the user to add.
   * @returns An empty object upon successful addition, or an error object if the group or user does not exist or the user is already a member.
   */
  addUserToGroup({ group, user }: { group: Group; user: User }): Empty {
    const existingGroup = this.groups.findOne({ _id: group });
    if (!existingGroup) {
      return { error: `Group with ID "${group}" not found.` };
    }

    if (existingGroup.members.includes(user)) {
      return { error: `User "${user}" is already a member of group "${group}".` };
    }

    const result = this.groups.updateOne(
      { _id: group },
      { $addToSet: { members: user } }
    );

    if (result.modifiedCount === 0) {
      // This case might occur if the group was deleted between findOne and updateOne,
      // or if the user was added by another concurrent operation.
      // We've already checked for the user being in the group, so it's likely a race condition or deletion.
      return { error: `Failed to add user "${user}" to group "${group}".` };
    }

    return {};
  }

  /**
   * Removes a user from an existing group.
   * @param group - The ID of the group.
   * @param user - The ID of the user to remove.
   * @returns An empty object upon successful removal, or an error object if the group does not exist or the user is not a member.
   */
  removeUserFromGroup({ group, user }: { group: Group; user: User }): Empty {
    const existingGroup = this.groups.findOne({ _id: group });
    if (!existingGroup) {
      return { error: `Group with ID "${group}" not found.` };
    }

    if (!existingGroup.members.includes(user)) {
      return { error: `User "${user}" is not a member of group "${group}".` };
    }

    const result = this.groups.updateOne(
      { _id: group },
      { $pull: { members: user } }
    );

    if (result.modifiedCount === 0) {
      // Similar to addUserToGroup, this could indicate a race condition or deletion.
      return { error: `Failed to remove user "${user}" from group "${group}".` };
    }

    return {};
  }

  /**
   * Returns the list of users in a group.
   * @param group - The ID of the group.
   * @returns An object containing a list of user IDs, or an error object if the group does not exist.
   */
  _getGroupMembers({ group }: { group: Group }): { members: User[] } | { error: string } {
    const foundGroup = this.groups.findOne({ _id: group });
    if (!foundGroup) {
      return { error: `Group with ID "${group}" not found.` };
    }
    return { members: foundGroup.members };
  }

  // Helper function to generate fresh IDs, mimicking the utility
  private freshID(): ID {
    // In a real scenario, this would use a utility function that interacts with MongoDB's ObjectId generation or a custom ID generation strategy.
    // For this example, we'll use a placeholder.
    // Ensure @utils/database.ts and @utils/types.ts are available for the actual implementation.
    // For demonstration purposes:
    return new this.db.bson.ObjectId().toString() as ID;
  }
}
```
