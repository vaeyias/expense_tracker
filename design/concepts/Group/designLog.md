# Group
## Key Change from Assignment 2:
- After getting feedback on Assignment 2, I created a new concept called Group to group users.
- Group is now an independent concept. (The original concept was the GroupExpenseTracker concept)


## Changes While Implementing
- ### Draft #1 of Group Specification:
[Draft #1](../../../context/design/concepts/Group/Group.md/steps/_.85a1a0b3.md)

[Implementation Draft #1](../../../context/design/concepts/Group/implementation.md/steps/response.b8d0dbe3.md)




- ### Remove creator requirement to removeUsers:

After I used LLM to implement the first draft of Group, I saw a comment in the code saying if the creator left the group, then certain features of Group would not work (the removeUser action only allows the creator of the group to remove members). Rather than not allowing the owner to leave the group, I decided to allow any member to remove other users from the group.

- ### Add deleteGroup action
After allowing the creator of the group to leave. I realized there might be a case when no more members exist in the group. So, I decided to add a deleteGroup action. However, I also don't want to allow anyone to delete a group when there are still active members. So, a group is only deleted if there are no members in it.

- After these two changes:

[Concept Draft #2](../../../context/design/concepts/Group/Group.md/steps/_.405601ea)

 [Implementation Draft #2](../../../context/design/concepts/Group/implementation.md/steps/_.23003ada.md)

 ## Testing
 - When testing, I tried to get the LLM to output the test cases in a similar format to ExpenseConcept.tests.ts, but I had trouble getting the LLM to do this. So, I took the test cases generated and manually modified the code to match the output of ExpenseConcept.tests.ts.

- When testing I was stuck on a bug where certain test cases would sometimes pass and sometimes fail. I chose to focus on the addUser action. I figured out that the issue was because I updateOne is async and I needed to add await. This was the cause of many bugs:
```
await this.groups.updateOne(
      { _id: group },
      { $addToSet: { members: newMember } }, // $addToSet ensures uniqueness
    );
```

- Then, I realized that the Group concept implementation was throwing errors for every error instead of returning errors. So, I fixed this and modified the test file to match this. I also changed a lot of the test cases that seemed redundant.

[New Test File](../../../context/design/concepts/Group/testing.md/steps/_.4a60b7a6.md)
[New Implementation](../../../context/design/concepts/Group/implementation.md/steps/_.8966935b.md)
