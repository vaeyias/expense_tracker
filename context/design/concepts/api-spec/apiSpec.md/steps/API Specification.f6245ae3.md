---
timestamp: 'Fri Oct 31 2025 20:27:33 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251031_202733.f913d6b8.md]]'
content_id: f6245ae3912fa3b24b6c698f99d34faa42e39d55c039fc3161d4157ce4e5ba0b
---

# API Specification: Expense Concept

**Purpose:** Manages expenses within groups, including details of who paid and how costs are split among users.

***

## API Endpoints

### POST /api/Expense/createExpense

**Description:** Initializes an expense record for a group, with a payer.

**Requirements:**

* The user must exist.
* The group must exist.
* The total cost must be non-negative.

**Effects:**

* Creates a new, empty expense record.

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

***

### POST /api/Expense/editExpense

**Description:** Edits the details of an existing expense.

**Requirements:**

* The expense to edit must exist.
* The total cost must be non-negative.
* The sum of user splits' amounts owed must equal the total cost.

**Effects:**

* Updates the specified expense with new details.

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

***

### POST /api/Expense/deleteExpense

**Description:** Deletes an expense record.

**Requirements:**

* The expense to delete must exist.

**Effects:**

* The specified expense record and its associated user splits are removed.

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

***

### POST /api/Expense/addUserSplit

**Description:** Adds a user's share to an expense.

**Requirements:**

* The expense must exist.
* The amount owed must be non-negative.
* The user must not already have a split in this expense.

**Effects:**

* A new user split record is created and associated with the expense.

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

***

### POST /api/Expense/editUserSplit

**Description:** Edits an existing user's split within an expense.

**Requirements:**

* The user split must exist.
* The amount owed must be non-negative.
* If a new user is specified, they must not already have a split in the same expense.

**Effects:**

* Updates the user split record with new details.

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

***

### POST /api/Expense/removeUserSplit

**Description:** Removes a user's split from an expense.

**Requirements:**

* The expense must exist.
* The user split must exist and be associated with the expense.

**Effects:**

* The user split record is removed from the expense and the system.

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

***

### POST /api/Expense/\_getExpensesByGroup

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

***

### POST /api/Expense/\_getExpenseById

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

***

### POST /api/Expense/\_getUserSplitById

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

***

### POST /api/Expense/\_getSplitsByExpense

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

***

### POST /api/Expense/\_getSplitForExpense

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

***

### POST /api/Expense/\_getExpensesByUser

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

***
