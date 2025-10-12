---
timestamp: 'Sat Oct 11 2025 20:16:56 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_201656.447c98b3.md]]'
content_id: 811ad7ba4d1ce37670e4897b8e2f95f34366ae47b7dfcbd830ed46651622cb60
---

# concept: Expense

* **purpose**: Allows users to record, manage, and track both individual and shared expenses.
* **principle**: Users create expenses specifying the payer and splits of users involved. Then users can edit the expense's details or delete the expense entirely.
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
    * `requires payer exists, payer and all users in debtMapping are in the given group, totalCost > 0, all numbers in debtMapping are nonnegative and sum to totalCost`
    * `effect creates an Expense with the given details`
  * `editExpense(expenseToEdit: Expense, payer: User optional, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional, debtMapping: Map<User:Number> optional): (newExpense: Expense)`
    * `requires expenseToEdit exists, totalCost>0, payer is in the expenseToEdit.group. all numbers in debtMapping is nonnegative and sum to totalCost`
    * `effect updates the Expense with the given details.`
  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * `requires expenseToDelete exists.`
    * `effect deletes the Expense.`
