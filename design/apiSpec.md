# API Specification: Debt Concept

**Purpose:** Represents a personal debt between two users.

---

## API Endpoints

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**
- Both users exist.
- A Debt between them does not already exist.

**Effects:**
- Creates a new personal debt record.

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

**Description:** Updates the balance of an existing personal debt between two users.

**Requirements:**
- A Debt exists between payer and receiver.

**Effects:**
- Updates the balance of the debt.

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

**Description:** Deletes an existing debt between two users.

**Requirements:**
- A Debt exists between userA and userB.

**Effects:**
- Deletes the debt record.

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

**Description:** Gets the net balance between two users.

**Requirements:**
- A Debt exists between the two users.

**Effects:**
- Returns the net balance.

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

### POST /api/Debt/_listDebtsForUser

**Description:** Lists all debts involving a given user with non-zero balance.

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
    "userA": "ID",
    "userB": "ID",
    "balance": "number"
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

### POST /api/Debt/_getNetBalance

**Description:** Computes the net balance of a user across all debts.

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**
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

**Purpose:** Manages expenses and user splits within groups.

---

## API Endpoints

### POST /api/Expense/createExpense

**Description:** Creates a new expense with initial details.

**Requirements:**
- User exists.
- Total cost is non-negative.

**Effects:**
- Creates an Expense document.

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
- Expense exists to be edited.
- Total cost is non-negative.
- Sum of userSplits.amountOwed equals totalCost.

**Effects:**
- Updates the Expense document.

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

**Description:** Deletes an expense.

**Requirements:**
- Expense exists to be deleted.

**Effects:**
- Deletes the expense document.

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
- Expense exists.
- Amount owed is non-negative.
- User does not already have a split in this expense.

**Effects:**
- Adds a UserSplit document.
- Adds the UserSplit ID to the expense's userSplits array.

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

**Description:** Edits an existing user's split in an expense.

**Requirements:**
- UserSplit exists.
- Amount owed is non-negative.
- If user is changed, the new user does not already have a split in the same expense.

**Effects:**
- Updates the UserSplit document.

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
- Expense exists.
- UserSplit exists and is associated with the expense.

**Effects:**
- Removes the UserSplit document.
- Removes the UserSplit ID from the expense's userSplits array.

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

**Description:** Retrieves all expenses belonging to a specific group.

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

### POST /api/Expense/_getSplitForExpense

**Description:** Retrieves a specific user's split for a given expense.

**Request Body:**
```json
{
  "expenseId": "ID",
  "user": "ID"
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

**Description:** Retrieves all expenses where the user is either the payer or a participant.

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

**Purpose:** Manages user groups and their memberships.

---

## API Endpoints

### POST /api/Group/createGroup

**Description:** Creates a new group.

**Requirements:**
- Creator exists.
- Name and description are provided.

**Effects:**
- Creates a new group document.

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
- Group exists.
- Inviter is a member of the group.
- New member is not already in the group.
- User exists.

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
- Group exists.
- Remover is a member of the group.
- Member to remove is in the group.

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

**Description:** Allows a member to leave a group.

**Requirements:**
- Group exists.
- Member is in the group.

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
- Group exists.
- Group has no active members.

**Effects:**
- Deletes the group document.

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

**Description:** Lists all members of a group.

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

**Purpose:** Allows users to organize groups into custom structures.

---

## API Endpoints

### POST /api/Folder/createFolder

**Description:** Creates a new folder with the given name and owner.

**Requirements:**
- `owner` and `name` are provided.
- A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**
- Creates a new folder document.

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
---

### POST /api/Folder/moveFolder

**Description:** Changes the parent of a folder to a new parent.

**Requirements:**
- User, folder, and parent are provided.
- Both folders exist and belong to the user.

**Effects:**
- Updates the parent of the folder to be moved.

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

**Description:** Adds a group to the specified folder.

**Requirements:**
- User, folder name, and group are provided.
- A folder with `folderName` exists for the `user`.
- The `user` is a member of the `group`.

**Effects:**
- Adds the group ID to the folder's `groups` array.

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

**Description:** Removes a group from the specified folder.

**Requirements:**
- User, folder, and group are provided.
- The specified `folder` exists and belongs to the `user`.
- The `group` is currently present within the `folder`.
- The `user` is a member of the `group`.

**Effects:**
- Removes the group ID from the folder's `groups` array.

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

**Description:** Deletes the folder and moves all its contained groups to the root folder.

**Requirements:**
- User and folder are provided.
- The specified folder exists and belongs to the user.

**Effects:**
- Deletes the folder document.
- Moves contained groups to the root folder.

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

**Description:** Changes the name of a folder.

**Requirements:**
- User, folder, and new name are provided.
- The specified folder exists and the user is its owner.
- The new name is not already in use by another folder owned by the same user.

**Effects:**
- Updates the name of the folder.

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
---

### POST /api/Folder/_getFolderById

**Description:** Retrieves a single folder given its ID and user.

**Requirements:**
- User and folder are provided.
- Folder must belong to user.

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
---

### POST /api/Folder/_listSubfolders

**Description:** Retrieves all folders that have the given folder as parent.

**Requirements:**
- User and parent folder are provided.

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
---

### POST /api/Folder/_listGroupsInFolder

**Description:** Retrieves the group IDs inside a folder.

**Requirements:**
- User and folder are provided.

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
---

### POST /api/Folder/_listGroupsInFolderByName

**Description:** Retrieves the group IDs inside a folder identified by name.

**Requirements:**
- User and folder name are provided.

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
---

### POST /api/Folder/_getRootFolder

**Description:** Retrieves all top-level folders (parent = null) for a user.

**Requirements:**
- User is provided.

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
---
# API Specification: Authentication Concept

**Purpose:** Manages user authentication and profile information.

---

## API Endpoints

### POST /api/Authentication/createUser

**Description:** Creates a new user account.

**Requirements:**
- Username, display name, and password are provided.
- Username does not already exist.

**Effects:**
- Creates a new user document.

**Request Body:**
```json
{
  "username": "string",
  "displayName": "string",
  "password": "string"
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

### POST /api/Authentication/editUser

**Description:** Edits an existing user's display name.

**Effects:**
- Updates the user's display name.

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

### POST /api/Authentication/deleteUser

**Description:** Deletes a user account.

**Effects:**
- Deletes the user document.

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

### POST /api/Authentication/authenticate

**Description:** Authenticates a user with a username and password.

**Requirements:**
- A User to exist with the given username.
- The provided password matches the User's password.

**Effects:**
- Grants access if authentication is successful.

**Request Body:**
```json
{
  "username": "string",
  "password": "unknown"
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

### POST /api/Authentication/_getUserById

**Description:** Retrieves user information by user ID.

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
    "username": "string",
    "displayName": "string",
    "password": "string"
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

### POST /api/Authentication/_getUserByUsername

**Description:** Retrieves user information by username.

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
    "displayName": "string",
    "password": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
