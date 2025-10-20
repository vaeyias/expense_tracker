---
timestamp: 'Sun Oct 19 2025 21:11:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_211104.b0f444fe.md]]'
content_id: 95ebf5b771b3cdfecec17383cc92a6efb02b1723f6ab1a0fc4a38f8dbf32ede5
---

# API Specification: User Concept

**Purpose:** To manage user accounts, including creation, editing, deletion, and retrieval of user information.

***

### POST /api/User/createUser

**Description:** Creates a new user account with a username and display name.

**Requirements:**

* The username must be unique.
* Username and display name are provided.

**Effects:**

* Creates a new user document in the `users` collection.

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

***

### POST /api/User/editUser

**Description:** Edits the display name of an existing user.

**Requirements:**

* The user ID is provided.
* The new display name is provided.

**Effects:**

* Updates the `displayName` of the specified user.

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

***

### POST /api/User/deleteUser

**Description:** Deletes a user account.

**Requirements:**

* The user ID is provided.

**Effects:**

* Removes the user document from the `users` collection.

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

***

### POST /api/User/\_getUserById

**Description:** Retrieves the information for a specific user by their ID.

**Effects:**

* Returns the user document if found.

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

***

### POST /api/User/\_getUserByUsername

**Description:** Retrieves user information by their username.

**Effects:**

* Returns the user document if found.

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
```

***
