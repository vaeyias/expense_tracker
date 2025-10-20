---
timestamp: 'Sun Oct 19 2025 21:11:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_211104.b0f444fe.md]]'
content_id: fbd7b33d1944ada99492a4a68b4169eed4879f62190b84591de3a4564785f32f
---

# API Specification: Expense Concept

**Purpose:** To manage expenses within groups, including tracking who paid, individual shares, and overall expense details.

***

### POST /api/Expense/createExpense

**Description:** Initiates the creation of a new expense record for a group, setting initial default values.

**Requirements:**

* The user exists.
* The group exists.
* The total cost is non-negative.

**Effects:**

* Creates an Expense document with default values (empty title, description, category, zero total cost, current date, provided group and payer).
* Creates an empty list of user splits.

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

***

### POST /api/Expense/editExpense

**Description:** Updates the details of an existing expense.

**Requirements:**

* The expense to edit exists.
* The total cost is non-negative.
* The sum of user splits' amounts owed equals the total cost.

**Effects:**

* Updates the specified fields of the expense document.

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

***

### POST /api/Expense/deleteExpense

**Description:** Deletes an expense and all its associated user splits.

**Requirements:**

* The expense to delete exists.

**Effects:**

* Removes the expense document and related user split documents.

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

***

### POST /api/Expense/addUserSplit

**Description:** Adds a user's share to an expense.

**Requirements:**

* The expense exists.
* The amount owed is non-negative.
* The user does not already have a user split in this expense.

**Effects:**

* Creates a UserSplit document.
* Adds the UserSplit's ID to the expense's `userSplits` array.

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

***

### POST /api/Expense/editUserSplit

**Description:** Edits an existing user's split within an expense.

**Requirements:**

* The user split exists.
* If a new user is specified, that user does not already have a split in the same expense.
* The amount owed is non-negative.

**Effects:**

* Updates the user or amount owed for the specified user split.

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

***

### POST /api/Expense/removeUserSplit

**Description:** Removes a user's split from an expense.

**Requirements:**

* The expense exists.
* The user split exists within the specified expense.

**Effects:**

* Removes the UserSplit document.
* Removes the UserSplit's ID from the expense's `userSplits` array.

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

***

### POST /api/Expense/\_getExpensesByGroup

**Description:** Retrieves all expenses associated with a specific group.

**Effects:**

* Returns an array of expense documents belonging to the specified group.

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

***

### POST /api/Expense/\_getExpenseById

**Description:** Retrieves a specific expense by its ID.

**Effects:**

* Returns the expense document if found.

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

***

### POST /api/Expense/\_getUserSplitById

**Description:** Retrieves a specific user split by its ID.

**Effects:**

* Returns the user split document if found.

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

***

### POST /api/Expense/\_getSplitsByExpense

**Description:** Retrieves all user splits associated with a given expense.

**Effects:**

* Returns an array of user split documents for the specified expense.

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

***

### POST /api/Expense/\_getExpensesByUser

**Description:** Retrieves all expenses where the user is either the payer or a participant in a user split.

**Effects:**

* Returns an array of all expense documents involving the specified user.

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

***
