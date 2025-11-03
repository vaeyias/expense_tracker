import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Generic types
type User = ID;
type Folder = ID;
type Group = ID;

const PREFIX = "Folder" + ".";

/**
 * Concept: Folder
 * Purpose: Allows users to organize groups into custom structures.
 */
interface Folders {
  _id: Folder; // Unique identifier for the folder.
  parent: Folder | null; // The parent folder's ID, or null for root folders.
  name: string; // The name of the folder.
  owner: User; // The user who owns this folder.
  groups: Group[]; // A set of group IDs contained within this folder.
}

export default class FolderConcept {
  folders: Collection<Folders>;

  constructor(private readonly db: Db) {
    this.folders = this.db.collection(PREFIX + "folders");
  }

  /**
   * Action: createFolder
   * Effect: Creates a new folder with the given name and owner.
   *
   * Requirements:
   * - `owner` and `name` are provided.
   * - A folder with the given `name` does not already exist for the specified `owner`.
   *
   * Testing guided by principle:
   * - Test creating a folder with valid owner and name.
   * - Test attempting to create a folder with a duplicate name for the same owner.
   * - Test creating a folder with missing owner or name.
   */
  async createFolder({
    owner,
    name,
    parent,
  }: {
    owner: User;
    name: string;
    parent: Folder | null;
  }): Promise<{ folder: Folder } | { error: string }> {
    if (!owner || !name) {
      return { error: "Owner and folder name are required." };
    }

    console.log("CREAITN FOLDER");
    const existingFolder = await this.folders.findOne({ owner, name });
    if (existingFolder) {
      return {
        error:
          `A folder with the name "${name}" already exists for this owner.`,
      };
    }

    const newFolderDoc: Folders = {
      _id: freshID(),
      parent: parent || null, // Default to root
      name: name,
      owner: owner,
      groups: [],
    };

    await this.folders.insertOne(newFolderDoc);
    return { folder: newFolderDoc._id };
  }

  /**
   * Action: moveFolder
   * Requires both folders to exist and belong to the user.
   * Effect: Changes parent of folder to new parent
   */

  async moveFolder({
    user,
    folderToMove,
    newParent,
  }: {
    user: User;
    folderToMove: Folder;
    newParent: Folder | null;
  }): Promise<{ folder: Folder } | { error: string }> {
    if (!user || !folderToMove) {
      return { error: "Owner and folder are required." };
    }
    const existingFolder = await this.folders.findOne({
      owner: user,
      _id: folderToMove,
    });
    if (!existingFolder) {
      return {
        error:
          `Current Folder not found: A folder with the id "${folderToMove}" doesn't exist for this user.`,
      };
    }
    let existingParent = null;
    if (newParent) {
      existingParent = await this.folders.findOne({
        owner: user,
        _id: newParent,
      });
    }
    if (!existingParent) {
      await this.folders.updateOne({ _id: existingFolder._id }, {
        $set: { parent: null },
      });
    } else {
      await this.folders.updateOne({ _id: existingFolder._id }, {
        $set: { parent: existingParent._id },
      });
    }

    return { folder: existingFolder._id };
  }

  /**
   * Action: addGroupToFolder
   * Effect: Adds a group to the specified folder.
   *
   * Requirements:
   * - `user`, `folderName`, and `group` are provided.
   * - A folder with `folderName` exists for the `user`.
   * - The `group` is a valid group. (Note: This implementation assumes group validity is handled elsewhere, as the concept state doesn't track group memberships directly.)
   * - The `user` is a member of the `group`. (Note: This check is assumed to be handled by other concepts or business logic, as group membership isn't directly managed within this Folder concept's state.)
   *
   * Testing guided by principle:
   * - Test adding a group to an existing folder for the correct user.
   * - Test attempting to add a group to a non-existent folder.
   * - Test attempting to add a group to a folder owned by a different user.
   * - Test adding a group that is already in the folder (should have no effect).
   * - Test adding with missing user, folderName, or group.
   */
  async addGroupToFolder({
    user,
    folderName,
    group,
  }: {
    user: User;
    folderName: string | null;
    group: Group;
  }): Promise<Empty | { error: string }> {
    if (!user || !folderName || !group) {
      return { error: "User, folder name, and group are required." };
    }

    const folder = await this.folders.findOne({
      owner: user,
      name: folderName,
    });
    if (!folder) {
      return { error: `Folder "${folderName}" not found for user ${user}.` };
    }

    // Note: The original prompt mentions "user is in the group" as a requirement,
    // but the concept state doesn't directly track group membership for users.
    // Assuming this check is handled by other concepts or business logic.
    if (!folder.groups.includes(group)) {
      await this.folders.updateOne(
        { _id: folder._id },
        { $addToSet: { groups: group } },
      );
    }
    return {};
  }

  /**
   * Action: removeGroupFromFolder
   * Effect: Removes a group from the specified folder.
   *
   * Requirements:
   * - `user`, `folder`, and `group` are provided.
   * - The specified `folder` exists and belongs to the `user`.
   * - The `group` is currently present within the `folder`.
   * - The `user` is a member of the `group`. (Note: This check is assumed to be handled by other concepts or business logic.)
   *
   * Testing guided by principle:
   * - Test removing a group from a folder that contains it, for the correct user.
   * - Test attempting to remove a group that is not in the folder.
   * - Test attempting to remove a group from a folder that does not belong to the user.
   * - Test attempting to remove from a non-existent folder.
   * - Test removing with missing user, folder, or group.
   */
  async removeGroupFromFolder({
    user,
    folder,
    group,
  }: {
    user: User;
    folder: Folder;
    group: Group;
  }): Promise<Empty | { error: string }> {
    if (!user || !group) {
      return { error: "User, folder, and group are required." };
    }

    const folderDoc = await this.folders.findOne({ _id: folder });
    if (!folderDoc) {
      return { error: `Folder "${folder}" not found for user ${user}.` };
    }

    if (!folderDoc.groups.includes(group)) {
      return { error: `Group "${group}" is not in folder "${folder}".` };
    }
    await this.folders.updateOne(
      { _id: folder },
      { $pull: { groups: group } },
    );

    return {};
  }

  /**
   * Action: deleteFolder
   * Effect: Deletes the folder and moves all its contained groups to the home page (root).
   *
   * Requirements:
   * - `user` and `folder` are provided.
   * - The specified `folder` exists and belongs to the `user`.
   *
   * Testing guided by principle:
   * - Test deleting a folder that contains groups, verifying groups are moved to a root folder.
   * - Test deleting a folder that is empty.
   * - Test attempting to delete a folder that does not exist.
   * - Test attempting to delete a folder owned by another user.
   * - Test deleting with missing user or folder.
   * - Consider edge case: what happens if a user has no root folder to move groups to? (Current implementation logs a warning.)
   */
  async deleteFolder({
    user,
    folder,
  }: {
    user: User;
    folder: Folder;
  }): Promise<Empty | { error: string }> {
    if (!user || !folder) {
      return { error: "User and folder are required." };
    }

    // Find the folder to delete
    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });
    if (!folderDoc) {
      return { error: `Folder "${folder}" not found for user ${user}.` };
    }

    const parentFolderId = folderDoc.parent || null; // null if this is a root folder
    const groupsToMove = folderDoc.groups;

    // Find all child folders of this folder
    const childFolders = await this.folders.find({ parent: folder }).toArray();

    // Delete the folder
    await this.folders.deleteOne({ _id: folder });

    // Move groups to parent folder
    if (parentFolderId) {
      await this.folders.updateOne(
        { _id: parentFolderId },
        { $addToSet: { groups: { $each: groupsToMove } } },
      );

      // Move child folders to parent folder
      for (const child of childFolders) {
        await this.folders.updateOne(
          { _id: child._id },
          { $set: { parent: parentFolderId } },
        );
      }
    } else {
      // If folder has no parent (root), move groups/folders to a default root
      const rootFolderForUser = await this.folders.findOne({
        owner: user,
        name: ".root",
      });

      if (rootFolderForUser) {
        await this.folders.updateOne(
          { _id: rootFolderForUser._id },
          {
            $addToSet: { groups: { $each: groupsToMove } },
          },
        );

        for (const child of childFolders) {
          await this.folders.updateOne(
            { _id: child._id },
            { $set: { parent: rootFolderForUser._id } },
          );
        }
      } else {
        console.warn(
          `No root folder found for user ${user}. Groups and subfolders from deleted folder ${folder} may be orphaned.`,
        );
      }
    }

    return {};
  }

  /**
   * Action: renameFolder
   * Effect: Changes the name of a folder.
   *
   * Requirements:
   * - `user`, `folder`, and `name` are provided.
   * - The specified `folder` exists and the `user` is its owner.
   * - The new `name` is not already in use by another folder owned by the same `user`.
   *
   * Testing guided by principle:
   * - Test renaming a folder to a new, unique name.
   * - Test attempting to rename a folder to a name that already exists for the owner.
   * - Test attempting to rename a folder that does not exist.
   * - Test attempting to rename a folder owned by another user.
   * - Test renaming with missing user, folder, or name.
   */
  async renameFolder({
    user,
    folder,
    name,
  }: {
    user: User;
    folder: Folder;
    name: string;
  }): Promise<{ success: true } | { error: string }> {
    if (!user || !folder || !name) {
      return { error: "User, folder, and new name are required." };
    }

    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });
    if (!folderDoc) {
      return { error: `Folder "${folder}" not found.` };
    }

    // Check if a folder with the new name already exists for this owner
    const existingFolder = await this.folders.findOne({
      owner: user,
      name: name,
    });
    if (existingFolder && existingFolder._id !== folder) {
      return {
        error: `A folder with the name "${name}" already exists.`,
      };
    }

    await this.folders.updateOne({ _id: folder }, { $set: { name: name } });
    return { success: true };
  }

  /**
   * Action: listFolders
   * Effect: Retrieves all folders owned by a specific user.
   *
   * Requirements:
   * - `user` is provided.
   * - Returns a list of all folders belonging to the user.
   *
   * Testing guided by principle:
   * - Test listing folders for a user with multiple folders.
   * - Test listing folders for a user with no folders (should return an empty array, not an error).
   * - Test attempting to list folders without a user (should return an error).
   */
  async _listFolders({
    user,
  }: {
    user: User;
  }): Promise<Folders[] | { error: string }> {
    if (!user) {
      return { error: "User is required to list folders." };
    }

    const cursor = this.folders.find({ owner: user });
    const folders = await cursor.toArray();
    return folders;
  }

  /**
   * Query: _getFolderById
   * Effect: Returns a single folder given its ID and user.
   *
   * Requirements:
   * - `user` and `folder` are provided.
   * - Folder must belong to user.
   */
  async _getFolderById({
    user,
    folder,
  }: {
    user: User;
    folder: Folder;
  }): Promise<Folders | { error: string }> {
    if (!user || !folder) {
      return { error: "User and folder are required." };
    }

    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });
    if (!folderDoc) {
      return { error: `Folder "${folder}" not found for user ${user}.` };
    }
    return folderDoc;
  }

  /**
   * Query: _listSubfolders
   * Effect: Returns all folders that have the given folder as parent.
   */
  async listSubfolders({
    user,
    parent,
  }: {
    user: User;
    parent: Folder;
  }): Promise<Folders[] | { error: string }> {
    if (!user || !parent) {
      return { error: "User and parent folder are required." };
    }

    const children = await this.folders.find({ owner: user, parent }).toArray();
    return children;
  }

  /**
   * Query: _listGroupsInFolder
   * Effect: Returns the group IDs inside a folder.
   */
  async _listGroupsInFolder({
    user,
    folder,
  }: {
    user: User;
    folder: Folder;
  }): Promise<Group[] | { error: string }> {
    if (!user) {
      return { error: "User is required." };
    }

    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });
    if (!folderDoc) {
      return { error: `Folder "${folder}" not found for user ${user}.` };
    }

    return folderDoc.groups;
  }

  async _getFolderByGroupAndUser({
    user,
    group,
  }: {
    user: User;
    group: Group;
  }): Promise<Folders | { error: string }> {
    if (!user || !group) {
      return { error: "User and group are required." };
    }

    const folderDoc = await this.folders.findOne({
      groups: group,
      owner: user,
    });
    if (!folderDoc) {
      return { error: `Folder not found for user ${user} in group ${group}.` };
    }

    return folderDoc;
  }

  async _listGroupsInFolderByName({
    user,
    name,
  }: {
    user: User;
    name: string;
  }): Promise<Group[] | { error: string }> {
    if (!user) {
      return { error: "User is required." };
    }

    const folderDoc = await this.folders.findOne({ name: name, owner: user });
    if (!folderDoc) {
      return { error: `Folder "${name}" not found for user ${user}.` };
    }

    return folderDoc.groups;
  }

  async _getRootId({
    user,
  }: {
    user: User;
  }): Promise<Folders[]> {
    const roots = await this.folders.find({
      owner: user,
      parent: ".parent_root" as Folder,
    })
      .toArray();
    return roots;
  }

  async getRootFolder({
    user,
  }: {
    user: User;
  }): Promise<{ folders: Folders[] }> {
    const roots = await this.folders.find({
      owner: user,
      parent: null,
    })
      .toArray();
    return { folders: roots };
  }

  async _getRootFolder({
    user,
  }: {
    user: User;
  }): Promise<Folders[]> {
    const roots = await this.folders.find({
      owner: user,
      parent: null,
    })
      .toArray();
    return roots;
  }
}
