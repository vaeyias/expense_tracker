---
timestamp: 'Sun Oct 19 2025 21:11:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_211104.b0f444fe.md]]'
content_id: 9b4beb4599b59aa01ecef145616ed5a98d26a7125ddb0d1d06bff63b6b331067
---

# API Specification: Group Concept

**Purpose:** To manage user groups, allowing users to create, join, leave, and be removed from groups.

***

### POST /api/Group/createGroup

**Description:** Creates a new group with a specified creator, name, and description.

**Requirements:**

* The creator user exists.
* The name and description are provided.

**Effects:**

* Creates a new group record.
* Adds the creator as the first member of the group.

**Request Body:**

```json
{
  "creator": "ID",
  "name": "string",
  "description": "string"
}
```

**Success Response Body (Action):**

```json
{
  "group": "ID"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Group/addUser

**Description:** Adds a new member to an existing group.

**Requirements:**

* The group exists.
* The inviter is a member of the group.
* The new member is not already in the group.
* The new member user exists.

**Effects:**

* Adds the new member to the group's member list.

**Request Body:**

```json
{
  "group": "ID",
  "inviter": "ID",
  "newMember": "ID"
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

### POST /api/Group/removeUser

**Description:** Removes a member from a group.

**Requirements:**

* The group exists.
* The remover is a member of the group.
* The member to remove is currently in the group.

**Effects:**

* Removes the specified member from the group's member list.

**Request Body:**

```json
{
  "group": "ID",
  "remover": "ID",
  "member": "ID"
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

### POST /api/Group/leaveGroup

**Description:** Allows a member to leave a group they are currently in.

**Requirements:**

* The group exists.
* The member is currently in the group.

**Effects:**

* Removes the member from the group's member list.

**Request Body:**

```json
{
  "group": "ID",
  "member": "ID"
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

### POST /api/Group/deleteGroup

**Description:** Deletes a group.

**Requirements:**

* The group exists.
* The group has no active members.

**Effects:**

* Removes the group record from the database.

**Request Body:**

```json
{
  "group": "ID"
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

### POST /api/Group/\_listMembers

**Description:** Lists all members of a specific group.

**Effects:**

* Returns an array of user IDs representing the members of the group.

**Request Body:**

```json
{
  "group": "ID"
}
```

**Success Response Body (Query):**

```json
{
  "members": ["ID"]
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
