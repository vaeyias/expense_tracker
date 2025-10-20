---
timestamp: 'Sun Oct 19 2025 21:11:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_211104.b0f444fe.md]]'
content_id: b7370d5405d07e3e2e0ff478a71641bed0e544f3d5e2d006bfc4b83751c99f87
---

# API Specification: Folder Concept

**Purpose:** To allow users to organize groups into custom folder structures.

***

### POST /api/Folder/createFolder

**Description:** Creates a new folder for a user with a given name.

**Requirements:**

* `owner` and `name` are provided.
* A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**

* Creates a new folder document with `parent` set to `null` and an empty list of groups.

**Request Body:**

```json
{
  "owner": "ID",
  "name": "string"
}
```

**Success Response Body (Action):**

```json
{
  "folder": "ID"
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

**Description:** Moves a folder to become a subfolder of another existing folder for the same user.

**Requirements:**

* `user`, `folderToMove`, and `newParent` are provided.
* Both folders exist for the specified user.

**Effects:**

* Updates the `parent` field of the `folderToMove` to the ID of the `newParent` folder.

**Request Body:**

```json
{
  "user": "ID",
  "folderToMove": "string",
  "newParent": "string"
}
```

**Success Response Body (Action):**

```json
{
  "folder": "ID"
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
* A folder with `folderName` exists for the `user`.
* The `group` is a valid group.
* The `user` is a member of the `group`.

**Effects:**

* Adds the `group` ID to the `groups` array of the specified folder, if it's not already present.

**Request Body:**

```json
{
  "user": "ID",
  "folderName": "string",
  "group": "ID"
}
```

**Success Response Body (Action):**

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
* The specified `folder` exists and belongs to the `user`.
* The `group` is currently present within the `folder`.

**Effects:**

* Removes the `group` ID from the `groups` array of the specified folder.

**Request Body:**

```json
{
  "user": "ID",
  "folder": "ID",
  "group": "ID"
}
```

**Success Response Body (Action):**

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

**Description:** Deletes a folder owned by the user. Any groups within the deleted folder are moved to a root folder for the user.

**Requirements:**

* `user` and `folder` are provided.
* The specified `folder` exists and belongs to the `user`.

**Effects:**

* Deletes the folder document.
* Moves all groups from the deleted folder to a root folder for the user. If no root folder exists, a warning is logged.

**Request Body:**

```json
{
  "user": "ID",
  "folder": "ID"
}
```

**Success Response Body (Action):**

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
* The specified `folder` exists and the `user` is its owner.
* The new `name` is not already in use by another folder owned by the same `user`.

**Effects:**

* Updates the `name` field of the specified folder document.

**Request Body:**

```json
{
  "user": "ID",
  "folder": "ID",
  "name": "string"
}
```

**Success Response Body (Action):**

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

**Effects:**

* Returns an array of folder documents belonging to the user.

**Request Body:**

```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "ID",
    "parent": "ID | null",
    "name": "string",
    "owner": "ID",
    "groups": ["ID"]
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

**Effects:**

* Returns the folder document if found and owned by the user.

**Request Body:**

```json
{
  "user": "ID",
  "folder": "ID"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "ID",
    "parent": "ID | null",
    "name": "string",
    "owner": "ID",
    "groups": ["ID"]
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

**Effects:**

* Returns an array of folder documents that have the specified `parent` folder as their parent.

**Request Body:**

```json
{
  "user": "ID",
  "parent": "ID"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "ID",
    "parent": "ID | null",
    "name": "string",
    "owner": "ID",
    "groups": ["ID"]
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

**Effects:**

* Returns an array of group IDs stored in the folder.

**Request Body:**

```json
{
  "user": "ID",
  "folder": "ID"
}
```

**Success Response Body (Query):**

```json
["ID"]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_getRootFolder

**Description:** Retrieves all top-level folders (those with no parent) for a given user.

**Effects:**

* Returns an array of folder documents that are roots for the user.

**Request Body:**

```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "ID",
    "parent": "ID | null",
    "name": "string",
    "owner": "ID",
    "groups": ["ID"]
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
