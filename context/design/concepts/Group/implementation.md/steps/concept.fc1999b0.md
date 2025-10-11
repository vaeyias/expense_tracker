---
timestamp: 'Sat Oct 11 2025 16:40:09 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_164009.cbc9f250.md]]'
content_id: fc1999b037935caea80ee66e24e40a4be8f31bd8e86da9ddf822128e8972cb2f
---

# concept: Group

```
purpose: manage collections of users who share expenses
principle: users can create groups, add users to groups, remove users from groups, and leave groups.
state:
    a set of Groups with
        a name String
        a description String
        a creator User
        a set of Users

actions:
    createGroup(creator: User, name: String, description: String): (group: Group)
        requires creator exists
        effect creates a new group with creator as a member

    addUser(group: Group, inviter: User, newMember: User)
        requires group exists, inviter and newMember exist, inviter is in group, newMember is not already in group
        effect adds newMember to the group

    removeUser(group: Group, remover: User, member: User)
        requires group exists, remover and member exists in group
        effect removes member from the group

    leaveGroup(group: Group, member: User)
        requires group exists and member is in the group
        effect member leaves group

    deleteGroup(group: Group)
        requires group exists, no members to exist in group
        effect group is deleted

    listMembers(group: Group): (members: Set<User>)
        requires group exists
        effect returns all users in the group
```
