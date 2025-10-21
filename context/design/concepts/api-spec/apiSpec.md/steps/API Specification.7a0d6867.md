---
timestamp: 'Tue Oct 21 2025 00:59:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251021_005944.33889eeb.md]]'
content_id: 7a0d68672d194df074322841eb61b778322a46e5faefd5a2fd608030273f69e6
---

# API Specification: Expense Concept

**Purpose:** Manages expenses and user splits within groups.

***

## API Endpoints

### POST /api/Expense/createExpense

**Description:** Creates a new expense with initial details.

**Requirements:**

* User exists.
* Total cost is non-negative.

**Effects:**

* Creates an Expense document.

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

* Expense exists to be edited.
* Total cost is non-negative.
* Sum of userSplits.amountOwed equals totalCost.

**Effects:**

* Updates the Expense document.

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

**Description:** Deletes an expense.

**Requirements:**

* Expense exists to be deleted.

**Effects:**

* Deletes the expense document.

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

* Expense exists.
* Amount owed is non-negative.
* User does not already have a split in this expense.

**Effects:**

* Adds a UserSplit document.
* Adds the UserSplit ID to the expense's userSplits array.

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

**Description:** Edits an existing user's split in an expense.

**Requirements:**

* UserSplit exists.
* Amount owed is non-negative.
* If user is changed, the new user does not already have a split in the same expense.

**Effects:**

* Updates the UserSplit document.

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

* Expense exists.
* UserSplit exists and is associated with the expense.

**Effects:**

* Removes the UserSplit document.
* Removes the UserSplit ID from the expense's userSplits array.

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

***

### POST /api/Expense/\_getExpenseById

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

***

### POST /api/Expense/\_getUserSplitById

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

***

### POST /api/Expense/\_getSplitsByExpense

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

***

### POST /api/Expense/\_getSplitForExpense

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

***

### POST /api/Expense/\_getExpensesByUser

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

***
