---
timestamp: 'Sat Oct 11 2025 11:13:13 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_111313.299a9687.md]]'
content_id: 45f634418e232df4c9b8b62320f792d2c10391d17a91e0ca026e5baff7fe6b21
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track both individual and shared expenses.
* **principle**: After expenses are recorded, users can view their personal spending, understand shared costs within groups, and manage group finances.
* **state**:
  * `a set of Expenses`
    * `a title String`
    * `a description String (optional)`
    * `a category String`
    * `a totalCost Number`
    * `a date Date`
    * `a payer User`
    * `a group Group`
    * `a debtMapping Map<User:Number>`
* **actions**:
  * `createExpense(payer: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group, debtMapping: Map<User:Number>): (expense: Expense)`
    * `requires payer exists, payer and all users in debtMapping are in the given group, totalCost > 0, all numbers in debtMapping are nonnegative`
    * `effect creates an Expense with the given details`
  * `editExpense(expenseToEdit: Expense, payer: User optional, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional, debtMapping: Map<User:Number> optional): (newExpense: Expense)`
    * `requires expenseToEdit exists, totalCost>0, payer is in the expenseToEdit.group. all numbers in debtMapping is nonnegative`
    * `effect updates the Expense with the given details.`
  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * `requires expenseToDelete exists.`
    * `effect deletes the Expense.`
