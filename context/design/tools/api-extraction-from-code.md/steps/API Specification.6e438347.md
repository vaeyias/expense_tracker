---
timestamp: 'Sun Oct 19 2025 12:21:32 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_122132.be723332.md]]'
content_id: 6e438347d355656eda48a17cf0b2418907f09b78e86fbcd6975bfe32d61e57a6
---

# API Specification: Labeling Concept

**Purpose:** associates labels with items and retrieves items that match a given label.

***

## API Endpoints

### POST /api/Labeling/createLabel

**Description:** Creates a new label with the specified name.

**Requirements:**

* A label with the given name does not already exist.

**Effects:**

* A new label is created.

**Request Body:**

```json
{
  "name": "string"
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

### POST /api/Labeling/addLabel

**Description:** Adds a label to a specific item.

**Requirements:**

* The specified item exists.
* The specified label exists.
* The label is not already associated with the item.

**Effects:**

* The label is associated with the item.

**Request Body:**

```json
{
  "item": "ID",
  "label": "ID"
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

### POST /api/Labeling/deleteLabel

**Description:** Removes a label from a specific item.

**Requirements:**

* The specified item exists.
* The specified label exists.
* The label is currently associated with the item.

**Effects:**

* The label is no longer associated with the item.

**Request Body:**

```json
{
  "item": "ID",
  "label": "ID"
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
