[@concept-design-overview](../background/concept-design-overview.md)

[@concept-specifications](../background/concept-specifications.md)

[@implementing-concepts](../background/implementing-concepts.md)
```
concept Group
    purpose manage collections of users who share expenses
    principle users can create groups, add users to groups, remove users from groups, and leave groups.
    state
        a set of Groups with
            a name String
            a description String
            a creator User
            a set of Users

    actions
        createGroup(creator: User, name: String, description: String): (group: Group)
            requires creator exists
            effect creates a new group with creator as a member

        addUser(group: Group, inviter: User, newMember: User)
            requires group exists, inviter and newMember exist, inviter is in group, newMember is not already in group
            effect adds newMember to the group

        removeUser(group: Group, remover: User, member: User)
            requires group exists, remover is creator of group, member exists in group
            effect removes member from the group

        leaveGroup(group: Group, member: User)
            requires group exists and member is in the group
            effect member leaves group (if debts are settled)

        listMembers(group: Group): (members: Set<User>)
            requires group exists
            effect returns all users in the group
```
