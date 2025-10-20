---
timestamp: 'Sun Oct 19 2025 21:11:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_211104.b0f444fe.md]]'
content_id: aa6fd92ef4e2458997312cab9467be56bc1730f18c1747a94a53107e3c1f4d85
---

# API Specification: Debt Concept

**Purpose:** To manage personal debts between users, allowing for creation, updating, deletion, and querying of debt relationships.

***

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**

* Both users exist.
* A debt between these users does not already exist.

**Effects:**

* Creates a new debt record with a balance of 0.

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

**Description:** Updates the balance of an existing personal debt between two users based on a payment.

**Requirements:**

* A debt exists between the payer and receiver.

**Effects:**

* Adjusts the balance of the debt record to reflect the payment.

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

**Description:** Deletes an existing debt record between two users.

**Requirements:**

* A debt exists between the two users.

**Effects:**

* Removes the debt record from the database.

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

**Description:** Retrieves the net balance between two specific users.

**Requirements:**

* A debt record exists between the two users.

**Effects:**

* Returns the current balance between the two users.

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
