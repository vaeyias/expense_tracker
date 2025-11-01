# API Specification: Debt Concept

**Purpose:** Manages personal debts between users, allowing for creation, updates, deletion, and balance inquiries.

---

## API Endpoints

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**
- Both users must exist.
- A Debt between the specified users must not already exist.

**Effects:**
- A new personal debt record is created.

**Request Body:**
```json
{
  "userA": "string",
  "userB": "string"
}
```

**Success Response Body:**
```json
{
  "debt": "string"
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

**Description:** Updates the balance of an existing personal debt between two users by recording a payment.

**Requirements:**
- A Debt must exist between the payer and receiver.

**Effects:**
- The balance of the debt is adjusted based on the payment.

**Request Body:**
```json
{
  "payer": "string",
  "receiver": "string",
  "amount": "number"
}
```

**Success Response Body:**
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
- A Debt must exist between the two users.

**Effects:**
- The specified debt record is removed.

**Request Body:**
```json
{
  "userA": "string",
  "userB": "string"
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
---

### POST /api/Debt/getDebt

**Description:** Retrieves the net balance between two users for an existing debt.

**Requirements:**
- A Debt must exist between the two users.

**Effects:**
- Returns the current balance of the debt.

**Request Body:**
```json
{
  "userA": "string",
  "userB": "string"
}
```

**Success Response Body:**
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

**Purpose:** Manages expenses within groups, including details of who paid and how costs are split among users.

---

## API Endpoints

### POST /api/Expense/createExpense

**Description:** Initializes an expense record for a group, with a payer.

**Requirements:**
- The user must exist.
- The group must exist.
- The total cost must be non-negative.

**Effects:**
- Creates a new, empty expense record.

**Request Body:**
```json
{
  "user": "string",
  "group": "string"
}
```

**Success Response Body:**
```json
{
  "expense": "string"
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

**Description:** Edits the details of an existing expense.

**Requirements:**
- The expense to edit must exist.
- The total cost must be non-negative.
- The sum of user splits' amounts owed must equal the total cost.

**Effects:**
- Updates the specified expense with new details.

**Request Body:**
```json
{
  "expenseToEdit": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "totalCost": "number",
  "date": "string",
  "payer": "string"
}
```

**Success Response Body:**
```json
{
  "newExpense": "string"
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

**Description:** Deletes an expense record.

**Requirements:**
- The expense to delete must exist.

**Effects:**
- The specified expense record and its associated user splits are removed.

**Request Body:**
```json
{
  "expenseToDelete": "string"
}
```

**Success Response Body:**
```json
{
  "deletedExpense": "string"
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
- The expense must exist.
- The amount owed must be non-negative.
- The user must not already have a split in this expense.

**Effects:**
- A new user split record is created and associated with the expense.

**Request Body:**
```json
{
  "expense": "string",
  "user": "string",
  "amountOwed": "number"
}
```

**Success Response Body:**
```json
{
  "userSplit": "string"
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
- The user split must exist.
- The amount owed must be non-negative.
- If a new user is specified, they must not already have a split in the same expense.

**Effects:**
- Updates the user split record with new details.

**Request Body:**
```json
{
  "userSplit": "string",
  "user": "string",
  "amountOwed": "number"
}
```

**Success Response Body:**
```json
{
  "userSplit": "string"
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
- The expense must exist.
- The user split must exist and be associated with the expense.

**Effects:**
- The user split record is removed from the expense and the system.

**Request Body:**
```json
{
  "expense": "string",
  "userSplit": "string"
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
---

### POST /api/Expense/_getExpensesByGroup

**Description:** Retrieves all expenses associated with a specific group.

**Request Body:**
```json
{
  "group": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "string",
    "group": "string",
    "payer": "string",
    "userSplits": "string[]"
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

**Description:** Retrieves a single expense by its ID.

**Request Body:**
```json
{
  "expenseId": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "string",
    "group": "string",
    "payer": "string",
    "userSplits": "string[]"
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

**Description:** Retrieves a single user split by its ID.

**Request Body:**
```json
{
  "userSplit": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
    "user": "string",
    "amountOwed": "number",
    "expense": "string"
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

**Description:** Retrieves all user splits associated with a specific expense.

**Request Body:**
```json
{
  "expenseId": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
    "user": "string",
    "amountOwed": "number",
    "expense": "string"
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

**Description:** Retrieves a user's specific split for a given expense.

**Request Body:**
```json
{
  "expenseId": "string",
  "user": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
    "user": "string",
    "amountOwed": "number",
    "expense": "string"
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

**Description:** Retrieves all expenses where a user was either the payer or a participant in the splits.

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
    "title": "string",
    "description": "string",
    "category": "string",
    "totalCost": "number",
    "date": "string",
    "group": "string",
    "payer": "string",
    "userSplits": "string[]"
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

**Purpose:** Manages groups, allowing users to create, join, leave, and be removed from groups.

---

## API Endpoints

### POST /api/Group/createGroup

**Description:** Creates a new group with a specified creator, name, and description.

**Requirements:**
- The creator must exist.
- Name and description must be provided.

**Effects:**
- A new group is created, with the creator as the first member.

**Request Body:**
```json
{
  "creator": "string",
  "name": "string",
  "description": "string"
}
```

**Success Response Body:**
```json
{
  "group": "string"
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
- The group must exist.
- The inviter must be a member of the group.
- The new member must not already be in the group.
- The new member must exist.

**Effects:**
- The new member is added to the group's member list.

**Request Body:**
```json
{
  "group": "string",
  "inviter": "string",
  "newMember": "string"
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
---

### POST /api/Group/removeUser

**Description:** Removes a member from a group.

**Requirements:**
- The group must exist.
- The remover must be a member of the group.
- The member to remove must be in the group.

**Effects:**
- The specified member is removed from the group's member list.

**Request Body:**
```json
{
  "group": "string",
  "remover": "string",
  "member": "string"
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
---

### POST /api/Group/leaveGroup

**Description:** Allows a member to leave a group.

**Requirements:**
- The group must exist.
- The member must be in the group.

**Effects:**
- The member is removed from the group's member list.

**Request Body:**
```json
{
  "group": "string",
  "member": "string"
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
---

### POST /api/Group/deleteGroup

**Description:** Deletes a group.

**Requirements:**
- The group must exist.
- The group must have no active members.

**Effects:**
- The group is permanently deleted.

**Request Body:**
```json
{
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
---

### POST /api/Group/_listMembers

**Description:** Lists all members of a specific group.

**Request Body:**
```json
{
  "group": "string"
}
```

**Success Response Body:**
```json
{
  "members": "string[]"
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

**Purpose:** Allows users to organize groups into custom folder structures.

---

## API Endpoints

### POST /api/Folder/createFolder

**Description:** Creates a new folder for a user with a given name and an optional parent folder.

**Requirements:**
- `owner` and `name` are provided.
- A folder with the given `name` does not already exist for the specified `owner`.

**Effects:**
- A new folder is created.

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
---

### POST /api/Folder/moveFolder

**Description:** Moves a folder to become a subfolder of another specified folder for the same user.

**Requirements:**
- `user`, `folderToMove`, and `newParent` are provided.
- Both the folder to move and the new parent folder must exist for the user.

**Effects:**
- The parent of `folderToMove` is updated to `newParent`.

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
---

### POST /api/Folder/addGroupToFolder

**Description:** Adds a group to a specified folder owned by the user.

**Requirements:**
- `user`, `folderName`, and `group` are provided.
- A folder with `folderName` must exist for the `user`.
- The `group` is a valid group.
- The `user` is a member of the `group`.

**Effects:**
- The specified group is added to the folder's list of contained groups.

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
---

### POST /api/Folder/removeGroupFromFolder

**Description:** Removes a group from a specified folder owned by the user.

**Requirements:**
- `user`, `folder`, and `group` are provided.
- The specified `folder` must exist and belong to the `user`.
- The `group` must be currently present within the `folder`.

**Effects:**
- The specified group is removed from the folder's list of contained groups.

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
---

### POST /api/Folder/deleteFolder

**Description:** Deletes a folder owned by the user and moves its contained groups to a root folder.

**Requirements:**
- `user` and `folder` are provided.
- The specified `folder` must exist and belong to the `user`.

**Effects:**
- The specified folder is deleted.
- Any groups within the deleted folder are moved to a root folder for the user.

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
---

### POST /api/Folder/renameFolder

**Description:** Renames a folder owned by the user.

**Requirements:**
- `user`, `folder`, and `name` are provided.
- The specified `folder` must exist and the `user` must be its owner.
- The new `name` must not be already in use by another folder owned by the same `user`.

**Effects:**
- The name of the specified folder is updated.

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
---

### POST /api/Folder/_listFolders

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
---

### POST /api/Folder/_getFolderById

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
---

### POST /api/Folder/_listSubfolders

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
---

### POST /api/Folder/_listGroupsInFolder

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
---

### POST /api/Folder/_listGroupsInFolderByName

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
---

### POST /api/Folder/_getRootFolder

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
---

# API Specification: Authentication Concept

**Purpose:** Manages user authentication, including user creation, editing, deletion, and login.

---

## API Endpoints

### POST /api/Authentication/createUser

**Description:** Creates a new user account with a username, display name, and password.

**Requirements:**
- Username must be unique.
- Username, display name, and password must be provided.

**Effects:**
- A new user record is created.

**Request Body:**
```json
{
  "username": "string",
  "displayName": "string",
  "password": "string"
}
```

**Success Response Body:**
```json
{
  "user": "string"
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

**Description:** Edits the display name of an existing user.

**Requirements:**
- The user must exist.
- A new display name must be provided.

**Effects:**
- The user's display name is updated.

**Request Body:**
```json
{
  "user": "string",
  "newDisplayName": "string"
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
---

### POST /api/Authentication/deleteUser

**Description:** Deletes a user account.

**Requirements:**
- The user must exist.

**Effects:**
- The user record is permanently deleted.

**Request Body:**
```json
{
  "user": "string"
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
---

### POST /api/Authentication/authenticate

**Description:** Authenticates a user with a username and password.

**Requirements:**
- A user must exist with the given username.
- The provided password must match the stored password for the user.

**Effects:**
- If authentication is successful, returns the user's ID.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body:**
```json
{
  "user": "string"
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

**Description:** Retrieves user information by their ID.

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

**Description:** Retrieves user information by their username.

**Request Body:**
```json
{
  "username": "string"
}
```

**Success Response Body:**
```json
[
  {
    "_id": "string",
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
