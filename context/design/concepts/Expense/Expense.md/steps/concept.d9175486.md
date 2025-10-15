---
timestamp: 'Tue Oct 14 2025 17:54:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251014_175416.edb9fddf.md]]'
content_id: d917548640378479a9d8fed8167c06b23da2fc50110197750d8efab8dc19f328
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
    * `a set of UserSplits`

  * `a set of UserSplits with`
    * `a user User`
    * `a amountOwed Number`
    * `an expense Expense` # reference to the Expense

* **actions**:
  * `createExpense(user: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group, splits:[UserSplits]): (expense: Expense)`
    * **requires** user exists and is a member in group, totalCost >= 0
    * **effect** creates an Expense with the given details

  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional, splits:[UserSplits]):`
    * **requires** `expenseToEdit` exists, totalCost>=0
    * **effect** updates the Expense with the given details.

  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * **requires** `expenseToDelete` exists.
    * **effect** deletes the Expense.

  * `addUserSplit(expense: Expense, user: User, group:Group, amountOwed: Number):`
    * **requires** `expense` and `user` exist, user in group, `amountOwed` >= 0
    * **effect** adds a split for the user in the given expense.

  * `editUserSplit(expense: Expense, user: User, amountOwed: Number):`
    * **requires** expense exists, `amountOwed` >= 0
    * **effect** adds a split for the user in the given expense.

  * `removeUserSplit(splitToRemove: UserSplit):`
    * **requires** `splitToRemove` exists.
    * **effect** delete the split entry.
