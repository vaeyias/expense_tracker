---
timestamp: 'Tue Oct 21 2025 00:59:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251021_005944.33889eeb.md]]'
content_id: a185d2a050b76db0316281fb18b731c9790983bf83e3661a770c8257947d6065
---

# API Specification: Debt Concept

**Purpose:** Represents a personal debt between two users.

***

## API Endpoints

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**

* Both users exist.
* A Debt between them does not already exist.

**Effects:**

* Creates a new personal debt record.

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

***

### POST /api/Debt/updateDebt

**Description:** Updates the balance of an existing personal debt between two users.

**Requirements:**

* A Debt exists between payer and receiver.

**Effects:**

* Updates the balance of the debt.

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

***

### POST /api/Debt/deleteDebt

**Description:** Deletes an existing debt between two users.

**Requirements:**

* A Debt exists between userA and userB.

**Effects:**

* Deletes the debt record.

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

***

### POST /api/Debt/getDebt

**Description:** Gets the net balance between two users.

**Requirements:**

* A Debt exists between the two users.

**Effects:**

* Returns the net balance.

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

***

### POST /api/Debt/\_listDebtsForUser

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

***

### POST /api/Debt/\_getNetBalance

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

***
