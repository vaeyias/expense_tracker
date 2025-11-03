# Group
## Key Change from Assignment 2:
- After getting feedback on Assignment 2, I created an indepedent concept called Group to group users.
- The original concept was integrated in my GroupExpenseTracker concept specification.


## Changes While Implementing
- ### Draft #1 of Group Specification:
    - [Draft #1](../../../context/design/concepts/Group/Group.md/steps/_.85a1a0b3.md)

    - [Implementation Draft #1](../../../context/design/concepts/Group/implementation.md/steps/response.b8d0dbe3.md)



- ### Remove creator requirement to removeUsers:

After I used LLM to implement the first draft of Group, I saw a comment in the code saying if the creator left the group, then certain features of Group would not work (the removeUser action only allows the creator of the group to remove members). Rather than not allowing the owner to leave the group, I decided to allow any member to remove other users from the group.

- ### Add deleteGroup action
After allowing the creator of the group to leave. I realized there might be a case when no more members exist in the group. So, I decided to add a deleteGroup action. However, I also don't want to allow anyone to delete a group when there are still active members. So, a group is only deleted if there are no members in it.

- After these two changes:

    - [Concept Draft #2](../../../context/design/concepts/Group/Group.md/steps/_.405601ea)

    - [Implementation Draft #2](../../../context/design/concepts/Group/implementation.md/steps/_.23003ada.md)
