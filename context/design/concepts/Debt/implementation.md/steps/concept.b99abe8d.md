---
timestamp: 'Sat Oct 11 2025 23:43:37 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_234337.37a9e422.md]]'
content_id: b99abe8d2164545c279d3e4717c2cab961f9ce041a1c0de6876498101745e7c7
---

# concept: Debt

* **purpose**: Calculate and record debts between users.

* **principle**: After a **PersonalDebt** is created between two users, users can track how much they owe each other. The balance updates whenever one user pays another or when a new shared expense is recorded. Each **DebtRecord** represents a transaction tied to a specific expense and can be edited or deleted.

* **state**:
  * `a set of PersonalDebts` with
    * `userA User`
    * `userB User`
    * `balance Number`  # positive if userA owes userB
  * `a set of DebtRecords` with
    * `payer User`
    * `receivers Map<User, Number>`  # how much each user owes the payer
    * `totalCost Number`
    * `expense Expense`  # reference to the associated expense

* **actions**:
  * `createPersonalDebt(userA: User, userB: User): (debt: Debt)`
    * `requires both users exist and a PersonalDebt between them does not already exist`
    * `effect creates a new PersonalDebt with balance 0`

  * `updatePersonalDebt(payer: User, receiver: User, amount: Number): (balance: Number)`
    * `requires a PersonalDebt exists between payer and receiver`
    * `effect adjusts the balance between the two users by the amount paid and returns the updated balance`

  * `createDebtRecord(payer: User, totalCost: Number, receiversSplit: Map<User, Number>)`
    * `requires payer and all receivers exist, all numbers in receiversSplit are nonnegative, and sum to totalCost`
    * `effect creates a new DebtRecord and updates each PersonalDebt balance between the payer and each receiver according to their split`

  * `editDebtRecord(debtRecord: DebtRecord, totalCost: Number, receiversSplit: Map<User, Number>)`
    * `requires debtRecord exists, totalCost > 0, all receivers exist, numbers in receiversSplit are nonnegative and sum to totalCost`
    * `effect updates the DebtRecord and recalculates the balances in the affected PersonalDebts accordingly`

  * `deleteDebtRecord(debtRecord: DebtRecord)`
    * `requires debtRecord exists`
    * `effect deletes the DebtRecord and adjusts the affected PersonalDebts to remove the debt associated with this record`

  * `getDebt(userA: User, userB: User): (balance: Number)`
    * `requires a PersonalDebt exists between the two users`
    * `effect returns the net balance between userA and userB (positive if userA owes userB, negative if vice versa)`
