# Console Log for Debt
```
--------------- 💵 DebtConcept - full workflow and edge cases 💵--------------- ...
  Test Case #1: Full debt workflow ...
------- output -------
[1] Creating Debts between Alice, Bob, Charlie...
[1] Updating debts.. Bob gives Alice 30. Charlie gives Alice 60
[1] Debts: Alice owes Bob: 30, Alice owes Charlie: 60
[1] Checking directionality... Bob owes Alice: -30, Charlie owes Alice: -60
[1] Updating debts.. Alice gives Charlie back 100
[1] Debts: Alice owes Bob: 30, Alice owes Charlie: -40
----- output end -----
  Test Case #1: Full debt workflow ... ok (354ms)
  Test Case #2: Creating Duplicate Debts and Deleting Debts ...
------- output -------
[2] Attempted duplicate debt creation (userA: bob, userB: alice), got an error as expected: Debt already exists between these users.
[2] Deleting Alice and Bob's debt...
[2] Attempting to create a debt between Alice and Bob again...
[2] Successfully created debt: Bob owes Alice: 0
----- output end -----
  Test Case #2: Creating Duplicate Debts and Deleting Debts ... ok (107ms)
  Test Case #3: Querying non-existent debt ...
------- output -------
[3] Querying non-existent debt returns error as expected: Debt does not exist between these users.
[3] Deleting debt between Bob and Charlie...
[3] Updating non-existent debt between Bob and Charlie, got error as expected: Debt does not exist between these users.
----- output end -----
  Test Case #3: Querying non-existent debt ... ok (74ms)
--------------- 💵 DebtConcept - full workflow and edge cases 💵--------------- ... ok (1s)
```
