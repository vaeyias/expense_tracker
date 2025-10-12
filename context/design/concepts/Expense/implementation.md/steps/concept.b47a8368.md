---
timestamp: 'Sat Oct 11 2025 23:01:12 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_230112.23b74d23.md]]'
content_id: b47a8368a1f88015286b488a9883d02735a2d3c7bffa3e4b1132d615a2465dbe
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track expenses.
* **principle**: An expense is created with details like title, description, date, and cost. Then, expenses can be edited or deleted entirely.
* **state**:
  * `a set of Expenses`
    * `a title String`
    * `a description String (optional)`
    * `a category String`
    * `a totalCost Number`
    * `a date Date`
    * `a group Group` # reference to the group it belongs to
* **actions**:
  * `createExpense(user: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group): (expense: Expense)`
    * `requires user exists and is a member in group, totalCost > 0`
    * `effect creates an Expense with the given details`
  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional): (newExpense: Expense)`
    * `requires expenseToEdit exists, totalCost>0`
    * `effect updates the Expense with the given details.`
  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * `requires expenseToDelete exists.`
    * `effect deletes the Expense.`
