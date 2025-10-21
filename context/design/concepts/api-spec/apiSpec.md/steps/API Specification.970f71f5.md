---
timestamp: 'Tue Oct 21 2025 00:59:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251021_005944.33889eeb.md]]'
content_id: 970f71f5b5736ec3f0ae94c9f90c98284eade401c1a528554aa4d99e05e40f15
---

# API Specification: Folder Concept

**Purpose:** Allows users to organize groups into custom structures.

***

## API Endpoints

### POST /api/Folder/createFolder

**Description:** Creates a new folder with the given name and owner.

**Requirements:**

* `owner` and `name` are provided.
* A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**

* Creates a new folder document.

**Request Body:**

```json
{
  "owner": "ID",
  "name": "string",
  "parent": "ID"
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

**Description:** Changes the parent of a folder to a new parent.

**Requirements:**

* User, folder, and parent are provided.
* Both folders exist and belong to the user.

**Effects:**

* Updates the parent of the folder to be moved.

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

**Description:** Adds a group to the specified folder.

**Requirements:**

* User, folder name, and group are provided.
* A folder with `folderName` exists for the `user`.
* The `user` is a member of the `group`.

**Effects:**

* Adds the group ID to the folder's `groups` array.

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

**Description:** Removes a group from the specified folder.

**Requirements:**

* User, folder, and group are provided.
* The specified `folder` exists and belongs to the `user`.
* The `group` is currently present within the `folder`.
* The `user` is a member of the `group`.

**Effects:**

* Removes the group ID from the folder's `groups` array.

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

**Description:** Deletes the folder and moves all its contained groups to the root folder.

**Requirements:**

* User and folder are provided.
* The specified folder exists and belongs to the user.

**Effects:**

* Deletes the folder document.
* Moves contained groups to the root folder.

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

**Description:** Changes the name of a folder.

**Requirements:**

* User, folder, and new name are provided.
* The specified folder exists and the user is its owner.
* The new name is not already in use by another folder owned by the same user.

**Effects:**

* Updates the name of the folder.

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
    "parent": "ID",
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

**Description:** Retrieves a single folder given its ID and user.

**Requirements:**

* User and folder are provided.
* Folder must belong to user.

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
    "parent": "ID",
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

**Description:** Retrieves all folders that have the given folder as parent.

**Requirements:**

* User and parent folder are provided.

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
    "parent": "ID",
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

**Description:** Retrieves the group IDs inside a folder.

**Requirements:**

* User and folder are provided.

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
  "ID"
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_listGroupsInFolderByName

**Description:** Retrieves the group IDs inside a folder identified by name.

**Requirements:**

* User and folder name are provided.

**Request Body:**

```json
{
  "user": "ID",
  "name": "string"
}
```

**Success Response Body (Query):**

```json
[
  "ID"
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Folder/\_getRootFolder

**Description:** Retrieves all top-level folders (parent = null) for a user.

**Requirements:**

* User is provided.

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
    "parent": "ID",
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
