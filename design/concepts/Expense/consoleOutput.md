```
-------------- 💰 ExpenseConcept - create, edit, validate, and query 💰 --------------- ...
  Test Case #1: Full Expense Lifecycle ...
------- post-test output -------

[1.1] Creating an initial expense (default values)...
Expense Details: title=, totalCost=$0, numSplits=0
[1.2] Alice's split for this expense is $10, adding her split...
[1.3] Bob's split for this expense is $40, adding this split...
[1.4] Updating expense with both splits and totalCost = $50...
[1.4] ✅ Edited expense successfully
Expense Details: title=Groceries Week 2, totalCost=$50, numSplits=2
   ↳ User Splits:
      user=user:Alice, amount=$10
      user=user:Bob, amount=$40
[1.5] Deleting Alice's split...
[1.5] ✅ Removed Alice split ID: 0199efd4-9135-72d8-a625-69d4b593a239
Expense Details: title=Groceries Week 2, totalCost=$50, numSplits=1
   ↳ User Splits:
      user=user:Bob, amount=$40
[1.6] Editing Bob's split to $50...
[1.6] ✅ Bob split updated
Expense Details: title=Groceries Week 2, totalCost=$50, numSplits=1
   ↳ User Splits:
      user=user:Bob, amount=$50
[1.7] Deleting expense...
[1.7] Deleted expense ID: 0199efd4-90de-7e3f-a5f6-a29297525e58
----- post-test output end -----
  Test Case #1: Full Expense Lifecycle ... ok (500ms)
  Test Case #2: Invalid Splits ...
------- post-test output -------

[2.1] Creating an expense...
[2.1] ✅ Created expense ID: 0199efd4-92d2-7e1b-adf1-759a22623e83
[2.2] Trying to add a negative split...
[2.2] Got error as expected: amountOwed must be >= 0
[2.3] Creating a $10 split in the expense for Alice...
[2.3] ✅ Alice's split created: 0199efd4-9305-7662-918e-4635d81fcee5
[2.3] Updating expense with split and totalCost = $10...
Expense Details: title=, totalCost=$10, numSplits=1
   ↳ User Splits:
      user=user:Alice, amount=$10
[2.4] Trying to add another split for Alice to the same expense...
[2.4] Got error as expected: User already has a split in this expense
----- post-test output end -----
  Test Case #2: Invalid Splits ... ok (215ms)
  Test Case #3: Invalid Expenses ...
------- post-test output -------

[3.1] Creating expense with two splits...
Expense Details: title=, totalCost=$50, numSplits=2
   ↳ User Splits:
      user=user:Alice, amount=$20
      user=user:Bob, amount=$30
[3.2] Trying to edit totalCost to 60 (splits don't add up to 60)...
[3.2] Got error as expected: Sum of splits amounts must equal total cost
[3.3] Trying to remove Bob's split while keeping totalCost=50...
[3.3] Got error as expected: Sum of splits amounts must equal total cost
----- post-test output end -----
  Test Case #3: Invalid Expenses ... ok (361ms)
  Test Case #4: Querying Data ...
------- post-test output -------

[4.1] Creating expense with two splits...
Expense Details: title=, totalCost=$50, numSplits=2
   ↳ User Splits:
      user=user:Bob, amount=$20
      user=user:Alice, amount=$30
[4.2] Getting expenses by group...
[4.2] ✅ Group group:1 has 3 expenses
[4.3] Getting splits by expense ID...
[4.3] ✅ Retrieved splits for expense: [
  {
    user: "user:Bob",
    amountOwed: 20,
    id: "0199efd4-9547-798b-843e-e1a2eb57b8cb"
  },
  {
    user: "user:Alice",
    amountOwed: 30,
    id: "0199efd4-958e-73fe-8743-9bee929e0e5e"
  }
]
----- post-test output end -----
  Test Case #4: Querying Data ... ok (295ms)
--------------- 💰 ExpenseConcept - create, edit, validate, and query 💰 --------------- ... ok (1s)
```
