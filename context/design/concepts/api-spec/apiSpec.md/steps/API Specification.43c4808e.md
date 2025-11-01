---
timestamp: 'Fri Oct 31 2025 20:27:33 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251031_202733.f913d6b8.md]]'
content_id: 43c4808ec2a1ff0fdc7511e4a4a953d186fc2af8e8c9380c2189e7b3cb208cab
---

# API Specification: Folder Concept

**Purpose:** Allows users to organize groups into custom folder structures.

***

## API Endpoints

### POST /api/Folder/createFolder

**Description:** Creates a new folder for a user with a given name and an optional parent folder.

**Requirements:**

* `owner` and `name` are provided.
* A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**

* A new folder is created.

**Request Body:**

```json
{
  "owner": "string",
  "name": "string",
  "parent": "string"
}
```

**Success Response Body:**

```json
{
  "folder": "string"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/moveFolder

**Description:** Moves a folder to become a subfolder of another specified folder for the same user.

**Requirements:**

* `user`, `folderToMove`, and `newParent` are provided.
* Both the folder to move and the new parent folder must exist for the user.

**Effects:**

* The parent of `folderToMove` is updated to `newParent`.

**Request Body:**

```json
{
  "user": "string",
  "folderToMove": "string",
  "newParent": "string"
}
```

**Success Response Body:**

```json
{
  "folder": "string"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/addGroupToFolder

**Description:** Adds a group to a specified folder owned by the user.

**Requirements:**

* `user`, `folderName`, and `group` are provided.
* A folder with `folderName` must exist for the `user`.
* The `group` is a valid group.
* The `user` is a member of the `group`.

**Effects:**

* The specified group is added to the folder's list of contained groups.

**Request Body:**

```json
{
  "user": "string",
  "folderName": "string",
  "group": "string"
}
```

**Success Response Body:**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/removeGroupFromFolder

**Description:** Removes a group from a specified folder owned by the user.

**Requirements:**

* `user`, `folder`, and `group` are provided.
* The specified `folder` must exist and belong to the `user`.
* The `group` must be currently present within the `folder`.

**Effects:**

* The specified group is removed from the folder's list of contained groups.

**Request Body:**

```json
{
  "user": "string",
  "folder": "string",
  "group": "string"
}
```

**Success Response Body:**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/deleteFolder

**Description:** Deletes a folder owned by the user and moves its contained groups to a root folder.

**Requirements:**

* `user` and `folder` are provided.
* The specified `folder` must exist and belong to the `user`.

**Effects:**

* The specified folder is deleted.
* Any groups within the deleted folder are moved to a root folder for the user.

**Request Body:**

```json
{
  "user": "string",
  "folder": "string"
}
```

**Success Response Body:**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/renameFolder

**Description:** Renames a folder owned by the user.

**Requirements:**

* `user`, `folder`, and `name` are provided.
* The specified `folder` must exist and the `user` must be its owner.
* The new `name` must not be already in use by another folder owned by the same `user`.

**Effects:**

* The name of the specified folder is updated.

**Request Body:**

```json
{
  "user": "string",
  "folder": "string",
  "name": "string"
}
```

**Success Response Body:**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_listFolders

**Description:** Retrieves all folders owned by a specific user.

**Request Body:**

```json
{
  "user": "string"
}
```

**Success Response Body:**

```json
[
  {
    "_id": "string",
    "parent": "string",
    "name": "string",
    "owner": "string",
    "groups": "string[]"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_getFolderById

**Description:** Retrieves a specific folder by its ID, ensuring it belongs to the specified user.

**Request Body:**

```json
{
  "user": "string",
  "folder": "string"
}
```

**Success Response Body:**

```json
[
  {
    "_id": "string",
    "parent": "string",
    "name": "string",
    "owner": "string",
    "groups": "string[]"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_listSubfolders

**Description:** Retrieves all direct subfolders of a given parent folder for a specific user.

**Request Body:**

```json
{
  "user": "string",
  "parent": "string"
}
```

**Success Response Body:**

```json
[
  {
    "_id": "string",
    "parent": "string",
    "name": "string",
    "owner": "string",
    "groups": "string[]"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_listGroupsInFolder

**Description:** Retrieves the IDs of all groups contained within a specific folder owned by the user.

**Request Body:**

```json
{
  "user": "string",
  "folder": "string"
}
```

**Success Response Body:**

```json
"string[]"
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_listGroupsInFolderByName

**Description:** Retrieves the IDs of all groups contained within a folder identified by its name, for a specific user.

**Request Body:**

```json
{
  "user": "string",
  "name": "string"
}
```

**Success Response Body:**

```json
"string[]"
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_getRootFolder

**Description:** Retrieves all top-level folders (folders with no parent) for a specific user.

**Request Body:**

```json
{
  "user": "string"
}
```

**Success Response Body:**

```json
[
  {
    "_id": "string",
    "parent": "string",
    "name": "string",
    "owner": "string",
    "groups": "string[]"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
