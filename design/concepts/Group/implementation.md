# group-implementation
```ts
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

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
   * @returns The ID of the newly created group or an error object.
   */
  async createGroup({
    creator,
    name,
    description,
  }: {
    creator: User;
    name: string;
    description: string;
  }): Promise<{ group: Group } | { error: string }> {
    // In a real scenario, you'd also check if 'creator' exists in a User concept.
    if (!this.userExists(creator)) {
      return { error: "Creator does not exist." };
    }

    const newGroupId = freshID(); // Using freshID helper for string-based IDs
    const newGroup: Groups = {
      _id: newGroupId,
      name,
      description,
      creator,
      members: [creator], // The creator is the first member
    };

    await this.groups.insertOne(newGroup);

    return { group: newGroupId };
  }

  /**
   * Adds a new member to an existing group.
   * @param group The ID of the group to add the member to.
   * @param inviter The user inviting the new member (must be in the group).
   * @param newMember The ID of the user to add.
   */
  async addUser({
    group,
    inviter,
    newMember,
  }: {
    group: Group;
    inviter: User;
    newMember: User;
  }): Promise<Empty | { error: string }> {
    const groupDoc = await this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: inviter is in group, newMember is not already in group
    if (!groupDoc.members.includes(inviter)) {
      return { error: "Inviter is not a member of the group." };
    }
    if (groupDoc.members.includes(newMember)) {
      return { error: "User is already in the group." };
    }
    if (!this.userExists(newMember)) {
      return { error: "User does not exist." };
    }

    await this.groups.updateOne(
      { _id: group },
      { $addToSet: { members: newMember } }, // $addToSet ensures uniqueness
    );

    return {};
  }

  /**
   * Removes a member from a group.
   * @param group The ID of the group.
   * @param remover The user performing the removal (must be in the group).
   * @param member The ID of the user to remove.
   */
  async removeUser({
    group,
    remover,
    member,
  }: {
    group: Group;
    remover: User;
    member: User;
  }): Promise<Empty | { error: string }> {
    const groupDoc = await this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: remover and member exist in group
    if (!groupDoc.members.includes(remover)) {
      return { error: "Remover is not a member of the group." };
    }
    if (!groupDoc.members.includes(member)) {
      return { error: "Member to remove is not in the group." };
    }

    // Prevent removing the last member if it's the creator (optional, but good practice)
    if (member === groupDoc.creator && groupDoc.members.length === 1) {
      return {
        error: "Cannot remove the creator if they are the last member.",
      };
    }

    await this.groups.updateOne({ _id: group }, { $pull: { members: member } });

    return {};
  }

  /**
   * Allows a member to leave a group.
   * @param group The ID of the group.
   * @param member The ID of the user leaving the group.
   */
  async leaveGroup(
    { group, member }: { group: Group; member: User },
  ): Promise<Empty | { error: string }> {
    const groupDoc = await this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    // Requires: member is in the group
    if (!groupDoc.members.includes(member)) {
      return { error: "Member is not in the group." };
    }

    await this.groups.updateOne({ _id: group }, { $pull: { members: member } });

    return {};
  }

  /**
   * Deletes a group.
   * @param group The ID of the group to delete.
   */
  async deleteGroup(
    { group }: { group: Group },
  ): Promise<Empty | { error: string }> {
    const groupDoc = await this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    if (groupDoc.members.length > 0) {
      return { error: "Cannot delete a group with active members." };
    }

    await this.groups.deleteOne({ _id: group });

    return {};
  }

  /**
   * Lists all members of a group.
   * @param group The ID of the group.
   * @returns A record containing a set of user IDs (represented as an array).
   */
  async _listMembers(
    { group }: { group: Group },
  ): Promise<{ members: User[] } | { error: string }> {
    const groupDoc = await this.groups.findOne({ _id: group });

    if (!groupDoc) {
      return { error: "Group not found." };
    }

    return { members: groupDoc.members };
  }

  // Helper to get group by ID for other operations
  private async _getGroup(
    { group }: { group: Group },
  ): Promise<Groups | null> {
    // console.log("hi", group);
    const groupDoc = await this.groups.findOne({ _id: group });
    // console.log(groupDoc?.members);
    return groupDoc;
  }

  // Helper for checking if a user is a member of a group
  private async isMember(
    { group, user }: { group: Group; user: User },
  ): Promise<boolean> {
    const groupDoc = await this._getGroup({ group });
    return groupDoc ? groupDoc.members.includes(user) : false;
  }

  // Helper to check if group exists
  private async groupExists(group: Group): Promise<boolean> {
    return await this.groups.countDocuments({ _id: group }) > 0;
  }

  // Helper for checking if a user exists (simulated)
  private userExists(user: User): boolean {
    // In a real system, this would query the User concept or a user registry.
    // For this implementation, we'll assume any non-empty string ID is a valid user.
    return typeof user === "string" && user.length > 0;
  }
}
```
