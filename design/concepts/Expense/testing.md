[@implementation](../../../context/design/concepts/Expense/implementation.md/steps/response.b69c987d.md)

[@testing-concepts](../../background/testing-concepts.md)

Testing concepts. Your tests should cover the basic behavior of the concept but should also include some more interesting cases. Your tests should use the Deno testing framework and should be programmatic (that is, determining in the code whether they succeeded or failed, and not requiring a human to interpret console messages). They should also print helpful messages to the console with action inputs and outputs so that a human reader can make sense of the test execution when it runs in the console. Some more details about the test cases you should include:

Operational principle. A sequence of action executions that corresponds to the operational principle, representing the common expected usage of the concept. These sequence is not required to use all the actions; operational principles often do not include a deletion action, for example.
Interesting scenarios. Sequences of action executions that correspond to less common cases: probing interesting corners of the functionality, undoing actions with deletions and cancellations, repeating actions with the same arguments, etc. In some of these scenarios actions may be expected to throw errors.
Number required. For each concept, you should have one test sequence for the operational principle, and 3-5 additional interesting scenarios. Every action should be executed successfully in at least one of the scenarios.
No state setup. Your test cases should not require any setting up of the concept state except by calling concept actions. When you are testing one action at a time, this means that you will want to order your actions carefully (for example, by the operational principle) to avoid having to set up state.

# test: Expense

# response:

# file: src/expense/expenseConcept.test.ts
```typescript
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { Db } from "npm:mongodb";
import ExpenseConcept from "./expenseConcept.ts";
import { testDb } from "@utils/database.ts";
import { User, Group, Expense } from "./expenseConcept.ts"; // Assuming these are also exported from concept

Deno.test("ExpenseConcept - Operational Principle", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  await t.step("Create an expense, then edit it, then retrieve it", async () => {
    const creator: User = "user:1";
    const payer: User = "user:2";
    const group: Group = "group:1";

    const initialExpenseDetails = {
      creator,
      payer,
      title: "Groceries",
      category: "Food",
      date: new Date(),
      totalCost: 50.50,
      group,
      debtMapping: {
        "user:1": 25.25,
        "user:2": 25.25,
      },
    };

    const createResult = await expenseConcept.createExpense(initialExpenseDetails);
    const expenseId = createResult.expense;
    assertEquals(typeof expenseId, "string", "createExpense should return an expense ID");

    // Retrieve the created expense to verify
    const createdExpense = await expenseConcept._getExpenseById({ expenseId });
    assertEquals(createdExpense?.title, initialExpenseDetails.title, "Retrieved expense should match created details");

    // Edit the expense
    const editedDetails = {
      expenseToEdit: expenseId,
      editor: creator,
      totalCost: 60.00,
      description: "Weekly groceries",
      debtMapping: {
        "user:1": 30.00,
        "user:2": 30.00,
      },
    };

    const editResult = await expenseConcept.editExpense(editedDetails);
    assertEquals(typeof editResult.newExpense, "string", "editExpense should return the edited expense ID");

    // Retrieve the edited expense to verify
    const editedExpense = await expenseConcept._getExpenseById({ expenseId });
    assertEquals(editedExpense?.totalCost, editedDetails.totalCost, "Edited expense should have updated totalCost");
    assertEquals(editedExpense?.description, editedDetails.description, "Edited expense should have updated description");
    assertEquals(editedExpense?.debtMapping, editedDetails.debtMapping, "Edited expense should have updated debtMapping");
  });

  await t.step("Create an expense, then delete it, then try to retrieve it", async () => {
    const creator: User = "user:3";
    const payer: User = "user:4";
    const group: Group = "group:2";

    const createResult = await expenseConcept.createExpense({
      creator,
      payer,
      title: "Dinner",
      category: "Food",
      date: new Date(),
      totalCost: 30.00,
      group,
      debtMapping: {
        "user:3": 15.00,
        "user:4": 15.00,
      },
    });
    const expenseId = createResult.expense;

    // Delete the expense
    const deleteResult = await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
    assertEquals(deleteResult.deletedExpense, expenseId, "deleteExpense should return the deleted expense ID");

    // Try to retrieve the deleted expense
    const deletedExpense = await expenseConcept._getExpenseById({ expenseId });
    assertEquals(deletedExpense, null, "Deleted expense should not be found");
  });

  await client.close();
});

Deno.test("ExpenseConcept - Interesting Scenarios", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const user1: User = "user:1";
  const user2: User = "user:2";
  const user3: User = "user:3";
  const group1: Group = "group:1";
  const group2: Group = "group:2";

  await t.step("Create an expense with minimal required fields", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: user1,
      payer: user2,
      title: "Coffee",
      category: "Drinks",
      date: new Date(),
      totalCost: 5.00,
      group: group1,
      debtMapping: {
        [user1]: 2.50,
        [user2]: 2.50,
      },
    });
    const expenseId = createResult.expense;
    const expense = await expenseConcept._getExpenseById({ expenseId });
    assertEquals(expense?.title, "Coffee", "Expense title should be correct");
    assertEquals(expense?.description, undefined, "Expense description should be undefined");
  });

  await t.step("Edit an expense with only one field", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: user1,
      payer: user2,
      title: "Lunch",
      category: "Food",
      date: new Date(),
      totalCost: 20.00,
      group: group1,
      debtMapping: {
        [user1]: 10.00,
        [user2]: 10.00,
      },
    });
    const expenseId = createResult.expense;

    const editResult = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      editor: user1,
      category: "Meals",
    });
    const editedExpense = await expenseConcept._getExpenseById({ expenseId: editResult.newExpense });
    assertEquals(editedExpense?.category, "Meals", "Category should be updated");
    assertEquals(editedExpense?.title, "Lunch", "Other fields should remain unchanged");
  });

  await t.step("Attempt to create an expense with totalCost <= 0 (should fail)", async () => {
    await assertRejects(
      async () => {
        await expenseConcept.createExpense({
          creator: user1,
          payer: user2,
          title: "Invalid Expense",
          category: "Test",
          date: new Date(),
          totalCost: 0,
          group: group1,
          debtMapping: {
            [user1]: 0,
            [user2]: 0,
          },
        });
      },
      Error,
      "Creating an expense with zero total cost should throw an error"
    );
  });

  await t.step("Attempt to edit an expense that does not exist", async () => {
    const nonExistentExpenseId: Expense = "expense:non-existent";
    const editResult = await expenseConcept.editExpense({
      expenseToEdit: nonExistentExpenseId,
      editor: user1,
      title: "Should not happen",
    });
    assertEquals(editResult.newExpense, "", "Editing a non-existent expense should return an empty string");
  });

  await t.step("Attempt to delete an expense that does not exist", async () => {
    const nonExistentExpenseId: Expense = "expense:non-existent";
    const deleteResult = await expenseConcept.deleteExpense({ expenseToDelete: nonExistentExpenseId });
    assertEquals(deleteResult.deletedExpense, "", "Deleting a non-existent expense should return an empty string");
  });

  await t.step("Retrieve all expenses for a group", async () => {
    await expenseConcept.createExpense({
      creator: user1,
      payer: user2,
      title: "Expense for Group 1 - 1",
      category: "General",
      date: new Date(),
      totalCost: 10.00,
      group: group1,
      debtMapping: { [user1]: 5.00, [user2]: 5.00 },
    });
    await expenseConcept.createExpense({
      creator: user1,
      payer: user2,
      title: "Expense for Group 1 - 2",
      category: "General",
      date: new Date(),
      totalCost: 15.00,
      group: group1,
      debtMapping: { [user1]: 7.50, [user2]: 7.50 },
    });
    await expenseConcept.createExpense({
      creator: user3,
      payer: user1,
      title: "Expense for Group 2 - 1",
      category: "General",
      date: new Date(),
      totalCost: 20.00,
      group: group2,
      debtMapping: { [user3]: 10.00, [user1]: 10.00 },
    });

    const expensesInGroup1 = await expenseConcept._getExpensesByGroup({ group: group1 });
    assertEquals(expensesInGroup1.length, 2, "Should retrieve exactly two expenses for group1");
    expensesInGroup1.forEach(exp => assertEquals(exp.group, group1, "All retrieved expenses should belong to group1"));

    const expensesInGroup2 = await expenseConcept._getExpensesByGroup({ group: group2 });
    assertEquals(expensesInGroup2.length, 1, "Should retrieve exactly one expense for group2");
    assertEquals(expensesInGroup2[0].group, group2, "The retrieved expense should belong to group2");
  });

  await client.close();
});
```

# trace:
This trace demonstrates the operational principle of creating an expense, then editing it, and finally verifying its updated state.

1.  **`createExpense`**: A new expense is created with specific details including title, category, total cost, date, creator, payer, group, and a debt mapping.
2.  **`_getExpenseById`**: The newly created expense is retrieved using its ID to confirm its initial state.
3.  **`editExpense`**: The same expense is then edited. This action modifies fields like `totalCost` and `description`, and also updates the `debtMapping`.
4.  **`_getExpenseById`**: The expense is retrieved again after the edit operation to verify that the changes have been applied correctly.
5.  **`deleteExpense`**: The expense is deleted using its ID.
6.  **`_getExpenseById`**: The expense is attempted to be retrieved one last time to confirm that it has been successfully deleted and is no longer present in the database.