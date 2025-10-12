---
timestamp: 'Sun Oct 12 2025 12:25:04 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251012_122504.221fa3a9.md]]'
content_id: fa234a563680644af3b276fd95b2b9f3bd5a81f7ce06575ef9ff302190a2d64e
---

# concept: Group

* **purpose**: To group users together, facilitating collective actions and sharing of information.
* **principle**: If users are added to a group, they can then be acted upon collectively, and information shared within the group is accessible to all members.
* **state**:
  * `a set of Groups with`:
    * `a name String`
    * `a members set of User`
* **actions**:
  * `createUserGroup (name: String)`: Creates a new group with a given name.
  * `addUserToGroup (group: Group, user: User)`: Adds a user to an existing group.
  * `removeUserFromGroup (group: Group, user: User)`: Removes a user from an existing group.
  * `getGroupMembers (group: Group)`: Returns the list of users in a group.
