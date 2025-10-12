---
timestamp: 'Sun Oct 12 2025 12:19:58 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251012_121958.715ccfd8.md]]'
content_id: f23a781853aec8e7a2b5d01fd260f81d38ce36459f59adbf97b503e5531a691b
---

# file: src/Folder/FolderConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

const PREFIX = "Folder" + ".";

// Generic types of this concept
type User = ID;
type Folder = ID;
type Group = ID;

/**
 * a set of Folders with
 *     a parent Folder
 *     a name String
 *     an owner User
 *     a set of Groups
 */
interface Folders {
  _id: Folder;
  parent: Folder | null; // Use null for top-level folders
  name: string;
  owner: User;
  groups: Group[];
}

export default class FolderConcept {
  folders: Collection<Folders>;

  constructor(private readonly db: Db) {
    this.folders = this.db.collection(PREFIX + "folders");
  }

  /**
   * Creates a new folder with the given name and owner.
   * @param owner The user who owns the folder.
   * @param name The name of the folder.
   * @returns The ID of the newly created folder.
   */
  async createFolder({
    owner,
    name,
  }: {
    owner: User;
    name: string;
  }): Promise<{ folder: Folder }> {
    // Check if a folder with the same name and owner already exists
    const existingFolder = await this.folders.findOne({ owner, name });
    if (existingFolder) {
      // Although the prompt states to return {error: "message"},
      // the example implementation uses explicit error throwing for exceptional cases.
      // We'll stick to returning an error object as per prompt instructions.
      return { error: "Folder with this name already exists for this owner." } as any;
    }

    const newFolderId = freshID();
    const newFolder: Folders = {
      _id: newFolderId,
      parent: null, // Top-level folder
      name: name,
      owner: owner,
      groups: [],
    };
    await this.folders.insertOne(newFolder);
    return { folder: newFolderId };
  }

  /**
   * Adds a group to a specified folder.
   * @param user The user performing the action (must be the owner of the folder).
   * @param folderName The name of the folder to add the group to.
   * @param group The ID of the group to add.
   * @returns An empty object on success.
   */
  async addToFolder({
    user,
    folderName,
    group,
  }: {
    user: User;
    folderName: string;
    group: Group;
  }): Promise<Empty> {
    const folder = await this.folders.findOne({ owner: user, name: folderName });

    if (!folder) {
      return { error: "Folder not found or not owned by the user." } as any;
    }

    if (folder.groups.includes(group)) {
      return { error: "Group already in the folder." } as any;
    }

    // Add the group to the folder's groups
    await this.folders.updateOne(
      { _id: folder._id },
      { $addToSet: { groups: group } } // $addToSet ensures no duplicates
    );

    return {};
  }

  /**
   * Removes a group from a specified folder.
   * @param user The user performing the action (must be the owner of the folder).
   * @param folder The ID of the folder to remove the group from.
   * @param group The ID of the group to remove.
   * @returns An empty object on success.
   */
  async removeFromFolder({
    user,
    folder,
    group,
  }: {
    user: User;
    folder: Folder;
    group: Group;
  }): Promise<Empty> {
    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });

    if (!folderDoc) {
      return { error: "Folder not found or not owned by the user." } as any;
    }

    if (!folderDoc.groups.includes(group)) {
      return { error: "Group not found in the folder." } as any;
    }

    // Remove the group from the folder's groups
    await this.folders.updateOne({ _id: folder }, { $pull: { groups: group } });

    return {};
  }

  /**
   * Deletes a folder and moves all its groups to the "home page" (no longer inside any folder).
   * This implies a concept of a "home page" which is likely a special top-level folder or no folder association.
   * For simplicity, we'll assume groups are "un-folderized" by removing their association.
   * A more complete implementation might involve a specific "home folder" concept.
   * @param user The user who owns the folder.
   * @param folder The ID of the folder to delete.
   * @returns An empty object on success.
   */
  async deleteFolder({ user, folder }: { user: User; folder: Folder }): Promise<Empty> {
    const folderToDelete = await this.folders.findOne({ _id: folder, owner: user });

    if (!folderToDelete) {
      return { error: "Folder not found or not owned by the user." } as any;
    }

    // Move groups to "home page" (effectively un-folderize them)
    // This step is conceptual. In a real system, you might need to update
    // other concepts that track group associations if they exist.
    // For this concept, we just remove the folder and its group associations.

    // Delete the folder itself
    await this.folders.deleteOne({ _id: folder });

    // Note: If there were nested folders, a recursive deletion would be needed.
    // This implementation only handles direct deletion of a folder.

    return {};
  }

  /**
   * Renames a folder.
   * @param user The user who owns the folder.
   * @param folder The ID of the folder to rename.
   * @param name The new name for the folder.
   * @returns An empty object on success.
   */
  async renameFolder({
    user,
    folder,
    name,
  }: {
    user: User;
    folder: Folder;
    name: string;
  }): Promise<Empty> {
    const folderDoc = await this.folders.findOne({ _id: folder, owner: user });

    if (!folderDoc) {
      return { error: "Folder not found or not owned by the user." } as any;
    }

    // Check if a folder with the new name already exists for this owner
    const existingFolderWithNewName = await this.folders.findOne({ owner: user, name });
    if (existingFolderWithNewName && existingFolderWithNewName._id !== folder) {
      return { error: "Another folder with this name already exists for this owner." } as any;
    }

    await this.folders.updateOne({ _id: folder }, { $set: { name: name } });

    return {};
  }

  // Example query to find a folder by its ID and owner
  async _getFolderByIdAndOwner({ folderId, owner }: { folderId: Folder; owner: User }): Promise<Partial<Folders> | null> {
    const folder = await this.folders.findOne({ _id: folderId, owner: owner });
    // Return only relevant parts, as specified for queries
    if (folder) {
      return {
        _id: folder._id,
        name: folder.name,
        parent: folder.parent,
        groups: folder.groups,
        owner: folder.owner, // Include owner for context if needed by caller
      };
    }
    return null;
  }

  // Example query to find all folders for a user
  async _getFoldersByUser({ owner }: { owner: User }): Promise<Partial<Folders>[]> {
    const folders = await this.folders.find({ owner }).toArray();
    return folders.map(f => ({
      _id: f._id,
      name: f.name,
      parent: f.parent,
      groups: f.groups,
    }));
  }

  // Example query to find groups within a specific folder
  async _getGroupsInFolder({ folderId, owner }: { folderId: Folder; owner: User }): Promise<Group[]> {
    const folder = await this.folders.findOne({ _id: folderId, owner: owner });
    if (folder) {
      return folder.groups;
    }
    return [];
  }

  // Example query to find a folder by its name for a specific owner
  async _getFolderByNameAndOwner({ folderName, owner }: { folderName: string; owner: User }): Promise<Partial<Folders> | null> {
    const folder = await this.folders.findOne({ name: folderName, owner: owner });
    if (folder) {
      return {
        _id: folder._id,
        name: folder.name,
        parent: folder.parent,
        groups: folder.groups,
        owner: folder.owner,
      };
    }
    return null;
  }
}
```
