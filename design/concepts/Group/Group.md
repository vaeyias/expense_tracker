# Concept
```
concept Group
    purpose manage collections of users who share expenses
    principle users can create groups, add users to groups, remove users from groups, and leave groups.
    state
        a set of Groups with
            an id ID
            a name String
            a description String
            a creator User
            a members set of Users

    actions
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

        _listMembers(group: Group): (members: Set<User>)
            requires group exists
            effect returns all users in the group
```
