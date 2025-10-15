---
timestamp: 'Tue Oct 14 2025 17:54:28 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251014_175428.55e91666.md]]'
content_id: 229a9aa666613c52462176191d978aebd5e7e2a1216900ab37f75517d959acf7
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
    * `requires both users exist and a Debt between them does not already exist`
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
