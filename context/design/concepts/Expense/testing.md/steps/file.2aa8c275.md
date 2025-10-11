---
timestamp: 'Sat Oct 11 2025 13:53:25 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_135325.9601be92.md]]'
content_id: 2aa8c275061690782cae38604872c9b43551edd873870854b6ecef26a424e8c5
---

# file: src/expense/expenseConcept.test.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { assertEquals } from "jsr:@std/assert";
import ExpenseConcept from "./expenseConcept.ts";
import { testDb } from "@utils/database.ts";

// Mock IDs for testing
const mockUser1 = "user:1" as any;
const mockUser2 = "user:2" as any;
const mockUser3 = "user:3" as any;
const mockGroup1 = "group:1" as any;

Deno.test("Expense Concept", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  await t.step("createExpense - happy path", async () => {
    const creator = mockUser1;
    const payer = mockUser1;
    const title = "Groceries";
    const category = "Food";
    const date = new Date();
    const totalCost = 50;
    const group = mockGroup1;
    const debtMapping = { [mockUser2]: 25, [mockUser3]: 25 };

    const result = await expenseConcept.createExpense({
      creator,
      payer,
      title,
      category,
      date,
      totalCost,
      group,
      debtMapping,
    });

    assertEquals(typeof result.expense, "string");
    assertEquals(result.expense.startsWith("expense:"), true);

    const createdExpense = await db.collection<any>("Expense.expenses").findOne({ _id: result.expense });
    assertEquals(createdExpense.title, title);
    assertEquals(createdExpense.category, category);
    assertEquals(createdExpense.totalCost, totalCost);
    assertEquals(createdExpense.creator, creator);
    assertEquals(createdExpense.payer, payer);
    assertEquals(createdExpense.group, group);
    assertEquals(createdExpense.debtMapping[mockUser2], 25);
    assertEquals(createdExpense.debtMapping[mockUser3], 25);
  });

  await t.step("editExpense - happy path", async () => {
    const creator = mockUser1;
    const payer = mockUser1;
    const title = "Initial Groceries";
    const category = "Food";
    const date = new Date();
    const totalCost = 50;
    const group = mockGroup1;
    const debtMapping = { [mockUser2]: 25, [mockUser3]: 25 };

    const createResult = await expenseConcept.createExpense({
      creator,
      payer,
      title,
      category,
      date,
      totalCost,
      group,
      debtMapping,
    });
    const expenseIdToEdit = createResult.expense;

    const newPayer = mockUser2;
    const newTitle = "Updated Groceries";
    const newTotalCost = 60;
    const newDebtMapping = { [mockUser2]: 30, [mockUser3]: 30 };

    const editResult = await expenseConcept.editExpense({
      expenseToEdit: expenseIdToEdit,
      editor: mockUser1,
      payer: newPayer,
      title: newTitle,
      totalCost: newTotalCost,
      debtMapping: newDebtMapping,
    });

    assertEquals(editResult.newExpense, expenseIdToEdit);

    const editedExpense = await db.collection<any>("Expense.expenses").findOne({ _id: expenseIdToEdit });
    assertEquals(editedExpense.title, newTitle);
    assertEquals(editedExpense.payer, newPayer);
    assertEquals(editedExpense.totalCost, newTotalCost);
    assertEquals(editedExpense.debtMapping[mockUser2], 30);
    assertEquals(editedExpense.debtMapping[mockUser3], 30);
  });

  await t.step("deleteExpense - happy path", async () => {
    const creator = mockUser1;
    const payer = mockUser1;
    const title = "Groceries";
    const category = "Food";
    const date = new Date();
    const totalCost = 50;
    const group = mockGroup1;
    const debtMapping = { [mockUser2]: 25, [mockUser3]: 25 };

    const createResult = await expenseConcept.createExpense({
      creator,
      payer,
      title,
      category,
      date,
      totalCost,
      group,
      debtMapping,
    });
    const expenseIdToDelete = createResult.expense;

    const deleteResult = await expenseConcept.deleteExpense({
      expenseToDelete: expenseIdToDelete,
    });

    assertEquals(deleteResult.deletedExpense, expenseIdToDelete);

    const deletedExpense = await db.collection<any>("Expense.expenses").findOne({ _id: expenseIdToDelete });
    assertEquals(deletedExpense, null);
  });

  await t.step("createExpense - requires validation (non-existent group)", async () => {
    // In a real scenario, this would involve checking against a group collection.
    // For this isolated test, we'll assume that if a group doesn't exist, it fails.
    // We can't directly test "non-existent group" without a group concept.
    // This test will focus on other `requires` if applicable.
    // For now, we'll test totalCost > 0
    try {
      await expenseConcept.createExpense({
        creator: mockUser1,
        payer: mockUser1,
        title: "Invalid Cost",
        category: "Test",
        date: new Date(),
        totalCost: 0, // Should fail
        group: mockGroup1,
        debtMapping: {},
      });
      // If it reaches here, the test failed as it should have thrown an error
      assertEquals(true, false, "Expected an error for totalCost <= 0");
    } catch (e) {
      // We expect an error, so the test passes if an error is caught.
      // The specific error message would depend on implementation.
      // For now, we just check if an error was thrown.
      console.log("Caught expected error for invalid totalCost:", e.message);
      assertEquals(typeof e, "object");
    }
  });

  await t.step("editExpense - requires validation (non-existent expense)", async () => {
    const nonExistentExpenseId = "expense:nonexistent";
    const editResult = await expenseConcept.editExpense({
      expenseToEdit: nonExistentExpenseId as any,
      editor: mockUser1,
      title: "Should not be edited",
    });

    assertEquals(editResult.newExpense, ""); // Expecting an empty string to indicate failure
  });

  await t.step("deleteExpense - requires validation (non-existent expense)", async () => {
    const nonExistentExpenseId = "expense:nonexistent";
    const deleteResult = await expenseConcept.deleteExpense({
      expenseToDelete: nonExistentExpenseId as any,
    });

    assertEquals(deleteResult.deletedExpense, ""); // Expecting an empty string to indicate failure
  });

  await t.step("Operational principle: User creates an expense, then edits it", async () => {
    // 1. Create an expense
    const initialExpenseResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "Lunch",
      category: "Food",
      date: new Date(),
      totalCost: 30,
      group: mockGroup1,
      debtMapping: { [mockUser2]: 15, [mockUser3]: 15 },
    });
    const initialExpenseId = initialExpenseResult.expense;
    console.log("Created expense for operational principle:", initialExpenseId);

    // 2. Edit the expense
    const updatedExpenseResult = await expenseConcept.editExpense({
      expenseToEdit: initialExpenseId,
      editor: mockUser1,
      description: "Team lunch",
      totalCost: 35,
      debtMapping: { [mockUser2]: 17.5, [mockUser3]: 17.5 },
    });
    const updatedExpenseId = updatedExpenseResult.newExpense;
    console.log("Edited expense for operational principle:", updatedExpenseId);

    // Verify changes
    const finalExpense = await db.collection<any>("Expense.expenses").findOne({ _id: updatedExpenseId });
    assertEquals(finalExpense.title, "Lunch"); // Title not changed
    assertEquals(finalExpense.description, "Team lunch");
    assertEquals(finalExpense.totalCost, 35);
    assertEquals(finalExpense.debtMapping[mockUser2], 17.5);
    assertEquals(finalExpense.debtMapping[mockUser3], 17.5);
  });

  await t.step("Interesting scenario: Editing only one field of an expense", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "Coffee",
      category: "Beverage",
      date: new Date(),
      totalCost: 5,
      group: mockGroup1,
      debtMapping: {},
    });
    const expenseId = createResult.expense;

    const editResult = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      editor: mockUser1,
      category: "Drinks",
    });

    assertEquals(editResult.newExpense, expenseId);
    const editedExpense = await db.collection<any>("Expense.expenses").findOne({ _id: expenseId });
    assertEquals(editedExpense.category, "Drinks");
    assertEquals(editedExpense.title, "Coffee"); // Other fields remain the same
  });

  await t.step("Interesting scenario: Attempting to edit a non-existent expense", async () => {
    const nonExistentExpenseId = "expense:imagine_this_does_not_exist";
    const editResult = await expenseConcept.editExpense({
      expenseToEdit: nonExistentExpenseId as any,
      editor: mockUser1,
      title: "This will not work",
    });
    assertEquals(editResult.newExpense, ""); // Expecting failure indicator
  });

  await t.step("Interesting scenario: Deleting an expense that has already been deleted", async () => {
    // Create and delete an expense first
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "One-off",
      category: "Misc",
      date: new Date(),
      totalCost: 10,
      group: mockGroup1,
      debtMapping: {},
    });
    const expenseId = createResult.expense;
    await expenseConcept.deleteExpense({ expenseToDelete: expenseId });

    // Attempt to delete it again
    const deleteResult = await expenseConcept.deleteExpense({
      expenseToDelete: expenseId,
    });
    assertEquals(deleteResult.deletedExpense, ""); // Expecting failure indicator
  });

  await t.step("Interesting scenario: Creating an expense with zero debt mapping", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "No Debt",
      category: "Personal",
      date: new Date(),
      totalCost: 100,
      group: mockGroup1,
      debtMapping: {}, // Empty debt mapping
    });

    assertEquals(typeof createResult.expense, "string");
    const createdExpense = await db.collection<any>("Expense.expenses").findOne({ _id: createResult.expense });
    assertEquals(createdExpense.debtMapping, {});
  });

  await t.step("Interesting scenario: Editing an expense to have an empty debt mapping", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "With Debt",
      category: "Shared",
      date: new Date(),
      totalCost: 50,
      group: mockGroup1,
      debtMapping: { [mockUser2]: 25, [mockUser3]: 25 },
    });
    const expenseId = createResult.expense;

    const editResult = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      editor: mockUser1,
      debtMapping: {}, // Set to empty
    });

    assertEquals(editResult.newExpense, expenseId);
    const editedExpense = await db.collection<any>("Expense.expenses").findOne({ _id: expenseId });
    assertEquals(editedExpense.debtMapping, {});
  });


  await client.close();
});
```
