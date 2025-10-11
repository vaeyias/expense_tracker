---
timestamp: 'Sat Oct 11 2025 12:07:34 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_120734.73081a77.md]]'
content_id: 8c8b9306436793e1413b76e3a3015d0f2e1c7ab3ba267b1b6654d1890f62a7ec
---

# concept: Expense

* **purpose**: to record, manage, and track shared and individual expenses, including payer, participants, and cost distribution.

* **principle**: after an expense is created for a group, with a payer and a defined distribution of costs among users, the system accurately reflects who paid what and who owes whom.

* **state**:
  * a set of Expenses with
    * an `id` of type `ExpenseID`
    * a `creator` of type `User`
    * a `payer` of type `User`
    * a `group` of type `Group`
    * a `title` of type `String`
    * a `description` of type `String`
    * a `category` of type `String`
    * a `totalCost` of type `Number`
    * a `date` of type `Date`
    * a `debtMapping` of type `Map<User, Number>` (mapping users to the amount they owe for this expense)

* **actions**:
  * `createExpense` (`creator`: `User`, `payer`: `User`, `group`: `Group`, `title`: `String`, `description`: `String`, `category`: `String`, `totalCost`: `Number`, `date`: `Date`, `debtMapping`: `Map<User, Number>`): (`expense`: `ExpenseID`)
    * **requires**: `creator` exists, `payer` exists, `group` exists, `creator` is in `group`, `payer` is in `group`, `totalCost` > 0, all values in `debtMapping` are non-negative and sum to `totalCost`.
    * **effects**: creates a new `Expense` with a unique `id`, the provided details, and stores it.

  * `editExpense` (`editor`: `User`, `expenseId`: `ExpenseID`, `title`: `String`, `description`: `String`, `category`: `String`, `totalCost`: `Number`, `date`: `Date`, `debtMapping`: `Map<User, Number>`): (`newExpenseId`: `ExpenseID`)
    * **requires**: `editor` exists, `expenseId` refers to an existing `Expense`, `editor` is either the `creator` or `payer` of the `Expense`, `totalCost` > 0, all values in `debtMapping` are non-negative and sum to `totalCost`.
    * **effects**: updates the `Expense` identified by `expenseId` with the new details and returns its `id`.

  * `deleteExpense` (`deleter`: `User`, `expenseId`: `ExpenseID`): (`deletedExpenseId`: `ExpenseID`)
    * **requires**: `deleter` exists, `expenseId` refers to an existing `Expense`, `deleter` is either the `creator` or `payer` of the `Expense`.
    * **effects**: deletes the `Expense` identified by `expenseId` and returns its `id`.
