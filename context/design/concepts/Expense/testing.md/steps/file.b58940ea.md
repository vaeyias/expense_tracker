---
timestamp: 'Sat Oct 11 2025 14:25:36 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_142536.c7a91e4a.md]]'
content_id: b58940eaf17dd8a6813284403ea7cefb203a8a29b88211863e9474ab952b1755
---

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
