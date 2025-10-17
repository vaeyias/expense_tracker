# Expense Design Log

## Draft #1: Expense with Users
Based on the feedback from Assignment 2, I merged the expense aspects of my PersonalExpenseTracker and GroupExpenseTracker concepts into one Expense concept that keeps track of all expenses. This made my concepts a lot cleaner and modular because PersonalExpenseTracker and GroupExpenseTracker shared a lot of similar ideas. I used an LLM to help with this:
 [LLM Concept](../../../context/design/brainstorming/expense_concept_brainstorm.md/steps/concept.8c8b9306.md)
-> [Manually Modified Concept](../../../context/design/concepts/Expense/Expense.md/steps/concept.811ad7ba.md)


## Draft #2: Expense WITHOUT Users

I also got feedback on Assignment 2 that said it would be better for my Expense concept to have no knowledge of Users and just focus on the item and cost. The feedback said that my Debt concept should take care of cost splitting/debts among users. So, I removed the cost splitting logic from my Expense concept.

I revised my concept and implementation with this idea:
[concept](../../../context/design/concepts/Expense/Expense.md/steps/concept.b47a8368.md), [implementation](../../../context/design/concepts/Expense/implementation.md/steps/_.c228a59c.md)

## Draft #3: Expense WITH Cost Splitting and Users
As I implemented Debt and Expense, I felt like the cost splitting idea heavily relied on/related to the Expense concept and less related to Debt. After getting some more help with my concepts in Office Hours, I reasoned that it would be better to have Expense concept handle cost splitting and Debt just handle Debts between two users. However, unlike Draft #1, the Expense concept will store a set of Expenses and a set of UserSplits to avoid passing in a Map type into the actions (this map was called debtMapping and mapped the user to their split of the expense in Draft #1). This set of UserSplits made my concept a lot cleaner. Additionally, my Debt and Expense concepts were a lot more modular now with cost splitting handled in Expense:

[concept draft #3](../../../context/design/concepts/Expense/Expense.md/steps/concept.9a4d8404.md)

## Problem: Validating that UserSplits add up to totalCost of an Expense
- A problem I encountered was figuring out a way to validate that all the splits of an expense added up to the totalCost of an expense without passing complex objects or lists into my createExpense/editExpense actions.
- My solution was to make `createExpense` initialize an empty Expense (with default details like totalCost=0, userSplits=[]), and then use `addUserSplit` and `removeUserSplit` actions to update it.
- Validation now happens in `editExpense`, where I check that all userSplits add up to the totalCost of the Expense
- This design simplification resolved both technical complexity and type-safety issues while preserving validation logic.
  - [Expense concept before](../context/design/concepts/Expense/Expense.md/steps/concept.d9175486.md)
  - [Expense concept after](../context/design/concepts/Expense/Expense.md/steps/concept.4c331251.md)
