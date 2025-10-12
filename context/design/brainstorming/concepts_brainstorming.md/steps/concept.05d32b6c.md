---
timestamp: 'Sat Oct 11 2025 22:01:29 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_220129.44733975.md]]'
content_id: 05d32b6c51726454e2d49deb5ef70a69e0201b5359604178da757ac8bd8923e6
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track expenses.
* **principle**: Users create expenses with details like title, description, date, and cost. Then users can edit the expense's details or delete the expense entirely.
* **state**:
  * `a set of Expenses`
    * `a title String`
    * `a description String (optional)`
    * `a category String`
    * `a totalCost Number`
    * `a date Date`
    * `a group Group`
* **actions**:
  * `createExpense(user: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group): (expense: Expense)`
    * `requires payer exists, user is in the given group, totalCost > 0`
    * `effect creates an Expense with the given details`
  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional): (newExpense: Expense)`
    * `requires expenseToEdit exists, totalCost>0`
    * `effect updates the Expense with the given details.`
  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * `requires expenseToDelete exists.`
    * `effect deletes the Expense.`

help me come up with the concept specifications for expense and debt. evaluate the quality of my concepts.
