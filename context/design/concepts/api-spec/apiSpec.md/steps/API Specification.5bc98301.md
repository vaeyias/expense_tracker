---
timestamp: 'Tue Oct 21 2025 00:59:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251021_005944.33889eeb.md]]'
content_id: 5bc98301b36144bae7d898516f965ec4d1d69d8b093c7876167792d28532fbfc
---

# API Specification: Authentication Concept

**Purpose:** Manages user authentication and profile information.

***

## API Endpoints

### POST /api/Authentication/createUser

**Description:** Creates a new user account.

**Requirements:**

* Username, display name, and password are provided.
* Username does not already exist.

**Effects:**

* Creates a new user document.

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

***

### POST /api/Authentication/editUser

**Description:** Edits an existing user's display name.

**Effects:**

* Updates the user's display name.

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

### POST /api/Authentication/deleteUser

**Description:** Deletes a user account.

**Effects:**

* Deletes the user document.

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

### POST /api/Authentication/authenticate

**Description:** Authenticates a user with a username and password.

**Requirements:**

* A User to exist with the given username.
* The provided password matches the User's password.

**Effects:**

* Grants access if authentication is successful.

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

***

### POST /api/Authentication/\_getUserById

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

***

### POST /api/Authentication/\_getUserByUsername

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

***

```
```
