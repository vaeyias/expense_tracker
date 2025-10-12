import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ExpenseConcept from "./ExpenseConcept.ts";

Deno.test("💰 ExpenseConcept - create, edit, delete, and retrieve expenses", async (t) => {
  // Test Case #1: Create, edit, and retrieve expense
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const userAlice = "user:Alice" as ID;
  const group1 = "group:1" as ID;

  await t.step("Test Case #1: Create, edit, and retrieve expense", async () => {
    const totalCost = 100;

    console.log("[1] Creating expense...");
    const createRes = await expenseConcept.createExpense({
      user: userAlice,
      title: "Groceries",
      category: "Food",
      date: new Date("2025-01-01"),
      totalCost,
      group: group1,
    });
    assertNotEquals(
      "error" in createRes,
      true,
      "Creating expense should not fail",
    );
    const expenseId = (createRes as { expense: ID }).expense;
    console.log(`[1] Created expense ID: ${expenseId}`);

    const retrieved = await expenseConcept._getExpenseById({ expenseId });
    console.log(`[1] Retrieved expense by Id:`, {
      title: retrieved?.title,
      totalCost: retrieved?.totalCost,
      group: retrieved?.group,
      category: retrieved?.category,
      date: retrieved?.date,
    });

    const groupExpenses = await expenseConcept._getExpensesByGroup({
      group: group1,
    });

    console.log(
      `[1] Retrieving Expenses by Group:`,
      groupExpenses.map((e) => ({
        title: e.title,
        total: e.totalCost,
      })),
    );

    console.log("[1] Editing expense...");
    const editRes = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      title: "Weekend Groceries",
      category: "Food & Drink",
      totalCost: 120,
      date: new Date("2025-01-02"),
    });
    assertEquals("error" in editRes, false, "Editing expense should not fail");
    console.log(
      `[1] Edited expense ID: ${(editRes as { newExpense: ID }).newExpense}`,
    );

    const updated = await expenseConcept._getExpenseById({ expenseId });
    console.log(`[1] Updated expense:`, {
      title: updated?.title,
      totalCost: updated?.totalCost,
      group: updated?.group,
      category: updated?.category,
      date: updated?.date,
    });

    console.log("[1] Deleting expense...");
    const deleteRes = await expenseConcept.deleteExpense({
      expenseToDelete: expenseId,
    });
    assertEquals(
      "error" in deleteRes,
      false,
      "Deleting expense should not fail",
    );
    console.log(
      `[1] Deleted expense ID: ${
        (deleteRes as { deletedExpense: ID }).deletedExpense
      }`,
    );

    const afterDeletion = await expenseConcept._getExpenseById({ expenseId });
    console.log("[1] Verified deletion successful:", afterDeletion);
    assertEquals(afterDeletion, null);
  });

  // Test Case #2: Invalid total cost returns error
  await t.step("Test Case #2: Invalid total cost returns error", async () => {
    console.log("[2] Creating expense with totalCost = -5 ...");
    const res = await expenseConcept.createExpense({
      user: userAlice,
      title: "Invalid Expense",
      category: "Test",
      date: new Date(),
      totalCost: -5,
      group: group1,
    });

    assertEquals("error" in res, true, "Creating expense should have failed");
    console.log(`[2] Expected error: ${(res as { error: string }).error}`);
    assertEquals(
      (res as { error: string }).error,
      "totalCost must be greater than 0",
    );
  });

  // Test Case #3: Retrieving from empty group returns []
  await t.step(
    "Test Case #3: Retrieving from empty group returns []",
    async () => {
      console.log("[3] Retrieving expenses from empty group...");
      const expenses = await expenseConcept._getExpensesByGroup({
        group: "group:empty" as ID,
      });

      console.log(`[3] Retrieved expenses:`, expenses);
      assertEquals(expenses.length, 0, "Returned empty group as expected");
    },
  );

  // Test Case #4: Performing Multiple Edits
  await t.step(
    "Test Case #4: Many Edits",
    async () => {
      console.log("[4] Creating initial expense...");
      const createRes = await expenseConcept.createExpense({
        user: userAlice,
        title: "Initial Expense",
        category: "Test",
        date: new Date(),
        totalCost: 50,
        group: group1,
      });

      const expenseId = (createRes as { expense: ID }).expense;

      const original = await expenseConcept._getExpenseById({ expenseId });
      console.log(`[1] Updated expense:`, {
        title: original?.title,
        totalCost: original?.totalCost,
        group: original?.group,
        category: original?.category,
        date: original?.date,
      });

      console.log("[4] Editing expense with negative cost...");
      const editRes = await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        totalCost: -50,
      });

      assertEquals(
        "error" in editRes,
        true,
        "Editing expense failed as expected",
      );
      console.log(
        `[4] Expected error: ${(editRes as { error: string }).error}`,
      );

      console.log("[4] Editing expense with new title and cost...");
      const editRes2 = await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        title: "Edit two",
        totalCost: 150,
      });

      assertEquals(
        "error" in editRes2,
        false,
        "Editing expense should not fail",
      );
      console.log(
        `[4] Edited expense ID: ${(editRes2 as { newExpense: ID }).newExpense}`,
      );

      const updated = await expenseConcept._getExpenseById({ expenseId });
      console.log(`[4] Initial expense:`, {
        title: updated?.title,
        totalCost: updated?.totalCost,
        group: updated?.group,
        category: updated?.category,
        date: updated?.date,
      });

      assertEquals(
        "error" in editRes,
        true,
        "Editing expense failed as expected",
      );

      console.log("[4] Cleaning up by deleting initial expense...");
      await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
    },
  );

  await client.close();
});
