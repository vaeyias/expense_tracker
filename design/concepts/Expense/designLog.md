# Expense Design Log

## Draft #1: Expense with Users
Based on the feedback from Assignment 2, I merged the expense aspects of my PersonalExpenseTracker and GroupExpenseTracker concepts into one Expense concept that keeps track of all expenses. I used an LLM to help with this:
 [LLM Concept](../../../context/design/brainstorming/expense_concept_brainstorm.md/steps/concept.8c8b9306.md)
-> [Manually Modified Concept](../../../context/design/concepts/Expense/Expense.md/steps/concept.811ad7ba.md)

I then used LLM to help me implement the concept, but I noticed that the LLM did not include any validation of the requirements that were specified in the conept specification:
[LLM implementation](../../../context/design/concepts/Expense/implementation.md/steps/response.b69c987d.md) ->
[Manually Fixed Implementation](../../../context/design/concepts/Expense/implementation.md/steps/_.79e37ee7.md)


Then, generated a test file: [LLM Test File](../../../context/design/concepts/Expense/testing.md/steps/response.3c927e51.md)

I did some styling changes to make it more readable. I edited some test cases that I thought were not meaningful. Additionally, I noticed the LLM implemented a helper function that was never used so it was removed: [modified test file](../../../context/design/concepts/Expense/testing.md/steps/_.68ae5135.md)

The last change I made to the implementation and test files were returning errors instead of throwing errors:
[test file](../../../context/design/concepts/Expense/testing.md/steps/_.c2c0de5a.md), [implementation file](../../../context/design/concepts/Expense/implementation.md/steps/_.7b4475ef.md)

## Draft #2: Expense WITHOUT Users

After rereading the feedback I got, I realized that I missed a big point in my feedback: it would be better for my Expense concept to have no knowledge of Users and just focus on the item and cost. My Debt concept will take care of cost splitting/debts among users. I had  trouble entirely separating Expenses and Debts because when a user views an expense, the program needs to be able to immediately retrieve the debts/splits associated with an expense.

I revised my concept and implementation with this idea:
[concept](../../../context/design/concepts/Expense/Expense.md/steps/concept.b47a8368.md), [implementation]()
