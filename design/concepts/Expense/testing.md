# modified_test_expense
```
import { assertEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ExpenseConcept from "./ExpenseConcept.ts";

Deno.test("💰 ExpenseConcept - create, edit, delete, and retrieve expenses", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const userAlice = "user:Alice" as ID;
  const userBob = "user:Bob" as ID;
  const userCharlie = "user:Charlie" as ID;
  const group1 = "group:1" as ID;

  await t.step(
    "Test Case #1: Creating, editing, and retrieving an expense",
    async () => {
      const initialDate = new Date("2023-01-01");
      const initialDebtMapping = { [userAlice]: 50, [userBob]: 50 };
      const initialTotalCost = 100;

      const { expense: expenseId } = await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Groceries",
        category: "Food",
        date: initialDate,
        totalCost: initialTotalCost,
        group: group1,
        debtMapping: initialDebtMapping,
      });
      console.log(`[1] Created expense ID: ${expenseId}`);

      const retrieved = await expenseConcept._getExpenseById({ expenseId });
      console.log(`[1] Retrieved expense:`, {
        title: retrieved?.title,
        total: retrieved?.totalCost,
        payer: retrieved?.payer,
      });
      assertEquals(retrieved?._id, expenseId);
      assertEquals(retrieved?.title, "Groceries");
      assertEquals(retrieved?.totalCost, initialTotalCost);
      assertEquals(retrieved?.creator, userAlice);
      assertEquals(retrieved?.payer, userAlice);
      assertEquals(retrieved?.group, group1);
      assertEquals(retrieved?.debtMapping, initialDebtMapping);

      const groupExpenses = await expenseConcept._getExpensesByGroup({
        group: group1,
      });
      console.log(`[1] Expenses in group:`, groupExpenses.map((e) => e.title));
      assertEquals(groupExpenses.length, 1);
      assertEquals(groupExpenses[0]._id, expenseId);

      const updatedDate = new Date("2025-01-02");
      const updatedTotalCost = 120;
      const updatedDebtMapping = { [userAlice]: 70, [userBob]: 50 };
      const editResult = await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        editor: userAlice,
        payer: userBob,
        title: "Weekend Groceries",
        category: "Food & Drink",
        date: updatedDate,
        totalCost: updatedTotalCost,
        debtMapping: updatedDebtMapping,
      });
      console.log(`[1] Edited expense ID: ${editResult.newExpense}`);

      const updated = await expenseConcept._getExpenseById({ expenseId });
      console.log(`[1] Updated expense:`, {
        title: updated?.title,
        total: updated?.totalCost,
        payer: updated?.payer,
        date: updated?.date,
      });
      assertEquals(updated?.title, "Weekend Groceries");
      assertEquals(updated?.payer, userBob);
      assertEquals(updated?.totalCost, updatedTotalCost);
      assertEquals(updated?.date, updatedDate);
      assertEquals(updated?.debtMapping, updatedDebtMapping);
      assertEquals(updated?.category, "Food & Drink");

      const { deletedExpense } = await expenseConcept.deleteExpense({
        expenseToDelete: expenseId,
      });
      console.log(`[1] Deleted expense ID: ${deletedExpense}`);
      assertEquals(deletedExpense, expenseId);

      const afterDeletion = await expenseConcept._getExpenseById({ expenseId });
      assertEquals(afterDeletion, null);
      console.log(`[1] Verified deletion successful.\n`);
    },
  );

  await t.step(
    "Test Case #2: Creating an expense with invalid total cost should throw",
    async () => {
      try {
        await expenseConcept.createExpense({
          creator: userAlice,
          payer: userAlice,
          title: "Invalid Expense",
          category: "Test",
          date: new Date("2023-03-10"),
          totalCost: 0,
          group: group1,
          debtMapping: { [userAlice]: 0 },
        });
        throw new Error(
          "Expected an error for invalid total cost, but none was thrown.",
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log(`[2] Caught expected error:`, error.message);
          assertEquals(error.message, "totalCost must be greater than 0");
        } else {
          console.log("[2] Unknown error occurred");
          throw error;
        }
      }
    },
  );

  await t.step(
    "Test Case #3: Creating an expense with mismatched debt mapping sum should throw",
    async () => {
      const totalCost = 100;
      const debtMappingWithMismatch = { [userAlice]: 50, [userBob]: 60 };
      try {
        await expenseConcept.createExpense({
          creator: userAlice,
          payer: userAlice,
          title: "Mismatched Debt",
          category: "Test",
          date: new Date("2023-04-05"),
          totalCost,
          group: group1,
          debtMapping: debtMappingWithMismatch,
        });
        throw new Error(
          "Expected error for mismatched debt mapping sum, but none was thrown.",
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log(`[3] Caught expected error:`, error.message);
          assertEquals(
            error.message,
            `Sum of debtMapping (110) does not equal totalCost (${totalCost})`,
          );
        } else {
          console.log("[3] Unknown error occurred");
          throw error;
        }
      }
    },
  );

  await t.step(
    "Test Case #4: Editing an expense with negative debt should throw",
    async () => {
      const { expense: expenseId } = await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Initial Expense",
        category: "Test",
        date: new Date("2023-05-20"),
        totalCost: 100,
        group: group1,
        debtMapping: { [userAlice]: 100 },
      });

      try {
        await expenseConcept.editExpense({
          expenseToEdit: expenseId,
          editor: userAlice,
          debtMapping: { [userAlice]: -50 },
          totalCost: 50,
        });
        throw new Error(
          "Expected error for negative debt amount, but none was thrown.",
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log(`[4] Caught expected error:`, error.message);
          assertEquals(
            error.message,
            `Debt for user ${userAlice} cannot be negative`,
          );
        } else {
          console.log("[4] Unknown error occurred");
          throw error;
        }
      } finally {
        await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
      }
    },
  );

  await t.step(
    "Test Case #5: Retrieving expenses from an empty group returns []",
    async () => {
      const emptyGroup = "group:empty" as ID;
      const groupExpenses = await expenseConcept._getExpensesByGroup({
        group: emptyGroup,
      });
      console.log(
        `[5] Expenses in empty group (${emptyGroup}):`,
        groupExpenses,
      );
      assertEquals(groupExpenses.length, 0);
    },
  );

  await client.close();
});
```
