import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ExpenseConcept from "./ExpenseConcept.ts";
import { WithId } from "npm:mongodb";

Deno.test("--------------- 💰 ExpenseConcept - create, edit, validate, and query 💰 ---------------", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const userAlice = "user:Alice" as ID;
  const userBob = "user:Bob" as ID;
  const group1 = "group:1" as ID;

  const printExpenseDetails = async (expenseId: ID) => {
    const expense = await expenseConcept._getExpenseById({ expenseId });
    if (!expense) {
      console.log(`Expense ${expenseId} not found`);
      return;
    }
    console.log(
      `Expense Details: title=${expense.title}, totalCost=$${expense.totalCost}, numSplits=${expense.userSplits.length}`,
    );

    if (expense.userSplits.length > 0) {
      console.log("   ↳ User Splits:");
      for (const splitId of expense.userSplits) {
        const split = await expenseConcept._getUserSplitById({
          userSplit: splitId,
        });
        console.log(
          `      user=${split?.user}, amount=$${split?.amountOwed}`,
        );
      }
    }
  };

  // --------------------------------------------------
  await t.step(
    "Test Case #1: Full Expense Lifecycle",
    async () => {
      console.log(
        "\n[1.1] Creating an initial expense...",
      );
      const createExpenseRes = await expenseConcept.createExpense({
        user: userAlice,
        group: group1,
      });
      assertNotEquals(
        "error" in createExpenseRes,
        true,
        (createExpenseRes as { error: string }).error,
      );
      const expenseId = (createExpenseRes as { expense: ID }).expense;
      console.log(`[1.1] ✅ Created expense ID: ${expenseId}`);
      await printExpenseDetails(expenseId);

      console.log(
        "[1.2] Alice's split for this expense is $10, creating her split...",
      );
      const aliceSplitRes = await expenseConcept.addUserSplit({
        expense: expenseId,
        user: userAlice,
        amountOwed: 10,
      });
      assertNotEquals(
        "error" in aliceSplitRes,
        true,
        (aliceSplitRes as { error: string }).error,
      );
      const aliceSplitId = (aliceSplitRes as { userSplit: ID }).userSplit;
      console.log(`[1.2] ✅ Alice split ID: ${aliceSplitId}`);

      console.log(
        "[1.3] Bob's split for this expense is $40, creating this split...",
      );
      const bobSplitRes = await expenseConcept.addUserSplit({
        expense: expenseId,
        user: userBob,
        amountOwed: 40,
      });
      assertNotEquals("error" in bobSplitRes, true);
      const bobSplitId = (bobSplitRes as { userSplit: ID }).userSplit;
      console.log(`[1.3] ✅ Bob split ID: ${bobSplitId}`);

      console.log(
        "[1.4] Updating expense to with both splits and totalCost = $50...",
      );
      const editExpenseRes = await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        totalCost: 50,
      });
      assertEquals("error" in editExpenseRes, false);
      console.log(`[1.4] ✅ Edited expense successfully`);
      await printExpenseDetails(expenseId);

      console.log("[1.5] Deleting Alice's split...");
      const removeAliceRes = await expenseConcept.removeUserSplit({
        expense: expenseId,
        userSplit: aliceSplitId,
      });
      assertEquals("error" in removeAliceRes, false);
      console.log(`[1.5] ✅ Removed Alice split ID: ${aliceSplitId}`);
      await printExpenseDetails(expenseId);

      console.log("[1.6] Editing Bob's split to $50...");
      const editBobSplitRes = await expenseConcept.editUserSplit({
        userSplit: bobSplitId,
        amountOwed: 50,
      });
      assertEquals("error" in editBobSplitRes, false);
      console.log(`[1.6] ✅ Bob split updated`);
      await printExpenseDetails(expenseId);

      console.log("[1.7] Deleting expense...");
      const deleteExpenseRes = await expenseConcept.deleteExpense({
        expenseToDelete: expenseId,
      });
      assertEquals("error" in deleteExpenseRes, false);
      console.log(
        `[1.7] Deleted expense ID: ${
          (deleteExpenseRes as { deletedExpense: ID }).deletedExpense
        }`,
      );
    },
  );

  // --------------------------------------------------
  await t.step("Test Case #2: Invalid Splits", async () => {
    console.log("\n[2.1] Creating an expense...");
    const createExpenseRes = await expenseConcept.createExpense({
      user: userAlice,
      group: group1,
    });
    const expenseId = (createExpenseRes as { expense: ID }).expense;
    console.log(`[2.1] ✅ Created expense ID: ${expenseId}`);

    console.log("[2.2] Trying to add a negative split...");
    const negSplitRes = await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userAlice,
      amountOwed: -5,
    });
    assertEquals("error" in negSplitRes, true);
    console.log(
      `[2.2] Got error as expected: ${
        (negSplitRes as { error: string }).error
      }`,
    );

    console.log("[2.3] Creating a split in the expense for Alice...");
    const validSplitRes = await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userAlice,
      amountOwed: 10,
    });
    const aliceSplitId = (validSplitRes as { userSplit: ID }).userSplit;
    console.log(`[2.3] ✅ Alice's split created: ${aliceSplitId}`);

    console.log(
      "[2.3] Updating expense with split and totalCost = $10...",
    );
    const editExpenseRes = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      totalCost: 10,
    });
    assertEquals("error" in editExpenseRes, false);
    await printExpenseDetails(expenseId);

    console.log(
      "[2.4] Trying to add another split for Alice to the same expense...",
    );
    const duplicateSplitRes = await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userAlice,
      amountOwed: 10,
    });
    assertEquals("error" in duplicateSplitRes, true);
    console.log(
      `[2.4] Got error as expected: ${
        (duplicateSplitRes as { error: string }).error
      }`,
    );
  });

  // --------------------------------------------------
  await t.step("Test Case #3: Invalid Expenses", async () => {
    console.log("\n[3.1] Creating expense with two splits...");
    const createExpenseRes = await expenseConcept.createExpense({
      user: userAlice,
      group: group1,
    });
    const expenseId = (createExpenseRes as { expense: ID }).expense;

    await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userAlice,
      amountOwed: 20,
    });
    const bobSplit = await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userBob,
      amountOwed: 30,
    });

    await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      totalCost: 50,
    });
    await printExpenseDetails(expenseId);

    console.log(
      "[3.2] Trying to edit totalCost to 60 (splits don't add up to 60)...",
    );
    const invalidTotalEdit = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      totalCost: 60,
    });
    assertEquals("error" in invalidTotalEdit, true);
    console.log(
      `[3.2] Got error as expected: ${
        (invalidTotalEdit as { error: string }).error
      }`,
    );

    console.log(
      "[3.3] Trying to remove Bob's split while keeping totalCost=50...",
    );
    await expenseConcept.removeUserSplit({
      expense: expenseId,
      userSplit: (bobSplit as { userSplit: ID }).userSplit,
    });
    const invalidSplitEdit = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      totalCost: 50,
    });
    assertEquals("error" in invalidSplitEdit, true);
    console.log(
      `[3.3] Got error as expected: ${
        (invalidSplitEdit as { error: string }).error
      }`,
    );
  });

  // --------------------------------------------------
  await t.step("Test Case #4: Querying Data", async () => {
    console.log("\n[4.1] Creating expense with two splits...");
    const createExpenseRes = await expenseConcept.createExpense({
      user: userAlice,
      group: group1,
    });

    const expenseId = (createExpenseRes as { expense: ID }).expense;

    await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userBob,
      amountOwed: 20,
    });

    await expenseConcept.addUserSplit({
      expense: expenseId,
      user: userAlice,
      amountOwed: 30,
    });

    await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      totalCost: 50,
    });

    await printExpenseDetails(expenseId);

    console.log("[4.2] Getting expenses by group...");
    const groupExpenses = await expenseConcept._getExpensesByGroup({
      group: group1,
    });
    console.log(
      `[4.2] ✅ Group ${group1} has ${groupExpenses.length} expenses`,
    );

    assertEquals(Array.isArray(groupExpenses), true);
    console.log("[4.3] Getting splits by expense ID...");
    const expenseData = await expenseConcept._getSplitsByExpense({ expenseId });

    assertNotEquals(expenseData, null);
    if (expenseData) {
      console.log(
        `[4.3] ✅ Retrieved splits for expense:`,
        expenseData?.splits.map((
          s: { user: ID; amountOwed: number; _id: ID },
        ) => ({ user: s.user, amountOwed: s.amountOwed, id: s._id })),
      );
    }
  });
  await client.close();
});
