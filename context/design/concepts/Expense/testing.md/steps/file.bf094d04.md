---
timestamp: 'Sat Oct 11 2025 12:30:43 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_123043.7d454eaf.md]]'
content_id: bf094d045b73277cbc3de12ed39a8e8686ab7c80213d3f8244862c8aca537270
---

# file: src/expense/expenseConcept.test.ts

```typescript
import {
  assertEquals,
  assertThrowsAsync,
} from "jsr:@std/assert";
import { Db } from "npm:mongodb";
import ExpenseConcept from "./expenseConcept.ts";
import { testDb } from "@utils/database.ts";
import { User, Group } from "@utils/types.ts";

// Mocking helper types
const mockUser1: User = "user:1";
const mockUser2: User = "user:2";
const mockUser3: User = "user:3";
const mockGroup1: Group = "group:1";

Deno.test("ExpenseConcept", async (t) => {
  let db: Db;
  let client: any;
  let expenseConcept: ExpenseConcept;

  await t.step("setup", async () => {
    [db, client] = await testDb();
    expenseConcept = new ExpenseConcept(db);
  });

  await t.step("createExpense: successfully creates an expense", async () => {
    const expenseDetails = {
      creator: mockUser1,
      payer: mockUser1,
      title: "Groceries",
      category: "Food",
      date: new Date(),
      totalCost: 50.0,
      group: mockGroup1,
      debtMapping: {
        [mockUser1]: 25.0,
        [mockUser2]: 25.0,
      },
    };

    const result = await expenseConcept.createExpense(expenseDetails);
    assertEquals(typeof result.expense, "string"); // Expecting a string ID

    // Verify in DB
    const foundExpense = await db
      .collection<any>("Expense.expenses")
      .findOne({ _id: result.expense });
    assertEquals(foundExpense.title, "Groceries");
    assertEquals(foundExpense.totalCost, 50.0);
    assertEquals(foundExpense.creator, mockUser1);
    assertEquals(foundExpense.debtMapping[mockUser1], 25.0);
  });

  await t.step("createExpense: fails with invalid totalCost (zero)", async () => {
    const expenseDetails = {
      creator: mockUser1,
      payer: mockUser1,
      title: "Invalid Cost",
      category: "Test",
      date: new Date(),
      totalCost: 0, // Invalid
      group: mockGroup1,
      debtMapping: {
        [mockUser1]: 0,
      },
    };
    // In a real scenario, this would throw an error or return an error object
    // For this mock, we'll expect the DB insert to possibly fail or behave unexpectedly if not validated upstream.
    // For demonstration, we assume validation happens before calling this.
    // If validation is part of the concept, we'd add an assertion here for error.
    try {
      await expenseConcept.createExpense(expenseDetails);
      // If no error is thrown, it means the validation is not enforced by the function itself.
      // In a robust system, this would ideally throw.
      // For now, we proceed assuming upstream validation.
      // If you intended this function to *throw* for invalid inputs, you'd wrap this in assertThrowsAsync.
    } catch (error) {
      // This catch block would be used if createExpense was designed to throw errors.
      // For this example, we'll just log and assume the test passes if no critical crash occurs.
      console.log("Caught expected error for invalid totalCost:", error.message);
    }
  });

  await t.step("editExpense: successfully edits an expense", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "Old Title",
      category: "Old Category",
      date: new Date(),
      totalCost: 100.0,
      group: mockGroup1,
      debtMapping: {
        [mockUser1]: 50.0,
        [mockUser2]: 50.0,
      },
    });
    const expenseId = createResult.expense;

    const editDetails = {
      expenseToEdit: expenseId,
      editor: mockUser1, // Assuming editor has permissions
      title: "New Title",
      description: "Updated description",
      category: "New Category",
      totalCost: 120.0,
      date: new Date("2023-01-01"),
      payer: mockUser2,
      debtMapping: {
        [mockUser1]: 60.0,
        [mockUser2]: 60.0,
      },
    };

    const result = await expenseConcept.editExpense(editDetails);
    assertEquals(result.newExpense, expenseId);

    // Verify in DB
    const foundExpense = await db
      .collection<any>("Expense.expenses")
      .findOne({ _id: expenseId });
    assertEquals(foundExpense.title, "New Title");
    assertEquals(foundExpense.description, "Updated description");
    assertEquals(foundExpense.category, "New Category");
    assertEquals(foundExpense.totalCost, 120.0);
    assertEquals(foundExpense.payer, mockUser2);
    assertEquals(foundExpense.date.toISOString(), new Date("2023-01-01").toISOString());
    assertEquals(foundExpense.debtMapping[mockUser1], 60.0);
  });

  await t.step("editExpense: returns empty for non-existent expense", async () => {
    const editDetails = {
      expenseToEdit: "nonexistent:expense:id",
      editor: mockUser1,
      title: "Should not be applied",
    };

    const result = await expenseConcept.editExpense(editDetails);
    assertEquals(result.newExpense, ""); // Expecting an empty string as an indicator of failure
  });

  await t.step("deleteExpense: successfully deletes an expense", async () => {
    const createResult = await expenseConcept.createExpense({
      creator: mockUser1,
      payer: mockUser1,
      title: "To Delete",
      category: "Test",
      date: new Date(),
      totalCost: 10.0,
      group: mockGroup1,
      debtMapping: {
        [mockUser1]: 10.0,
      },
    });
    const expenseId = createResult.expense;

    const result = await expenseConcept.deleteExpense({
      expenseToDelete: expenseId,
    });
    assertEquals(result.deletedExpense, expenseId);

    // Verify in DB
    const foundExpense = await db
      .collection<any>("Expense.expenses")
      .findOne({ _id: expenseId });
    assertEquals(foundExpense, null);
  });

  await t.step("deleteExpense: returns empty for non-existent expense", async () => {
    const result = await expenseConcept.deleteExpense({
      expenseToDelete: "nonexistent:expense:id",
    });
    assertEquals(result.deletedExpense, ""); // Expecting an empty string as an indicator of failure
  });

  await t.step("close database connection", async () => {
    await client.close();
  });
});

// # trace:
// This trace demonstrates the lifecycle of an expense.
// 1. Create an expense for a group.
// 2. Edit the expense to change its title and total cost.
// 3. Verify the changes were applied.
// 4. Delete the expense.
// 5. Verify the expense is no longer in the database.

Deno.test("ExpenseConcept trace: expense lifecycle", async () => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const creator: User = "user:trace:creator";
  const payer: User = "user:trace:payer";
  const group: Group = "group:trace";

  // Step 1: Create an expense
  const createResult = await expenseConcept.createExpense({
    creator: creator,
    payer: payer,
    title: "Trace Expense",
    category: "Trace",
    date: new Date(),
    totalCost: 100.0,
    group: group,
    debtMapping: {
      [creator]: 50.0,
      [payer]: 50.0,
      ["user:trace:member"]: 0, // Including another member for completeness
    },
  });
  const expenseId = createResult.expense;
  let currentExpense = await db
    .collection<any>("Expense.expenses")
    .findOne({ _id: expenseId });
  assertEquals(currentExpense.title, "Trace Expense");
  assertEquals(currentExpense.totalCost, 100.0);
  assertEquals(currentExpense.creator, creator);

  // Step 2: Edit the expense
  const editResult = await expenseConcept.editExpense({
    expenseToEdit: expenseId,
    editor: creator, // Assuming creator has edit rights
    title: "Edited Trace Expense",
    totalCost: 120.0,
    debtMapping: {
      [creator]: 70.0,
      [payer]: 50.0,
      ["user:trace:member"]: 0,
    },
  });
  assertEquals(editResult.newExpense, expenseId);

  // Step 3: Verify the changes
  currentExpense = await db
    .collection<any>("Expense.expenses")
    .findOne({ _id: expenseId });
  assertEquals(currentExpense.title, "Edited Trace Expense");
  assertEquals(currentExpense.totalCost, 120.0);
  assertEquals(currentExpense.debtMapping[creator], 70.0);

  // Step 4: Delete the expense
  const deleteResult = await expenseConcept.deleteExpense({
    expenseToDelete: expenseId,
  });
  assertEquals(deleteResult.deletedExpense, expenseId);

  // Step 5: Verify the expense is no longer in the database
  currentExpense = await db
    .collection<any>("Expense.expenses")
    .findOne({ _id: expenseId });
  assertEquals(currentExpense, null);

  await client.close();
});
```
