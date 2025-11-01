---
timestamp: 'Fri Oct 31 2025 20:27:33 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251031_202733.f913d6b8.md]]'
content_id: 454c5e0e16c41f7cde863853ed451055550cefe792998d42ded2bedd2ddd2038
---

# API Specification: Authentication Concept

**Purpose:** Manages user authentication, including user creation, editing, deletion, and login.

***

## API Endpoints

### POST /api/Authentication/createUser

**Description:** Creates a new user account with a username, display name, and password.

**Requirements:**

* Username must be unique.
* Username, display name, and password must be provided.

**Effects:**

* A new user record is created.

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

***

### POST /api/Authentication/editUser

**Description:** Edits the display name of an existing user.

**Requirements:**

* The user must exist.
* A new display name must be provided.

**Effects:**

* The user's display name is updated.

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

***

### POST /api/Authentication/deleteUser

**Description:** Deletes a user account.

**Requirements:**

* The user must exist.

**Effects:**

* The user record is permanently deleted.

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

***

### POST /api/Authentication/authenticate

**Description:** Authenticates a user with a username and password.

**Requirements:**

* A user must exist with the given username.
* The provided password must match the stored password for the user.

**Effects:**

* If authentication is successful, returns the user's ID.

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

***

### POST /api/Authentication/\_getUserById

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

***

### POST /api/Authentication/\_getUserByUsername

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

***
