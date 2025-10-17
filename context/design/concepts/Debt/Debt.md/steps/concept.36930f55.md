---
timestamp: 'Thu Oct 16 2025 20:43:09 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_204309.43f71475.md]]'
content_id: 36930f55adcf01238439078bf4e68d463c591be513950904c9a980bf3e00b805
---

# concept: Debt

* **purpose**: Calculate and record debts between users.

* **principle**: After a **Debt** is created between two users, users can track how much they owe each other. The balance updates whenever one user pays another or when one user owes another user some amount for an expense.

* **state**:
  * `a set of Debts` with
    * `userA User`
    * `userB User`
    * `balance Number`  # positive if userA owes userB

* **actions**:
  * `createDebt(userA: User, userB: User): (debt: Debt)`
    * `requires both users exist, userA is not userB, a Debt between them does not already exist`
    * `effect creates a new Debt with balance 0`

  * `updateDebt(payer: User, receiver: User, amount: Number): (balance: Number)`
    * `requires a Debt exists between payer and receiver`
    * `effect adjusts the balance between the two users by the amount paid and returns the updated balance`

  * `deleteDebt(debt: Debt):`
    * `requires a Debt exists between payer and receiver`
    * `effect deletes the Debt`

  * `getDebt(userA: User, userB: User): (balance: Number)`
    * `requires a Debt exists between the two users`
    * `effect returns the net balance between userA and userB (positive if userA owes userB, negative if vice versa)`
