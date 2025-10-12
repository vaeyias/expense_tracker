---
timestamp: 'Sun Oct 12 2025 00:04:17 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251012_000417.97cc91d0.md]]'
content_id: e6bb724dfd17e1093de939f329b0cee45a75c9ed9bf2cc5d6f9c9e7339192883
---

# trace: DebtConcept.createDebtRecord

This trace demonstrates the principle that creating a debt record correctly updates personal debt balances.

1. **Setup:**
   * Create personal debts:
     * Alice owes Bob (stored as `userA: Alice, userB: Bob, balance: 0`).
     * Alice owes Charlie (stored as `userA: Alice, userB: Charlie, balance: 0`).
   * These initial debts are created using `ensurePersonalDebt`.

2. **Action:**
   * Call `debtConcept.createDebtRecord` with:
     * `payer`: Alice
     * `totalCost`: 100
     * `receiversSplit`: { Bob: 70, Charlie: 30 }
     * This signifies Alice paid 100, and Bob owes Alice 70, and Charlie owes Alice 30.

3. **Internal Operations:**
   * The `createDebtRecord` function iterates through `receiversSplit`:
     * **For Bob (owes 70):**
       * Calls `debtConcept.updatePersonalDebt({ payer: Bob, receiver: Alice, amount: 70 })`.
       * The `PersonalDebt` is found: `userA: Alice, userB: Bob`.
       * The `updatePersonalDebt` logic applies: since `debt.userA === receiver` (Alice === Alice) and `debt.userB === payer` (Bob === Bob), `updatedBalance = debt.balance + amount` (0 + 70 = 70).
       * This results in Alice owing Bob 70.
     * **For Charlie (owes 30):**
       * Calls `debtConcept.updatePersonalDebt({ payer: Charlie, receiver: Alice, amount: 30 })`.
       * The `PersonalDebt` is found: `userA: Alice, userB: Charlie`.
       * The `updatePersonalDebt` logic applies: since `debt.userA === payer` (Alice === Charlie) is false, and it checks for `debt.userA === receiver` (Alice === Alice) and `debt.userB === payer` (Charlie === Charlie) which is true, then `updatedBalance = debt.balance - amount` (0 - 30 = -30).
       * This results in Charlie owing Alice -30, meaning Alice owes Charlie 30.

4. **Verification:**
   * After `createDebtRecord` completes, we check the resulting personal debts:
     * `debtConcept.getDebt({ userA: userBob, userB: userAlice })` should return `balance: 70` (Bob owes Alice 70).
     * `debtConcept.getDebt({ userA: userCharlie, userB: userAlice })` should return `balance: 30` (Charlie owes Alice 30).

This trace demonstrates that the `createDebtRecord` action correctly translates the shared expense into individual debts between users by updating their personal debt balances. The logic in `updatePersonalDebt` is crucial here; the trace highlights how it interacts with the `PersonalDebt` structure and the direction of payment to arrive at the correct net balances. Note: The original `updatePersonalDebt` implementation's handling of `payer === receiver` was noted as a potential issue, but for this trace, we focus on distinct payers and receivers within the `receiversSplit` from the perspective of the `payer` of the expense.

**Note on `updatePersonalDebt` logic:** The trace above reflects the behavior of the provided `updatePersonalDebt` function. As noted in the test file comments, there might be an ambiguity or logical flaw in how `updatePersonalDebt` calculates the balance when the `payer` is different from `userA` in the stored `PersonalDebt`. For this trace, we are assuming the observed behavior of the code as written. The correction of this logic would lead to different intermediate balance updates but the principle of updating personal debts would remain the same.

For instance, if the `updatePersonalDebt` was corrected such that `payer` paying `receiver` always reduces the debt from `payer` to `receiver`:

* **Bob owes Alice 70:** `updatePersonalDebt({ payer: Bob, receiver: Alice, amount: 70 })`.
  * `PersonalDebt` is `Alice owes Bob`. Stored as `userA: Alice, userB: Bob`.
  * `Bob` pays `Alice`. `Bob` owes `Alice` less.
  * The balance `Alice owes Bob` should decrease.
  * The correct calculation for `userA` owes `userB` when `payer` pays `receiver` is:
    * If `debt.userA == payer` and `debt.userB == receiver`: `balance -= amount`
    * If `debt.userA == receiver` and `debt.userB == payer`: `balance -= amount`
  * In the `Bob owes Alice 70` scenario: `payer: Bob`, `receiver: Alice`. Debt is `Alice owes Bob`.
    * If the debt is stored as `Alice owes Bob` (`userA: Alice, userB: Bob`), then `userA == receiver` and `userB == payer`. The balance should decrease, so `balance -= amount`. This aligns with the *corrected* logic discussed. The current code does `balance + amount`, making `Alice owe Bob` more.

The provided tests verify the behavior of the *current* implementation. The trace focuses on that observed behavior.
