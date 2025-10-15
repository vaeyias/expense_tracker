---
timestamp: 'Tue Oct 14 2025 22:02:02 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251014_220202.2b5479e0.md]]'
content_id: 39eecacdec17b143c79533181cd58273a570e2d2329e8ef1b218a5ca969545bf
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track expenses.

* **principle**: An expense is created with details like title, payer, and cost. Expenses can be edited or deleted entirely. Each UserSplit represents how much a user owes for a specific expense. This can also be edited or deleted.

* **state**:
  * `a set of Expenses with`
    * `a title String`
    * `a description String (optional)`
    * `a category String`
    * `a date Date`
    * `a payer User`
    * `a totalCost Number`
    * `a group Group` # reference to the group it belongs to

  * `a set of UserSplits with`
    * `a user User`
    * `a amountOwed Number`
    * `an expense Expense` # reference to the Expense

* **actions**:
  * `createExpense(user: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group, splits:[UserSplits]): (expense: Expense)`
    * **requires** user exists and is a member in group, totalCost >= 0, amountsOwed in UsersSplits sum to totalCost
    * **effect** creates an Expense with the given details

  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional, splits:[UserSplits]):`
    * **requires** `expenseToEdit` exists, totalCost>=0, amountsOwed in UsersSplits sum to totalCost.
    * **effect** updates the Expense with the given details.

  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * **requires** `expenseToDelete` exists.
    * **effect** deletes the Expense and associated UserSplits

  * `addUserSplit(expense: Expense, user: User, group:Group, amountOwed: Number):`
    * **requires** `expense` and `user` exist, user in group, `amountOwed` >= 0
    * **effect** adds a split for the user in the given expense.

  * `editUserSplit(expense: Expense, user: User, amountOwed: Number):`
    * **requires** expense exists, `amountOwed` >= 0
    * **effect** adds a split for the user in the given expense.

  * `removeUserSplit(splitToRemove: UserSplit):`
    * **requires** `splitToRemove` exists.
    * **effect** delete the split entry.
