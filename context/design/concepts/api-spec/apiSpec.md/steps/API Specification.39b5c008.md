---
timestamp: 'Fri Oct 31 2025 20:27:33 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251031_202733.f913d6b8.md]]'
content_id: 39b5c0086d976dfe26f07a6fa7c4c142057b708e225eeab7e8609892da51d1fc
---

# API Specification: Debt Concept

**Purpose:** Manages personal debts between users, allowing for creation, updates, deletion, and balance inquiries.

***

## API Endpoints

### POST /api/Debt/createDebt

**Description:** Creates a new personal debt record between two users.

**Requirements:**

* Both users must exist.
* A Debt between the specified users must not already exist.

**Effects:**

* A new personal debt record is created.

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

***

### POST /api/Debt/updateDebt

**Description:** Updates the balance of an existing personal debt between two users by recording a payment.

**Requirements:**

* A Debt must exist between the payer and receiver.

**Effects:**

* The balance of the debt is adjusted based on the payment.

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

***

### POST /api/Debt/deleteDebt

**Description:** Deletes an existing debt record between two users.

**Requirements:**

* A Debt must exist between the two users.

**Effects:**

* The specified debt record is removed.

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

***

### POST /api/Debt/getDebt

**Description:** Retrieves the net balance between two users for an existing debt.

**Requirements:**

* A Debt must exist between the two users.

**Effects:**

* Returns the current balance of the debt.

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

***
