---
timestamp: 'Sat Oct 11 2025 13:53:25 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_135325.9601be92.md]]'
content_id: 3c4ee88ba03e5862e03d1cd39d5a8b3769ca87cad2f03a12a4f8a59ac14de21c
---

# trace:

This trace demonstrates the operational principle of creating an expense and then editing it.

1. **Create an expense:** The `createExpense` action is called with all necessary parameters. This includes the creator, payer, title, category, date, total cost, group, and a debt mapping for two other users. The action should successfully create a new expense record in the `Expense.expenses` collection. The `_id` of the newly created expense is returned.

2. **Edit the expense:** The `editExpense` action is called, referencing the `_id` of the expense created in step 1. Specific fields are updated: the `description` is added, the `totalCost` is increased, and the `debtMapping` is adjusted to reflect the new total cost and distribution. The `editor` (who is also the `creator` in this case) is provided. The action should find the existing expense and update its fields. The `_id` of the edited expense (which should be the same as the original) is returned.

3. **Verification:** After these actions, we would query the `Expense.expenses` collection for the expense using its `_id`. We would then assert that the `description`, `totalCost`, and `debtMapping` fields now contain the values provided in the `editExpense` call, while other fields that were not intended to be changed (like `title`) remain as they were initially.

This trace covers the core "create then edit" flow, demonstrating state modification through the concept's actions.
