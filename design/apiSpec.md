# API Specifications

# API Specification: Debt Concept

**Purpose:** To manage personal debts between users, allowing for creation, updating, deletion, and querying of debt relationships.

---

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**
- Both users exist.
- A debt between these users does not already exist.

**Effects:**
- Creates a new debt record with a balance of 0.

**Request Body:**
```json
{
  "userA": "ID",
  "userB": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "debt": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Debt/updateDebt

**Description:** Updates the balance of an existing personal debt between two users based on a payment.

**Requirements:**
- A debt exists between the payer and receiver.

**Effects:**
- Adjusts the balance of the debt record to reflect the payment.

**Request Body:**
```json
{
  "payer": "ID",
  "receiver": "ID",
  "amount": "number"
}
```

**Success Response Body (Action):**
```json
{
  "balance": "number"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Debt/deleteDebt

**Description:** Deletes an existing debt record between two users.

**Requirements:**
- A debt exists between the two users.

**Effects:**
- Removes the debt record from the database.

**Request Body:**
```json
{
  "userA": "ID",
  "userB": "ID"
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
---

### POST /api/Debt/getDebt

**Description:** Retrieves the net balance between two specific users.

**Requirements:**
- A debt record exists between the two users.

**Effects:**
- Returns the current balance between the two users.

**Request Body:**
```json
{
  "userA": "ID",
  "userB": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "balance": "number"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: Expense Concept

**Purpose:** To manage expenses within groups, including tracking who paid, individual shares, and overall expense details.

---

### POST /api/Expense/createExpense

**Description:** Initiates the creation of a new expense record for a group, setting initial default values.

**Requirements:**
- The user exists.
- The group exists.
- The total cost is non-negative.

**Effects:**
- Creates an Expense document with default values (empty title, description, category, zero total cost, current date, provided group and payer).
- Creates an empty list of user splits.

**Request Body:**
```json
{
  "user": "ID",
  "group": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "expense": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/editExpense

**Description:** Updates the details of an existing expense.

**Requirements:**
- The expense to edit exists.
- The total cost is non-negative.
- The sum of user splits' amounts owed equals the total cost.

**Effects:**
- Updates the specified fields of the expense document.

**Request Body:**
```json
{
  "expenseToEdit": "ID",
  "title": "string",
  "description": "string",
  "category": "string",
  "totalCost": "number",
  "date": "Date",
  "payer": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "newExpense": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/deleteExpense

**Description:** Deletes an expense and all its associated user splits.

**Requirements:**
- The expense to delete exists.

**Effects:**
- Removes the expense document and related user split documents.

**Request Body:**
```json
{
  "expenseToDelete": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "deletedExpense": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/addUserSplit

**Description:** Adds a user's share to an expense.

**Requirements:**
- The expense exists.
- The amount owed is non-negative.
- The user does not already have a user split in this expense.

**Effects:**
- Creates a UserSplit document.
- Adds the UserSplit's ID to the expense's `userSplits` array.

**Request Body:**
```json
{
  "expense": "ID",
  "user": "ID",
  "amountOwed": "number"
}
```

**Success Response Body (Action):**
```json
{
  "userSplit": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/editUserSplit

**Description:** Edits an existing user's split within an expense.

**Requirements:**
- The user split exists.
- If a new user is specified, that user does not already have a split in the same expense.
- The amount owed is non-negative.

**Effects:**
- Updates the user or amount owed for the specified user split.

**Request Body:**
```json
{
  "userSplit": "ID",
  "user": "ID",
  "amountOwed": "number"
}
```

**Success Response Body (Action):**
```json
{
  "userSplit": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/removeUserSplit

**Description:** Removes a user's split from an expense.

**Requirements:**
- The expense exists.
- The user split exists within the specified expense.

**Effects:**
- Removes the UserSplit document.
- Removes the UserSplit's ID from the expense's `userSplits` array.

**Request Body:**
```json
{
  "expense": "ID",
  "userSplit": "ID"
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
---

### POST /api/Expense/_getExpensesByGroup

**Description:** Retrieves all expenses associated with a specific group.

**Effects:**
- Returns an array of expense documents belonging to the specified group.

**Request Body:**
```json
{
  "group": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "Date",
    "group": "ID",
    "payer": "ID",
    "userSplits": ["ID"]
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/_getExpenseById

**Description:** Retrieves a specific expense by its ID.

**Effects:**
- Returns the expense document if found.

**Request Body:**
```json
{
  "expenseId": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "Date",
    "group": "ID",
    "payer": "ID",
    "userSplits": ["ID"]
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/_getUserSplitById

**Description:** Retrieves a specific user split by its ID.

**Effects:**
- Returns the user split document if found.

**Request Body:**
```json
{
  "userSplit": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "user": "ID",
    "amountOwed": "number",
    "expense": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/_getSplitsByExpense

**Description:** Retrieves all user splits associated with a given expense.

**Effects:**
- Returns an array of user split documents for the specified expense.

**Request Body:**
```json
{
  "expenseId": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "user": "ID",
    "amountOwed": "number",
    "expense": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Expense/_getExpensesByUser

**Description:** Retrieves all expenses where the user is either the payer or a participant in a user split.

**Effects:**
- Returns an array of all expense documents involving the specified user.

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
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "Date",
    "group": "ID",
    "payer": "ID",
    "userSplits": ["ID"]
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: Group Concept

**Purpose:** To manage user groups, allowing users to create, join, leave, and be removed from groups.

---

### POST /api/Group/createGroup

**Description:** Creates a new group with a specified creator, name, and description.

**Requirements:**
- The creator user exists.
- The name and description are provided.

**Effects:**
- Creates a new group record.
- Adds the creator as the first member of the group.

**Request Body:**
```json
{
  "creator": "ID",
  "name": "string",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "group": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Group/addUser

**Description:** Adds a new member to an existing group.

**Requirements:**
- The group exists.
- The inviter is a member of the group.
- The new member is not already in the group.
- The new member user exists.

**Effects:**
- Adds the new member to the group's member list.

**Request Body:**
```json
{
  "group": "ID",
  "inviter": "ID",
  "newMember": "ID"
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
---

### POST /api/Group/removeUser

**Description:** Removes a member from a group.

**Requirements:**
- The group exists.
- The remover is a member of the group.
- The member to remove is currently in the group.

**Effects:**
- Removes the specified member from the group's member list.

**Request Body:**
```json
{
  "group": "ID",
  "remover": "ID",
  "member": "ID"
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
---

### POST /api/Group/leaveGroup

**Description:** Allows a member to leave a group they are currently in.

**Requirements:**
- The group exists.
- The member is currently in the group.

**Effects:**
- Removes the member from the group's member list.

**Request Body:**
```json
{
  "group": "ID",
  "member": "ID"
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
---

### POST /api/Group/deleteGroup

**Description:** Deletes a group.

**Requirements:**
- The group exists.
- The group has no active members.

**Effects:**
- Removes the group record from the database.

**Request Body:**
```json
{
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
---

### POST /api/Group/_listMembers

**Description:** Lists all members of a specific group.

**Effects:**
- Returns an array of user IDs representing the members of the group.

**Request Body:**
```json
{
  "group": "ID"
}
```

**Success Response Body (Query):**
```json
{
  "members": ["ID"]
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

# API Specification: Folder Concept

**Purpose:** To allow users to organize groups into custom folder structures.

---

### POST /api/Folder/createFolder

**Description:** Creates a new folder for a user with a given name.

**Requirements:**
- `owner` and `name` are provided.
- A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**
- Creates a new folder document with `parent` set to `null` and an empty list of groups.

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
---

### POST /api/Folder/moveFolder

**Description:** Moves a folder to become a subfolder of another existing folder for the same user.

**Requirements:**
- `user`, `folderToMove`, and `newParent` are provided.
- Both folders exist for the specified user.

**Effects:**
- Updates the `parent` field of the `folderToMove` to the ID of the `newParent` folder.

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
---

### POST /api/Folder/addGroupToFolder

**Description:** Adds a group to a specified folder owned by the user.

**Requirements:**
- `user`, `folderName`, and `group` are provided.
- A folder with `folderName` exists for the `user`.
- The `group` is a valid group.
- The `user` is a member of the `group`.

**Effects:**
- Adds the `group` ID to the `groups` array of the specified folder, if it's not already present.

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
---

### POST /api/Folder/removeGroupFromFolder

**Description:** Removes a group from a specified folder owned by the user.

**Requirements:**
- `user`, `folder`, and `group` are provided.
- The specified `folder` exists and belongs to the `user`.
- The `group` is currently present within the `folder`.

**Effects:**
- Removes the `group` ID from the `groups` array of the specified folder.

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
---

### POST /api/Folder/deleteFolder

**Description:** Deletes a folder owned by the user. Any groups within the deleted folder are moved to a root folder for the user.

**Requirements:**
- `user` and `folder` are provided.
- The specified `folder` exists and belongs to the `user`.

**Effects:**
- Deletes the folder document.
- Moves all groups from the deleted folder to a root folder for the user. If no root folder exists, a warning is logged.

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
---

### POST /api/Folder/renameFolder

**Description:** Renames a folder owned by the user.

**Requirements:**
- `user`, `folder`, and `name` are provided.
- The specified `folder` exists and the `user` is its owner.
- The new `name` is not already in use by another folder owned by the same `user`.

**Effects:**
- Updates the `name` field of the specified folder document.

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
---

### POST /api/Folder/_listFolders

**Description:** Retrieves all folders owned by a specific user.

**Effects:**
- Returns an array of folder documents belonging to the user.

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
---

### POST /api/Folder/_getFolderById

**Description:** Retrieves a specific folder by its ID, ensuring it belongs to the specified user.

**Effects:**
- Returns the folder document if found and owned by the user.

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
---

### POST /api/Folder/_listSubfolders

**Description:** Retrieves all direct subfolders of a given parent folder for a specific user.

**Effects:**
- Returns an array of folder documents that have the specified `parent` folder as their parent.

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
---

### POST /api/Folder/_listGroupsInFolder

**Description:** Retrieves the IDs of all groups contained within a specific folder owned by the user.

**Effects:**
- Returns an array of group IDs stored in the folder.

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
---

### POST /api/Folder/_getRootFolder

**Description:** Retrieves all top-level folders (those with no parent) for a given user.

**Effects:**
- Returns an array of folder documents that are roots for the user.

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
---

# API Specification: User Concept

**Purpose:** To manage user accounts, including creation, editing, deletion, and retrieval of user information.

---

### POST /api/User/createUser

**Description:** Creates a new user account with a username and display name.

**Requirements:**
- The username must be unique.
- Username and display name are provided.

**Effects:**
- Creates a new user document in the `users` collection.

**Request Body:**
```json
{
  "username": "string",
  "displayName": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/User/editUser

**Description:** Edits the display name of an existing user.

**Requirements:**
- The user ID is provided.
- The new display name is provided.

**Effects:**
- Updates the `displayName` of the specified user.

**Request Body:**
```json
{
  "user": "ID",
  "newDisplayName": "string"
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
---

### POST /api/User/deleteUser

**Description:** Deletes a user account.

**Requirements:**
- The user ID is provided.

**Effects:**
- Removes the user document from the `users` collection.

**Request Body:**
```json
{
  "user": "ID"
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
---

### POST /api/User/_getUserById

**Description:** Retrieves the information for a specific user by their ID.

**Effects:**
- Returns the user document if found.

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**
```json
{
  "userInfo": {
    "_id": "ID",
    "username": "string",
    "displayName": "string"
  }
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/User/_getUserByUsername

**Description:** Retrieves user information by their username.

**Effects:**
- Returns the user document if found.

**Request Body:**
```json
{
  "username": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "username": "string",
    "displayName": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
