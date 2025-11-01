---
timestamp: 'Fri Oct 31 2025 20:27:33 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251031_202733.f913d6b8.md]]'
content_id: 489937946f33b4578193400cea540f1ceb579a5bbf521ca4a65d4883d565baa5
---

# API Specification: Group Concept

**Purpose:** Manages groups, allowing users to create, join, leave, and be removed from groups.

***

## API Endpoints

### POST /api/Group/createGroup

**Description:** Creates a new group with a specified creator, name, and description.

**Requirements:**

* The creator must exist.
* Name and description must be provided.

**Effects:**

* A new group is created, with the creator as the first member.

**Request Body:**

```json
{
  "creator": "string",
  "name": "string",
  "description": "string"
}
```

**Success Response Body:**

```json
{
  "group": "string"
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

* The group must exist.
* The inviter must be a member of the group.
* The new member must not already be in the group.
* The new member must exist.

**Effects:**

* The new member is added to the group's member list.

**Request Body:**

```json
{
  "group": "string",
  "inviter": "string",
  "newMember": "string"
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

### POST /api/Group/removeUser

**Description:** Removes a member from a group.

**Requirements:**

* The group must exist.
* The remover must be a member of the group.
* The member to remove must be in the group.

**Effects:**

* The specified member is removed from the group's member list.

**Request Body:**

```json
{
  "group": "string",
  "remover": "string",
  "member": "string"
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

### POST /api/Group/leaveGroup

**Description:** Allows a member to leave a group.

**Requirements:**

* The group must exist.
* The member must be in the group.

**Effects:**

* The member is removed from the group's member list.

**Request Body:**

```json
{
  "group": "string",
  "member": "string"
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

### POST /api/Group/deleteGroup

**Description:** Deletes a group.

**Requirements:**

* The group must exist.
* The group must have no active members.

**Effects:**

* The group is permanently deleted.

**Request Body:**

```json
{
  "group": "string"
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

### POST /api/Group/\_listMembers

**Description:** Lists all members of a specific group.

**Request Body:**

```json
{
  "group": "string"
}
```

**Success Response Body:**

```json
{
  "members": "string[]"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
