# Design Log

## Major Design Changes from Assignment 2

- In Assignment 2, I had a PersonalExpenseTracker concept and GroupExpenseTracker concept. In this iteration, I merged the two concepts into a single Expense concept and introduce a new indepedent Group concept for handling user groupings:
  - Expense Concept
  - Group Concept
- As per the feedback, I will not be implementing the Friendship concept as it is not too essential to the core functionailty of my app
- To narrow the project scope as recommended, I have chosen to implement the Folder concept instead of both Folder and Budget concepts.

## Index

### Design Logs for Concepts

[Expense Design Log](concepts/Expense/designLog.md)

[Group Design Log](concepts/Group/designLog.md)

[Debt Design Log](concepts/Debt/designLog.md)

[Folder Design Log](concepts/Folder/designLog.md)



## Interesting Moments

**LLM Concept Implementation Throwing Errors Instead of Returning Errors**

With the given background documents the LLM, the generated implementation of concepts kept throwing errors instead of returning errors:
[implementation response](../context/design/concepts/Group/implementation.md/steps/response.d2658328.md)

I read through the background documents and saw that it did specify to return errors instead of throwing, but the LLM was not following this for some reason. So, I created a [error-handling background document](../context/design/background/error-handling.md/steps/_.ddfc69db.md), emphasizing to return errors with error messages and the LLM implemented the concept with returning errors:  [new implementation response](../context/design/concepts/Group/implementation.md/steps/file.d7654bc5.md)


However, this was not sufficient because this caused a lot of type errors because of the new return type. So, I specified how to handle this in the error-handling document and the LLM was able to implement the concept with no type errors:
[error-handling document](../context/design/background/error-handling.md/steps/_.6bcaafd9.md), [generated implementation](../context/design/concepts/Group/implementation.md/steps/response.423f9afa.md)

**Expense/Debt Design Simplification**

I think the biggest realization I had was when I was designing the concepts for Expense and Debt. At first, I viewed Debt as just recording debts between two users and Expense as the concept that recorded the details of a purchase, who paid, who owes who what. After I implemented Expense, I realized that if I separate users from the expense, I would gain better modularity and flexibility. I avoided this at first because I was thinking about the simplicity of reading everything from one object when displaying an Expense object (eg. the item, cost, who paid, who owes what all at once). However, I figured out that I could easily retrieve this information by referencing the expense in the Debt object.

This is my concept and implementation of Expense before the big change:


This is my concept and implementation after:
[concept](), [implementation]()
