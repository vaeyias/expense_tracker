---
timestamp: 'Tue Oct 21 2025 00:59:44 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251021_005944.33889eeb.md]]'
content_id: 82a934a5f30d5e6ea11dda5b1c362c015ba42760c127a6f23c54252c1a0bafcc
---

# API Specification: Group Concept

**Purpose:** Manages user groups and their memberships.

***

## API Endpoints

### POST /api/Group/createGroup

**Description:** Creates a new group.

**Requirements:**

* Creator exists.
* Name and description are provided.

**Effects:**

* Creates a new group document.

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

* Group exists.
* Inviter is a member of the group.
* New member is not already in the group.
* User exists.

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

* Group exists.
* Remover is a member of the group.
* Member to remove is in the group.

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

**Description:** Allows a member to leave a group.

**Requirements:**

* Group exists.
* Member is in the group.

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

* Group exists.
* Group has no active members.

**Effects:**

* Deletes the group document.

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

**Description:** Lists all members of a group.

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
