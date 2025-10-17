# Debt Design Log

### Initial Design: [concept](../../../context/design/concepts/Debt/initialConcept.md/steps/_.f5ae342d.md)
- Debt keeps track of debts between two users.

---
### Revised Design after Assignment 2 Feedback: [concept](../../../context/design/concepts/Debt/Debt.md/steps/concept.b99abe8d.md)
The feedback said
> "your Debt concept should take in a set of users and manage the cost splitting between those users based on the total cost and which user(s) paid."
- So, Debt now manages debts betweeen users and calculates/tracks cost splitting of an expense between users.
---
### Problems Encountered
- A challenge I encountered was choosing between implementing a single PersonalDebt state for each pair of users or two separate states for when userA owes userB and when userB owes userA; however after brainstorming and implementing the concept with LLM, the generated concept and code offered a good solution to these by using positive/negative amount to indicate which user owes who and by using $or to retrieve PersonalDebt.

- After implementing Debt with this concept, I realized that passing in a map as arguments to my actions is not valid and made my DebtRecord state and associated actions quite complicated. Also, I felt like the DebtRecord state was much more closely tied to the Expense concept. So I decided to remove DebtRecord from Debt and implement the idea in Expense:
---
### Removal of DebtRecord state
After getting help in Office Hours with my concepts, I decided to redesign my concepts and move the cost splitting of an expense to the Expense concept. So, the final version of the Debt concept follows these specificaitons:

[concept](../../../context/design/concepts/Debt/Debt.md/steps/concept.36930f55.md)
