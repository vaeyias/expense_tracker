---
timestamp: 'Sat Oct 11 2025 14:25:36 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_142536.c7a91e4a.md]]'
content_id: dc5f6f41c2c2b469c98b764d0ae9173fec18b741bf63676b03ee629234876cd7
---

# trace:

This trace demonstrates the operational principle of creating an expense, then editing it, and finally verifying its updated state.

1. **`createExpense`**: A new expense is created with specific details including title, category, total cost, date, creator, payer, group, and a debt mapping.
2. **`_getExpenseById`**: The newly created expense is retrieved using its ID to confirm its initial state.
3. **`editExpense`**: The same expense is then edited. This action modifies fields like `totalCost` and `description`, and also updates the `debtMapping`.
4. **`_getExpenseById`**: The expense is retrieved again after the edit operation to verify that the changes have been applied correctly.
5. **`deleteExpense`**: The expense is deleted using its ID.
6. **`_getExpenseById`**: The expense is attempted to be retrieved one last time to confirm that it has been successfully deleted and is no longer present in the database.
