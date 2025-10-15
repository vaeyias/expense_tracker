# Expense_Output_log
```
running 1 test from ./src/concepts/Expense/ExpenseConcept.test.ts
💰 ExpenseConcept - create, edit, delete, and retrieve expenses ...
  Test Case #1: Create, edit, and retrieve expense ...
------- post-test output -------
[1] Creating expense...
[1] Created expense ID: 0199d98b-395c-70f6-a5d0-5537b1f731c9
[1] Retrieved expense by Id: {
  title: "Groceries",
  totalCost: 100,
  group: "group:1",
  category: "Food",
  date: 2025-01-01T00:00:00.000Z
}
[1] Retrieving Expenses by Group: [ { title: "Groceries", total: 100 } ]
[1] Editing expense...
[1] Edited expense ID: 0199d98b-395c-70f6-a5d0-5537b1f731c9
[1] Updated expense: {
  title: "Weekend Groceries",
  totalCost: 120,
  group: "group:1",
  category: "Food & Drink",
  date: 2025-01-02T00:00:00.000Z
}
[1] Deleting expense...
[1] Deleted expense ID: 0199d98b-395c-70f6-a5d0-5537b1f731c9
[1] Verified deletion successful: null
----- post-test output end -----
  Test Case #1: Create, edit, and retrieve expense ... ok (257ms)
  Test Case #2: Invalid total cost returns error ...
------- post-test output -------
[2] Creating expense with totalCost = -5 ...
[2] Expected error: totalCost must be greater than 0
----- post-test output end -----
  Test Case #2: Invalid total cost returns error ... ok (0ms)
  Test Case #3: Retrieving from empty group returns [] ...
------- post-test output -------
[3] Retrieving expenses from empty group...
[3] Retrieved expenses: []
----- post-test output end -----
  Test Case #3: Retrieving from empty group returns [] ... ok (24ms)
  Test Case #4: Many Edits ...
------- post-test output -------
[4] Creating initial expense...
[1] Updated expense: {
  title: "Initial Expense",
  totalCost: 50,
  group: "group:1",
  category: "Test",
  date: 2025-10-12T17:50:04.369Z
}
[4] Editing expense with negative cost...
[4] Expected error: totalCost must be greater than 0
[4] Editing expense with new title and cost...
[4] Edited expense ID: 0199d98b-3a51-745b-ab94-38f58855abed
[4] Initial expense: {
  title: "Edit two",
  totalCost: 150,
  group: "group:1",
  category: "Test",
  date: 2025-10-12T17:50:04.369Z
}
[4] Cleaning up by deleting initial expense...
----- post-test output end -----
  Test Case #4: Many Edits ... ok (123ms)
💰 ExpenseConcept - create, edit, delete, and retrieve expenses ... ok (1s)

```
