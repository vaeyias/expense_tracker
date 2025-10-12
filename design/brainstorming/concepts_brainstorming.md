[@concept-design-overview](../background/concept-design-overview.md)

[@concept-specifications](../background/concept-specifications.md)


# Debt Concept
```
concept Debt
    purpose calculate and tracks debts between two users.
    principle After a debt is created.
    state
        a set of Debts
          a payer User
          a totalCost Number
          an expense Expense
          a debtMapping Map<User:Number>

    actions
        createDebt(payer: User, totalCost: Number, debtMapping: Map<User:Number>): (debt: Debt)
            requires payer exists, totalCost > 0, all numbers in debtMapping are nonnegative and sum to totalCost
            effect creates a new debt record

        updateDebt(payer: User, receivers: Map<User, Number>, group: Group)
            requires payer and receivers are members of group, all numbers in receivers are nonnegative
            effect for each receiver, adjusts the debt balance between payer and receiver by their share

        settleDebt(payer: User, receiver: User, group: Group, amount: Number)
            requires debt between userA and userB exists
            effect recalculates and returns the amount that the payer owes the receiver after the amount is paid to the receiver.

        getDebt(userA: User, userB: User, group: Group): (balance: Number)
            requires debt exists
            effect returns net balance between userA and userB
```

# concept: Expense

* **purpose**: Allows users to record, manage, and track expenses.
* **principle**: Users create expenses with details like title, description, date, and cost. Then users can edit the expense's details or delete the expense entirely.
* **state**:
  * `a set of Expenses`
    * `a title String`
    * `a description String (optional)`
    * `a category String`
    * `a totalCost Number`
    * `a date Date`
    * `a group Group`
* **actions**:
  * `createExpense(user: User, title: String, category: String, date: Date, totalCost: Number, description: String optional, group: Group): (expense: Expense)`
    * `requires payer exists, user is in the given group, totalCost > 0`
    * `effect creates an Expense with the given details`
  * `editExpense(expenseToEdit: Expense, title: String optional, description: String optional, category: String optional, totalCost: Number optional, date: Date optional): (newExpense: Expense)`
    * `requires expenseToEdit exists, totalCost>0`
    * `effect updates the Expense with the given details.`
  * `deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)`
    * `requires expenseToDelete exists.`
    * `effect deletes the Expense.`

help me come up with the concept specifications for expense and debt. evaluate the quality of my concepts.

# response:

Let's evaluate your `Expense` and `Debt` concept specifications and then refine them.

## Evaluation of Your Concepts

### Expense Concept

**Strengths:**

*   **Clear Purpose:** The purpose "Allows users to record, manage, and track expenses" is direct and understandable.
*   **Well-Defined Principle:** The principle "Users create expenses with details like title, description, date, and cost. Then users can edit the expense's details or delete the expense entirely" captures the core lifecycle of an expense.
*   **Relevant State:** The state components (title, description, category, totalCost, date, group) are appropriate for an expense.
*   **Logical Actions:** `createExpense`, `editExpense`, and `deleteExpense` are essential actions for expense management.
*   **Basic Preconditions:** The preconditions for `createExpense` and `editExpense` are reasonable starting points.

**Areas for Improvement:**

*   **User Involvement in Creation:** The `createExpense` action takes a `user: User` argument. While it's good that the user is involved, the purpose is about recording *expenses*, not just tracking who created them. The concept of "payer" is implicitly present in `Debt` but not explicitly in `Expense`. This might be a deliberate choice, but it's worth considering if the expense itself *has* a payer.
*   **Group Association:** The `group: Group` in the state and action is good for shared expenses, but the interaction between `Expense` and `Debt` isn't explicitly defined through this. This is where synchronizations will be crucial.
*   **Description Optionality:** Marking `description` as `String optional` in the action is fine, but in the state, it's just `String`. It should be consistent (e.g., `String?` or `String (optional)`).
*   **Action Naming for Editing:** `editExpense` is a bit generic. It's good that it takes optional arguments, but the return type `(newExpense: Expense)` implies a new expense is created, rather than the existing one being modified. This is a common distinction in some specification styles, but it's worth being precise.
*   **System vs. User Actions:** All actions are implicitly user actions. This is fine for now, but keep in mind that some aspects (like perhaps automatic categorization or currency conversion if implemented) could become system actions.
*   **Completeness:** Does `Expense` itself need to do more than just record and edit? For example, if an expense is linked to a debt, how does that affect the expense? This hints at the need for composition.

### Debt Concept

**Strengths:**

*   **Clear Purpose:** "calculate and tracks debts between two users" is concise and accurate.
*   **Meaningful Principle:** "After a debt is created." is a starting point, but it's **very weak**. It doesn't explain *how* the purpose is achieved or what makes this concept distinct.
*   **Relevant State Components:** `payer`, `totalCost`, `expense` (though it's not clear if this is a reference to an `Expense` concept or a generic `Expense` object), and `debtMapping` are relevant.
*   **Action Intent:** `createDebt`, `updateDebt`, `settleDebt`, and `getDebt` clearly indicate the core functionalities of debt management.

**Areas for Improvement:**

*   **Weak Principle:** This is the most significant issue. The principle needs to demonstrate the core value proposition of the `Debt` concept. What is the "archetypal scenario" that shows *why* this concept exists and how it fulfills its purpose?
*   **State Richness and Ambiguity:**
    *   `a set of Debts`: This implies `Debt` is a set of something. It would be better to define the `Debt` object itself within the state.
    *   `a payer User`: This implies each "debt" in the set has one payer. This aligns with `createDebt` and `updateDebt`.
    *   `totalCost Number`: Is this the total cost of the debt itself, or the outstanding balance?
    *   `an expense Expense`: This is ambiguous. Is `Expense` a concrete object, or a reference to an `Expense` concept's state? If it's a reference, it should be `Expense` (the concept) or an identifier of an expense. If the debt is *for* an expense, the `Expense` concept should probably link to the `Debt` concept, or vice-versa.
    *   `a debtMapping Map<User:Number>`: This is good for representing who owes what.
*   **Action Clarity and Completeness:**
    *   `createDebt`: The `debtMapping` argument is good. The `requires` clause is decent, but the `effect` is just "creates a new debt record." This is very brief.
    *   `updateDebt`: This action has a `group: Group` argument but it's not in the state. The `receivers: Map<User, Number>` seems to imply who is *receiving* money, but `updateDebt` sounds more like updating an existing debt's balance. The current signature suggests creating a *new* set of receiver amounts, which might not be the intent of "update." The `effect` is also a bit vague.
    *   `settleDebt`: This is a good addition, but `group: Group` again. The `effect` is about recalculating and returning the amount. This sounds more like a query or a specific type of update.
    *   `getDebt`: This is a query, not an action that modifies state. It should be specified as a query.
*   **Concept Independence and Composition:** The `Debt` concept mentions `Expense`, but it's unclear how they are linked. This is a prime area for synchronization.
*   **No Explicit Type Parameters:** Like `Expense`, `Debt` could benefit from type parameters if `User`, `Group`, `Expense` are externally defined types.

## Proposed Concept Specifications with Improvements

Let's refine these. We'll assume `User` and `Group` are defined elsewhere and are polymorphic types if needed. We'll also introduce a `Money` type for clarity.

### Refined Expense Concept

```
concept Expense [User, Group]
    purpose record and track financial expenses, often shared within a group.
    principle When a user creates an expense, it is recorded with its details. Later, this expense can be edited to correct information or deleted if no longer needed.
    state
        a set of Expenses
            an identifier Expense // A unique ID for this expense
            a creator User // The user who created this expense
            a title String
            a description String? // Optional description
            a category String
            a totalCost Money // Use a dedicated Money type
            a date Date
            a group Group // The group this expense belongs to

    actions
        createExpense(creator: User, title: String, category: String, date: Date, totalCost: Money, group: Group, description: String? = null): (expense: Expense)
            requires creator exists and is a member of the group, totalCost > 0
            effects
                let newExpenseId be a fresh identifier
                create an Expense with identifier newExpenseId, creator, title, category, date, totalCost, group, and description.
                return newExpenseId

        editExpense(expenseToEdit: Expense, title: String? = null, description: String? = null, category: String? = null, totalCost: Money? = null, date: Date? = null): (editedExpense: Expense)
            requires expenseToEdit exists, if totalCost is provided then totalCost > 0
            effects
                update expenseToEdit:
                    if title is provided, set expenseToEdit.title = title
                    if description is provided, set expenseToEdit.description = description
                    if category is provided, set expenseToEdit.category = category
                    if totalCost is provided, set expenseToEdit.totalCost = totalCost
                    if date is provided, set expenseToEdit.date = date
                return expenseToEdit

        deleteExpense(expenseToDelete: Expense): (deletedExpense: Expense)
            requires expenseToDelete exists
            effects
                remove expenseToDelete from the set of Expenses.
                return expenseToDelete

    queries
        // Optional: A query to retrieve all expenses for a specific group.
        expensesForGroup(g: Group): (expenses: Set<Expense>)
            effects return all expenses in the state where expense.group = g

        // Optional: A query to retrieve details of a specific expense.
        getExpenseDetails(e: Expense): (details: ExpenseDetails) // ExpenseDetails could be a record/struct
            effects return details of expense e
```

**Explanation of Changes for `Expense`:**

*   **Type Parameters:** Added `[User, Group]` for flexibility.
*   **Purpose:** Slightly rephrased for clarity.
*   **Principle:** Improved to be more descriptive of the lifecycle.
*   **State:**
    *   Introduced `identifier Expense` for unique identification.
    *   Made `description` optional (`String?`).
    *   Used `Money` for `totalCost` (assuming it's a distinct type).
    *   Explicitly stated `creator User` and `group Group`.
*   **Actions:**
    *   `createExpense`: `description` is now optional with a default `null`. The return type is the `Expense` identifier, which is more standard for creation actions.
    *   `editExpense`: Arguments are now optional (`String? = null`) to allow partial edits. Returns the `editedExpense` itself.
    *   `deleteExpense`: Returns the deleted expense, which is common.
*   **Queries:** Added optional queries for common retrieval patterns.

### Refined Debt Concept

This is where the real challenge lies, as `Debt` needs to relate to `Expense` and `User`. We'll make `Debt` primarily about tracking balances *between users*, and link it to `Expense` via synchronization.

```
concept Debt [User, Group]
    purpose calculate and tracks net financial balances between users within groups.
    principle When an expense occurs within a group, if the expense is not paid by everyone equally, the `Debt` concept tracks who owes whom and allows for settlement.
    state
        // Represents outstanding balances between any two users within any group.
        // A positive balance from UserA to UserB means UserA owes UserB.
        a set of Balances
            a userA User
            a userB User
            a group Group
            a balance Money // Positive means userA owes userB, Negative means userB owes userA

    actions
        // This action is typically triggered by synchronizations from Expense creation.
        // It's not meant to be called directly by users to create a debt from scratch.
        // Instead, it represents the adjustment of balances due to a new expense or payment.
        adjustBalance(userA: User, userB: User, group: Group, amount: Money): (updatedBalance: Money)
            requires userA != userB
            effects
                // Find or create the balance record between userA and userB in the specified group.
                // Add 'amount' to the balance where userA is the 'debtor' (userA owes more to userB).
                // If amount is positive, userA owes userB. If negative, userB owes userA.
                // The balance stores how much userA owes userB.
                // So, if userA owes userB $10 (amount = +10), we add 10 to their balance.
                // If userB owes userA $10 (amount = -10), we subtract 10 from their balance (which is equivalent to userA owing userB -10).
                let currentBalance = find_balance(userA, userB, group)
                let newBalance = currentBalance + amount
                update or create the balance record for userA, userB, group with newBalance
                return newBalance


        settleDebt(userA: User, userB: User, group: Group, amount: Money): (remainingBalance: Money)
            requires amount > 0 and userA != userB
            effects
                // This action is for a user paying another user directly to settle a debt.
                // UserA pays UserB 'amount'. This reduces what UserA owes UserB.
                // So, we subtract 'amount' from the balance where userA owes userB.
                let currentBalance = find_balance(userA, userB, group)
                let newBalance = currentBalance - amount
                update or create the balance record for userA, userB, group with newBalance
                // Note: In a real system, this would also trigger a payment transaction.
                return newBalance

    queries
        // Returns the net balance from userA's perspective towards userB within a group.
        // A positive number means userA owes userB. A negative number means userB owes userA.
        getNetBalance(userA: User, userB: User, group: Group): (balance: Money)
            requires userA != userB
            effects
                let balanceAtoB = find_balance(userA, userB, group) // Amount userA owes userB
                let balanceBtoA = find_balance(userB, userA, group) // Amount userB owes userA
                return balanceAtoB - balanceBtoA // Net balance from A to B

        // Returns the total amount a user owes to all others in a group.
        totalOwedBy(user: User, group: Group): (total: Money)
            requires user exists in group
            effects
                let total = 0
                for each otherUser in group where otherUser != user:
                    let balance = getNetBalance(user, otherUser, group)
                    if balance > 0: // If user owes otherUser
                        total = total + balance
                return total

        // Returns the total amount a user is owed by all others in a group.
        totalOwedTo(user: User, group: Group): (total: Money)
            requires user exists in group
            effects
                let total = 0
                for each otherUser in group where otherUser != user:
                    let balance = getNetBalance(otherUser, user, group)
                    if balance > 0: // If otherUser owes user
                        total = total + balance
                return total

```

**Explanation of Changes for `Debt`:**

*   **Type Parameters:** `[User, Group]` for flexibility.
*   **Purpose:** Emphasizes *net balances* and *within groups*.
*   **Principle:** Significantly improved to describe a scenario involving expenses and how debts arise.
*   **State:**
    *   Simplified to a `set of Balances`. Each `Balance` record explicitly stores the two users involved, the group, and the `Money` balance *from the perspective of `userA` to `userB`*. This avoids redundancy and ambiguity. A positive `balance` means `userA` owes `userB`.
    *   Removed `payer`, `totalCost`, and `expense` as direct state components of a `Debt` object itself, as these are better handled by `Expense` and the logic of `adjustBalance`.
*   **Actions:**
    *   `createDebt` removed: Debts are now implicitly created or updated via `adjustBalance`, which is triggered by external events (like expenses). This promotes independence.
    *   `adjustBalance`: This is the core action for changing debt. It takes an `amount` that represents the net change *from userA to userB*. If a user pays $10 for an expense split equally among 3 people, the person who paid $10 owes the other two $3.33 each. If `userA` paid and `userB` is one of the others, `adjustBalance(userA, userB, group, 3.33)` would be called. If `userA` is the one who *received* money from `userB` (i.e. `userB` paid `userA` $5 more than their share), then `adjustBalance(userB, userA, group, 5)` would be called. The state stores `userA` owes `userB`, so this requires careful calculation before calling.
    *   `updateDebt` removed: Replaced by the more general `adjustBalance`.
    *   `settleDebt`: This action represents a direct payment between two users to reduce their outstanding balance. It reduces the `balance` from `userA` to `userB` by the `amount` paid.
*   **Queries:** Added crucial queries to retrieve net balances and amounts owed, which are essential for the purpose of tracking debts. `getNetBalance` is particularly important for understanding the overall financial picture between two individuals.

## Synchronizations (Conceptual Examples)

Here's how `Expense` and `Debt` would interact using synchronizations:

**Scenario 1: Creating an Expense and Splitting it Equally**

*   **Goal:** When an expense is created, if it's not paid by everyone in the group equally, update the balances of those who owe others.

```
sync UpdateDebtsForEqualSplit
when
    Expense.createExpense(creator: User, title: String, category: String, date: Date, totalCost: Money, group: Group, description: String?) : (expense: Expense)
where
    let numberOfMembers = size(group.members)
    let sharePerPerson = totalCost / numberOfMembers
    let outstandingAmount = totalCost - sharePerPerson // Amount the creator effectively overpaid or underpaid relative to their share
    // This logic assumes the 'creator' is the one who *paid* the totalCost.
    // If the concept of 'payer' is separate, this needs adjustment.

then
    // For each member in the group *other* than the creator, they owe the creator their share.
    // This means the balance from 'member' to 'creator' should increase by 'sharePerPerson'.
    // Conversely, the creator's balance to 'member' should decrease by 'sharePerPerson'.
    // Let's reframe: the totalCost was paid by the creator.
    // The creator is owed 'outstandingAmount' in total.
    // Each other member owes the creator 'sharePerPerson'.
    for each member in group.members where member != creator:
        // The net amount member owes creator is their share.
        // The balance is stored from A to B (A owes B).
        // So, member owes creator 'sharePerPerson'.
        // We need to adjust the balance such that member owes creator.
        // This is equivalent to adding 'sharePerPerson' to the balance from member to creator.
        // Or, subtracting 'sharePerPerson' from the balance from creator to member.
        // Let's assume adjustBalance(payer, receiver, group, amount) means payer owes receiver 'amount'.
        // So, member owes creator 'sharePerPerson'.
        Debt.adjustBalance(userA: member, userB: creator, group: group, amount: sharePerPerson)
```

**Scenario 2: User Settling a Debt**

*   **Goal:** When a user directly pays another user an amount, update their respective balances.

```
sync SettleDirectPayment
when
    // This assumes a "Payment" concept or action that records a direct money transfer.
    // For simplicity, let's imagine a direct action call for now.
    // In a real app, this would likely be a "Payment.recordPayment" action.
    // Let's assume a dedicated action for this purpose outside of Expense/Debt for now.
    // For this example, let's imagine a concept "DirectPayment" with an action:
    // recordDirectPayment(payer: User, receiver: User, group: Group, amount: Money)
    // ... but to keep it within the context of composing Expense and Debt:
    // Let's imagine a conceptual "Payment" action:
    Payment.transfer(payer: User, receiver: User, group: Group, amount: Money)
where
    payer != receiver
    amount > 0

then
    // The payer has paid the receiver. This means the payer owes the receiver less.
    // If balance is A owes B, we reduce the amount A owes B.
    // So, if payer pays receiver 'amount', the balance where payer owes receiver decreases.
    // Thus, we subtract 'amount' from the balance where payer owes receiver.
    Debt.settleDebt(userA: payer, userB: receiver, group: group, amount: amount)
```

**Scenario 3: Editing an Expense that Changes Shares**

*   **Goal:** If an expense is edited such that the total cost or number of people changes, the debts need to be recalculated. This is complex and might require a more sophisticated approach than simple synchronization for every edit. A common pattern is to mark debts as "stale" or to trigger a full recalculation.

For a simpler model, we can assume edits are less frequent or that recalculation is triggered separately.

### Quality of Your Concepts: Debt

*   **Purpose:** Good and clear.
*   **Principle:** **Very Weak.** This is the primary area for improvement. It doesn't demonstrate the value or mechanism of the concept.
*   **State:** Needs significant refinement to be more structured and less ambiguous. The current structure is hard to work with.
*   **Actions:** `createDebt` and `updateDebt` are too high-level and don't clearly define how balances are managed. `settleDebt` and `getDebt` are better, but `getDebt` should be a query.
*   **Independence:** The reliance on `Expense` and the vagueness of that relationship is a concern for independence.

## Key Takeaways for Concept Design

1.  **Strong Principles:** The principle is your narrative. It must clearly demonstrate *how* the concept fulfills its purpose in a typical, archetypal scenario, and what makes it unique.
2.  **Clear State:** State should be unambiguous and directly support the concept's purpose and actions. Avoid vague or overloaded fields.
3.  **Well-Defined Actions/Queries:** Actions should be focused on specific state transitions. Queries should provide valuable, non-trivial observations of the state.
4.  **Leverage Synchronization:** Independence is key. Concepts should not know about each other. Synchronization rules are how they compose. This is where the relationship between `Expense` and `Debt` truly lives.
5.  **Consider Polymorphism:** Use type parameters (`[User, Group]`) where appropriate to make concepts reusable across different contexts.
6.  **Money Type:** For financial concepts, a dedicated `Money` type (handling currency, precision) is crucial to avoid bugs.

By applying these principles, you can create more robust, understandable, and maintainable software designs.