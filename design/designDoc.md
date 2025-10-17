# Design Log and Reflections!

## Index

**In this file, I note major changes to my concepts and record interesting moments!**

**Design Logs for Specific Concepts**

- [Expense Design Log](concepts/Expense/designLog.md)

- [Debt Design Log](concepts/Debt/designLog.md)

- [Group Design Log](concepts/Group/designLog.md)

- [Folder Design Log](concepts/Folder/designLog.md)

- [User Design Log](concepts/User/designLog.md)


## Major Design Changes from Assignment 2

- In Assignment 2, I had a PersonalExpenseTracker concept and GroupExpenseTracker concept. In this iteration, I merged the two concepts into a single Expense concept and introduce a new indepedent Group concept for handling user groupings:
  - Expense Concept
  - Group Concept
- As per the feedback, I will not be implementing the Friendship concept as it is not too essential to the core functionailty of my app
- To narrow the project scope as recommended, I have chosen to implement the Folder concept instead of both Folder and Budget concepts.
- In Assignment 2, I did not explicit define my User concept. In my implementation here, I implement a User concept.
- *See concept-specific design logs for other design changes.*

## Interesting Moments

### 1. LLM Concept Implementation Throwing Errors Instead of Returning Them
- When implementing the `Group` concept, the LLM's generated code kept throwing errors instead of returning the rror messages, even though the background document explicitly specified otherwise.
- So, to fix this, I had to create a separate error-handling background document that clearly stated to return errors instead of throwing.
- However, this caused a lot of return type errors because now the return type of the actions could be of type { error:string }. So I added more to the document specifying how to handle return types for these errors.
- This revealed that simply stating something in the background document isn’t always sufficient for the LLM to follow. Some parts may need to be emphasized.
- **Snapshots:**
  - [Initial implementation response](../context/design/concepts/Group/implementation.md/steps/response.d2658328.md)
  - [Error-handling background document](../context/design/background/error-handling.md/steps/_.context/design/background/error-handling.md/steps/_.6bcaafd9.md)
  - [Revised implementation response](../context/design/concepts/Group/implementation.md/steps/response.423f9afa.md)

---

### 2. Single PersonalDebt per Pair (Directionality Bug)
- I originally planned to create two `PersonalDebt` records per pair of users (one where A owes B and one where B owes A). The LLM suggested a simpler approach: one record with positive/negative balances. During testing, I found a directionality bug where modifying a `DebtRecord` updated the balance in the opposite direction
- These test cases revealed subtle logic errors that only surfaced under test conditions and highlighted the importance of bidirectional thinking in balance updates.
- A single-record design simplifies data storage but requires careful, logic and comprehensive test coverage to ensure accuracy.
- **note** this moment came before redesigning my `Debt` concept when `DebtRecord` was still part of my `Debt` conept
- **Snapshots:**
  - [Test output before fix](../context/design/concepts/Debt/outputLog.md/steps/_.3c877b75.md)
  - [Test output after fix](../context/design/concepts/Debt/outputLog.md/steps/_.80284904.md)

---

### 3. LLM Type Issues
- One of the most persistent issues with the generated code was type errors, especially when dealing with potententially undefined values (eg. after an await call) or when a type could also be an error (eg. Promise<{user: User} | {error: string}>).
- This was mostly an issue with generating the test file and it is very tedious to fix every type error.
- So, I decided to add another background document to tell the LLM how to To address this, I created an additional type-handling background document to guide the LLM on how to narrow types correctly after await calls, avoid direct property access on potentially undefined values, and properly check and unwrap the return types.
- This effectively reduced the frequency of type erros in the generated implementations and made the code easier to work with.
- Snapshot
  - [type-handing document](../context/design/background/type-handling.md/steps/_.5bd11313.md)
  - [Folder Tests Before](../context/design/concepts/Folder/testing.md/steps/file.7a87dacf.md)
    - type errors from not explicitly casting types
  - [Folder Tests After](../context/design/concepts/Folder/testing.md/steps/file.741311dd.md)
    - no type errors from calling functions
---
### 4. Expense and Debt Design Simplification
- Initially, my `Expense` concept handled both tracking and splitting costs.
- After Assignment 2 feedback, I refactored the design to move all cost-splitting logic into `Debt`, leaving `Expense` responsible only for recording items and their costs. This required significant restructuring.
- However, while implementing these changes, I had trouble reasoning why cost splitting was in Debt instead of Expense because the logic heavily depended on actions in Expense. After getting help with these concepts in OH, I decided to move cost-splitting logic to my Expense concept with some improvements to draft #1 such as the addition of a new state variable: set of UserSplits that represents one user's split of the expense. This improved my concept because I didn't have to pass in a Map of Users to the amount they owed for an expense in the createExpense/editExpense actions. Storing the splits as separate components separated a lot of the logic that made my createExpense/editExpense quite complicated and made handling the splits a lot cleaner.
- **Snapshots:**
  - [Debt concept draft #1](../context/design/concepts/Debt/initialConcept.md/steps/_.f5ae342d.md)
  - [Debt concept draft #2](../context/design/concepts/Debt/Debt.md/steps/concept.b99abe8d.md)
  - [Debt concept draft #3](../context/design/concepts/Debt/Debt.md/steps/concept.36930f55.md)
  - [Expense concept draft #1](../context/design/concepts/Expense/Expense.md/steps/concept.811ad7ba.md)
  - [Expense concept draft #2](../context/design/concepts/Expense/Expense.md/steps/concept.b47a8368.md)
  - [Expense concept draft #3](../context/design/concepts/Expense/Expense.md/steps/concept.9a4d8404.md)

- *for more details, see [Expense Design Log](concepts/Expense/designLog.md)*

---

### 5. Using Example Test Case Files as Templates
- After getting the LLM to implement the test cases for my first concept, I heavily edited the test files to log more meaningful statements and make the styling of the logs easier to read.
- I didn't want to manually edit these style choices for future test codes generated by the LLM. So, I attempted to give the LLM an example test file for it to closely follow and it ended up working quite well!
- Snapshots
    - [test-template](../context/design/background/test-template.md/steps/_.c1a67ee1.md)
    - [generated test code using template](../context/design/concepts/Folder/testing.md/steps/file.56ee342f.md)


### 6. Simplifying `Expense` actions with a Two-Step Flow
- A problem I encountered was figuring out a way to validate that all the splits of an expense added up to the totalCost of an expense without passing complex objects or lists into my createExpense/editExpense actions.
- My solution was to make `createExpense` initialize an empty Expense (with default details like totalCost=0, userSplits=[]), and then use `addUserSplit` and `removeUserSplit` actions to update it.
- Validation now happens in `editExpense`, where I check that all userSplits add up to the totalCost of the Expense before allowing an edit to the expense.
- This design simplification resolved both technical complexity and type-safety issues while preserving the validation logic.
- I had a lot of trouble figuring out a solution to the issue of keeping all my arguments in actions primitive, but after creating the new state variable UserSplit (explained in interesting moment #4), I gained a different perspective on the issue and I was able to come up with this solution.
- **Snapshots:**
  - [Expense concept before](../context/design/concepts/Expense/Expense.md/steps/concept.d9175486.md)
  - [Expense concept after](../context/design/concepts/Expense/Expense.md/steps/concept.4c331251.md)
