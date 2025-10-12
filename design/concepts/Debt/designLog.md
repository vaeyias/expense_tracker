# Debt Design Log

### Initial Design: [concept](../../../context/design/concepts/Debt/initialConcept.md/steps/_.f5ae342d.md)
- Debt keeps track of debts between two users.


### Revised Design after Feedback: [concept](../../../context/design/concepts/Debt/initialConcept.md/steps/_.f5ae342d.md)
- Debt manages debts betweeen users and calculates/tracks cost splitting between users.

### Other Revisions
- I planned to have two PersonalDebt states for each pair of users (one state where userA owes userB and another where userB owes userA). However, after creating test cases, I decided to have two PersonalDebt states

### Problems Encountered
- A challenge I encountered was choosing between implementing a single PersonalDebt state for each pair of users or two separate states for when userA owes userB and when userB owes userA,
