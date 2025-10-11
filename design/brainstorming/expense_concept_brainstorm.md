[@concept-design-overview](../background/concept-design-overview.md)

[@concept-specifications](../background/concept-specifications.md)

[@implementing-concepts](../background/implementing-concepts.md)

concept GroupExpenseTracking
    purpose allows users to record and manage shared expenses within a group
    principle after a group is created, users can add expenses to the group. each expense tracks the payer and the total cost, and how costs are divided between different users
    state
        a set of Groups with
            a name String
            a creator User
            a set of Users
            a set of GroupExpenses

        a set of GroupExpenses
            a title String
            a description String
            a category String
            a totalCost Number
            a payer User
            a date Date
            a debtMapping Map<User:Number>

    actions
        createGroup(groupName: String, creator: User, description: String): (group:Group)
            requires creator exists
            effect creates a new group with the given groupName, the creator, the set of users, the description, and the startDate/endDate set to None.

        leaveGroup(group:Group, user:User):
            requires group exists, user is part of group, and user does not owe/is not owed anything in the group
            effect removes the user from the group

        addUser(user: User, friend: User, group: Group):
            requires user exists, friend exists, group exists, user is in group and is friends with the friend. user is not equal to friend.
            effect adds friend to the group

        removeUser(owner: User, user:User, group:Group)
            requires owner exists, user exists, group exists, owner is in the group and is the owner of the group, user is in the group
            effect removes the user from the group

        addGroupExpense(payer:User, group:Group, title:String, description:String, category:String, totalCost:Number, date:Date, debtMapping:Map<User:Number>): (expense:GroupExpense)
            requires group and payer exist, payer is in group, totalCost > 0, all values in debtMapping are positive and sum to totalCost
            effect creates a GroupExpense with the given details and stores it in the group

        editGroupExpense(payer:User, group:Group, oldExpense:GroupExpense, title:String, description:String, category:String, totalCost:Number, date:Date, debtMapping:Map<User:Number>): (newExpense:GroupExpense)
            requires payer and oldExpense exist, oldExpense is in group, payer is the payer of oldExpense
            effect updates the GroupExpense with the given details

        deleteGroupExpense(payer:User, group:Group, expense:GroupExpense): (expense:GroupExpense)
            requires payer and expense exist, expense is in group, payer is the payer of expense
            effect deletes the GroupExpense from the group

        getGroupSpendingByCategory(group:Group, category:String):(spending:Number)
            requires group exists and contains expenses with the given category
            effect sums the totalCost of all expenses with the given group and category.
concept PersonalExpenseTracking
    purpose allows users to track their own share of expenses, either within a group or individually
    principle each personal expense belongs to a user and records how much they owe or paid for a given item
    state
        a set of PersonalExpenses
            a title String
            a user User
            a payer User
            a group Group
            a category String
            a date Date
            a personalCost Number

    actions
        createPersonalExpense(user:User, payer:User, group:Group, category:String, date:Date, title: String, personalCost:Number): (expense:PersonalExpense)
            requires user, payer, group exist, both user and payer are in the group. personalCost is a positive number.
            effect creates a PersonalExpense with given details

        editPersonalExpense(user:User, oldExpense:PersonalExpense, category:String, date:Date, personalCost:Number): (newExpense:PersonalExpense)
            requires user and oldExpense exists and user is the payer of the expense
            effect updates the PersonalExpense with given details

        deletePersonalExpense(user:User, expense:PersonalExpense):(expense:PersonalExpense)
            requires user and expense exists and user is the payer of the expense
            effect deletes the PersonalExpense

        deleteAllPersonalExpense(user:User, group:GroupExpense):
            requires user and groupExpense exists and user is the payer of the expense
            effect deletes all PersonalExpenses associated with the group

        getUserSpending(user:User, group:Group): (spending:Number)
            requires user and group exist, user is in group
            effect sums the cost of all PersonalExpenses associated with user in group and returns the total

I want to integrate the expense aspect of the GroupExpenseTracker and PersonalExpenseTracker into one concept called Expense. The actions should be creating, editing, and deleting an expense. Include a creator user, payer, group, debtMapping, etc for each expense. Don't implement the code yet. Just give me the concept.

# response:

Okay, let's define a consolidated `Expense` concept that combines the expense tracking aspects of `GroupExpenseTracking` and `PersonalExpenseTracking`.

Here's the concept specification:

# concept: Expense
* **purpose**: to record, manage, and track shared and individual expenses, including payer, participants, and cost distribution.
* **principle**: after an expense is created for a group, with a payer and a defined distribution of costs among users, the system accurately reflects who paid what and who owes whom.
* **state**:
    * a set of Expenses with
        * an `id` of type `ExpenseID`
        * a `creator` of type `User`
        * a `payer` of type `User`
        * a `group` of type `Group`
        * a `title` of type `String`
        * a `description` of type `String`
        * a `category` of type `String`
        * a `totalCost` of type `Number`
        * a `date` of type `Date`
        * a `debtMapping` of type `Map<User, Number>` (mapping users to the amount they owe for this expense)

* **actions**:
    * `createExpense` (`creator`: `User`, `payer`: `User`, `group`: `Group`, `title`: `String`, `description`: `String`, `category`: `String`, `totalCost`: `Number`, `date`: `Date`, `debtMapping`: `Map<User, Number>`): (`expense`: `ExpenseID`)
        * **requires**: `creator` exists, `payer` exists, `group` exists, `creator` is in `group`, `payer` is in `group`, `totalCost` > 0, all values in `debtMapping` are non-negative and sum to `totalCost`.
        * **effects**: creates a new `Expense` with a unique `id`, the provided details, and stores it.

    * `editExpense` (`editor`: `User`, `expenseId`: `ExpenseID`, `title`: `String`, `description`: `String`, `category`: `String`, `totalCost`: `Number`, `date`: `Date`, `debtMapping`: `Map<User, Number>`): (`newExpenseId`: `ExpenseID`)
        * **requires**: `editor` exists, `expenseId` refers to an existing `Expense`, `editor` is either the `creator` or `payer` of the `Expense`, `totalCost` > 0, all values in `debtMapping` are non-negative and sum to `totalCost`.
        * **effects**: updates the `Expense` identified by `expenseId` with the new details and returns its `id`.

    * `deleteExpense` (`deleter`: `User`, `expenseId`: `ExpenseID`): (`deletedExpenseId`: `ExpenseID`)
        * **requires**: `deleter` exists, `expenseId` refers to an existing `Expense`, `deleter` is either the `creator` or `payer` of the `Expense`.
        * **effects**: deletes the `Expense` identified by `expenseId` and returns its `id`.