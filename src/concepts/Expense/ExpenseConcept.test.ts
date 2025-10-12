import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ExpenseConcept from "./ExpenseConcept.ts";

Deno.test("💰 ExpenseConcept - create, edit, delete, and retrieve expenses", async (t) => {
  // Test Case #1: Create, edit, and retrieve expense
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const userAlice = "user:Alice" as ID;
  const userBob = "user:Bob" as ID;
  const group1 = "group:1" as ID;

  await t.step("Test Case #1: Create, edit, and retrieve expense", async () => {
    const initialDebtMapping = { [userAlice]: 50, [userBob]: 50 };
    const totalCost = 100;

    console.log("[1] Creating expense...");
    const createRes = await expenseConcept.createExpense({
      creator: userAlice,
      payer: userAlice,
      title: "Groceries",
      category: "Food",
      date: new Date("2025-01-01"),
      totalCost,
      group: group1,
      debtMapping: initialDebtMapping,
    });
    assertNotEquals(
      "error" in createRes,
      true,
      "Creating expense should not fail",
    );
    const expenseId = (createRes as { expense: ID }).expense;
    console.log(`[1] Created expense ID: ${expenseId}`);

    const retrieved = await expenseConcept._getExpenseById({ expenseId });
    console.log(`[1] Retrieved expense:`, {
      title: retrieved?.title,
      totalCost: retrieved?.totalCost,
      payer: retrieved?.payer,
      creator: retrieved?.creator,
      group: retrieved?.group,
      debtMapping: retrieved?.debtMapping,
      category: retrieved?.category,
      date: retrieved?.date,
    });

    const groupExpenses = await expenseConcept._getExpensesByGroup({
      group: group1,
    });
    console.log(
      `[1] Expenses in group:`,
      groupExpenses.map((e) => ({
        title: e.title,
        total: e.totalCost,
        payer: e.payer,
        debtMapping: e.debtMapping,
      })),
    );

    console.log("[1] Editing expense...");
    const editRes = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      editor: userAlice,
      payer: userBob,
      title: "Weekend Groceries",
      category: "Food & Drink",
      totalCost: 120,
      date: new Date("2025-01-02"),
      debtMapping: { [userAlice]: 70, [userBob]: 50 },
    });
    assertEquals("error" in editRes, false, "Editing expense should not fail");
    console.log(
      `[1] Edited expense ID: ${(editRes as { newExpense: ID }).newExpense}`,
    );

    const updated = await expenseConcept._getExpenseById({ expenseId });
    console.log(`[1] Updated expense:`, {
      title: updated?.title,
      totalCost: updated?.totalCost,
      payer: updated?.payer,
      creator: updated?.creator,
      group: updated?.group,
      debtMapping: updated?.debtMapping,
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
    console.log("[2] Creating expense with totalCost = 0...");
    const res = await expenseConcept.createExpense({
      creator: userAlice,
      payer: userAlice,
      title: "Invalid Expense",
      category: "Test",
      date: new Date(),
      totalCost: 0,
      group: group1,
      debtMapping: { [userAlice]: 0 },
    });

    assertEquals("error" in res, true, "Creating expense failed as expected");
    console.log(`[2] Expected error: ${(res as { error: string }).error}`);
    assertEquals(
      (res as { error: string }).error,
      "totalCost must be greater than 0",
    );
  });

  // Test Case #3: Mismatched debt mapping sum returns error
  await t.step(
    "Test Case #3: Mismatched debt mapping sum returns error",
    async () => {
      console.log("[3] Creating expense with debt sum mismatch...");
      const res = await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Mismatch Debt",
        category: "Test",
        date: new Date(),
        totalCost: 100,
        group: group1,
        debtMapping: { [userAlice]: 50, [userBob]: 60 },
      });

      assertEquals("error" in res, true, "Creating expense failed as expected");
      console.log(`[3] Expected error: ${(res as { error: string }).error}`);
    },
  );

  // Test Case #4: Editing with negative debt returns error
  await t.step(
    "Test Case #4: Editing with negative debt returns error",
    async () => {
      console.log("[4] Creating initial expense...");
      const createRes = await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Initial Expense",
        category: "Test",
        date: new Date(),
        totalCost: 100,
        group: group1,
        debtMapping: { [userAlice]: 100 },
      });

      const expenseId = (createRes as { expense: ID }).expense;

      console.log("[4] Editing expense with negative debt...");
      const editRes = await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        editor: userAlice,
        debtMapping: { [userAlice]: -50 },
        totalCost: 50,
      });

      assertEquals(
        "error" in editRes,
        true,
        "Editing expense failed as expected",
      );
      console.log(
        `[4] Expected error: ${(editRes as { error: string }).error}`,
      );

      console.log("[4] Cleaning up by deleting initial expense...");
      await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
    },
  );

  // Test Case #5: Retrieving from empty group returns []
  await t.step(
    "Test Case #5: Retrieving from empty group returns []",
    async () => {
      console.log("[5] Retrieving expenses from empty group...");
      const expenses = await expenseConcept._getExpensesByGroup({
        group: "group:empty" as ID,
      });

      console.log(`[5] Retrieved expenses:`, expenses);
      assertEquals(expenses.length, 0, "Returned empty group as expected");
    },
  );

  await client.close();
});
