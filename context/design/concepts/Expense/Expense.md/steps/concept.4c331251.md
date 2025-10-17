---
timestamp: 'Wed Oct 15 2025 14:16:21 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251015_141621.e702adcc.md]]'
content_id: 4c33125175e80eee9edffa0d89ac3086a66fb923d72c46af3f48935483663f47
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track shared expenses.

* **principle**: An expense is initiallially created with default values. Then, UserSplits can be created and added to this expense. Each UserSplit represents how much a user owes the payer for a specific expense. UserSplits can also be edited or deleted and removed from the expense. Expense details such as description, payer, and total cost can be edited.

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
  * `createExpense(creator: User, group: Group): (expense: Expense)`
    * **requires** user exists and is a member in group
    * **effect** creates an Expense associated with the given group. Expense details are set to default values.

  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional):`
    * **requires** `expenseToEdit` exists, totalCost>=0, amountsOwed in expenseToEdit.UsersSplits sum to totalCost.
    * **effect** updates the Expense with the given details.

  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * **requires** `expenseToDelete` exists.
    * **effect** deletes the Expense and associated UserSplits

  * `addUserSplit(expense: Expense, user: User, group:Group, amountOwed: Number):`
    * **requires** `expense` and `user` exist, user in group, `amountOwed` >= 0, split for this user does not exist in expense
    * **effect** adds a split for the user in the given expense.

  * `editUserSplit(expense: Expense, user: User, amountOwed: Number):`
    * **requires** expense exists, `amountOwed` >= 0, split for the user does not already exist in expense
    * **effect** creates a UserSplit and adds a split for the user in the given expense.

  * `removeUserSplit(splitToRemove: UserSplit):`
    * **requires** `splitToRemove` exists.
    * **effect** delete the split entry and removes the split from the expense.
