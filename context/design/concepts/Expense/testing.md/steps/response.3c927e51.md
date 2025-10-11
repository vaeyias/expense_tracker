---
timestamp: 'Sat Oct 11 2025 14:41:38 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_144138.f205382f.md]]'
content_id: 3c927e5143a935c78e1215a675d5d7c6de1feb2b32336fba1c4edc336e79d9ca
---

# response:

```typescript
import { assertEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ExpenseConcept from "./ExpenseConcept.ts";

Deno.test("ExpenseConcept - create, edit, delete, and retrieve expenses", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  // Define some generic IDs for testing
  const userAlice = "user:Alice" as ID;
  const userBob = "user:Bob" as ID;
  const userCharlie = "user:Charlie" as ID;
  const group1 = "group:1" as ID;

  // Helper function to create an expense document for assertion
  const createExpectedExpense = (
    id: ID,
    creator: ID,
    payer: ID,
    title: string,
    totalCost: number,
    group: ID,
    debtMapping: Record<ID, number>,
    description?: string,
    category: string = "General",
    date?: Date,
  ) => ({
    _id: id,
    creator,
    payer,
    title,
    totalCost,
    group,
    debtMapping,
    description,
    category,
    date: date || new Date(), // Use provided date or current date
  });

  await t.step("Operational Principle: Creating, editing, and retrieving an expense", async () => {
    const initialDate = new Date("2023-01-01");
    const initialDebtMapping = { [userAlice]: 50, [userBob]: 50 };
    const initialTotalCost = 100;

    // Create Expense
    const createResult = await expenseConcept.createExpense({
      creator: userAlice,
      payer: userAlice,
      title: "Groceries",
      category: "Food",
      date: initialDate,
      totalCost: initialTotalCost,
      group: group1,
      debtMapping: initialDebtMapping,
    });
    const expenseId = createResult.expense;
    console.log("Created Expense ID:", expenseId);

    // Retrieve Expense by ID
    const retrievedExpense = await expenseConcept._getExpenseById({
      expenseId: expenseId,
    });
    console.log("Retrieved Expense:", retrievedExpense);
    assertEquals(retrievedExpense?._id, expenseId);
    assertEquals(retrievedExpense?.title, "Groceries");
    assertEquals(retrievedExpense?.totalCost, initialTotalCost);
    assertEquals(retrievedExpense?.creator, userAlice);
    assertEquals(retrievedExpense?.payer, userAlice);
    assertEquals(retrievedExpense?.group, group1);
    assertEquals(retrievedExpense?.debtMapping, initialDebtMapping);

    // Retrieve Expenses by Group
    const groupExpenses = await expenseConcept._getExpensesByGroup({
      group: group1,
    });
    console.log("Expenses in group:", groupExpenses);
    assertEquals(groupExpenses.length, 1);
    assertEquals(groupExpenses[0]._id, expenseId);

    // Edit Expense
    const updatedDate = new Date("2023-01-02");
    const updatedTotalCost = 120;
    const updatedDebtMapping = { [userAlice]: 70, [userBob]: 50 };
    const editResult = await expenseConcept.editExpense({
      expenseToEdit: expenseId,
      editor: userAlice,
      payer: userBob, // Payer changes
      title: "Weekend Groceries",
      category: "Food & Drink",
      date: updatedDate,
      totalCost: updatedTotalCost,
      debtMapping: updatedDebtMapping,
    });
    const editedExpenseId = editResult.newExpense;
    console.log("Edited Expense ID:", editedExpenseId);

    const updatedExpense = await expenseConcept._getExpenseById({
      expenseId: expenseId,
    });
    console.log("Updated Expense:", updatedExpense);
    assertEquals(updatedExpense?._id, expenseId);
    assertEquals(updatedExpense?.title, "Weekend Groceries");
    assertEquals(updatedExpense?.payer, userBob);
    assertEquals(updatedExpense?.totalCost, updatedTotalCost);
    assertEquals(updatedExpense?.date, updatedDate);
    assertEquals(updatedExpense?.debtMapping, updatedDebtMapping);
    assertEquals(updatedExpense?.category, "Food & Drink");

    // Delete Expense
    const deleteResult = await expenseConcept.deleteExpense({
      expenseToDelete: expenseId,
    });
    console.log("Deleted Expense ID:", deleteResult.deletedExpense);
    assertEquals(deleteResult.deletedExpense, expenseId);

    // Verify deletion
    const deletedExpense = await expenseConcept._getExpenseById({
      expenseId: expenseId,
    });
    assertEquals(deletedExpense, null);
  });

  await t.step("Interesting Scenario 1: Creating an expense with an optional description", async () => {
    const initialDate = new Date("2023-02-15");
    const initialDebtMapping = { [userCharlie]: 100 };
    const initialTotalCost = 100;

    const createResult = await expenseConcept.createExpense({
      creator: userCharlie,
      payer: userCharlie,
      title: "Book Purchase",
      category: "Books",
      date: initialDate,
      totalCost: initialTotalCost,
      description: "Bought a new novel",
      group: group1,
      debtMapping: initialDebtMapping,
    });
    const expenseId = createResult.expense;
    console.log("Created Expense with Description ID:", expenseId);

    const retrievedExpense = await expenseConcept._getExpenseById({
      expenseId: expenseId,
    });
    console.log("Retrieved Expense with Description:", retrievedExpense);
    assertEquals(retrievedExpense?.description, "Bought a new novel");

    // Delete the created expense
    await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
  });

  await t.step("Interesting Scenario 2: Attempting to create an expense with invalid total cost", async () => {
    const initialDate = new Date("2023-03-10");
    const initialDebtMapping = { [userAlice]: 0 };
    const invalidTotalCost = 0;

    try {
      await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Invalid Expense",
        category: "Test",
        date: initialDate,
        totalCost: invalidTotalCost,
        group: group1,
        debtMapping: initialDebtMapping,
      });
      // If we reach here, the error was not thrown
      throw new Error("Expected an error for invalid total cost, but none was thrown.");
    } catch (error) {
      console.log("Caught expected error:", error.message);
      assertEquals(error.message, "totalCost must be greater than 0");
    }
  });

  await t.step("Interesting Scenario 3: Attempting to create an expense with mismatched debt mapping sum", async () => {
    const initialDate = new Date("2023-04-05");
    const debtMappingWithMismatch = { [userAlice]: 50, [userBob]: 60 }; // Sum is 110, but totalCost is 100
    const totalCost = 100;

    try {
      await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Mismatched Debt",
        category: "Test",
        date: initialDate,
        totalCost: totalCost,
        group: group1,
        debtMapping: debtMappingWithMismatch,
      });
      throw new Error("Expected an error for mismatched debt mapping sum, but none was thrown.");
    } catch (error) {
      console.log("Caught expected error:", error.message);
      assertEquals(
        error.message,
        `Sum of debtMapping (${110}) does not equal totalCost (${totalCost})`,
      );
    }
  });

  await t.step("Interesting Scenario 4: Attempting to edit an expense with negative debt amount", async () => {
    const initialDate = new Date("2023-05-20");
    const initialDebtMapping = { [userAlice]: 100 };
    const expenseId = (
      await expenseConcept.createExpense({
        creator: userAlice,
        payer: userAlice,
        title: "Initial Expense",
        category: "Test",
        date: initialDate,
        totalCost: 100,
        group: group1,
        debtMapping: initialDebtMapping,
      })
    ).expense;

    const negativeDebtMapping = { [userAlice]: -50 };

    try {
      await expenseConcept.editExpense({
        expenseToEdit: expenseId,
        editor: userAlice,
        debtMapping: negativeDebtMapping,
        totalCost: 50, // Adjust total cost to match the valid part of debt mapping
      });
      throw new Error("Expected an error for negative debt amount, but none was thrown.");
    } catch (error) {
      console.log("Caught expected error:", error.message);
      assertEquals(error.message, `Debt for user ${userAlice} cannot be negative`);
    } finally {
      // Clean up the created expense
      await expenseConcept.deleteExpense({ expenseToDelete: expenseId });
    }
  });

  await t.step("Interesting Scenario 5: Retrieving expenses when no expenses exist for a group", async () => {
    const emptyGroup = "group:empty" as ID;
    const groupExpenses = await expenseConcept._getExpensesByGroup({
      group: emptyGroup,
    });
    console.log(`Expenses in empty group (${emptyGroup}):`, groupExpenses);
    assertEquals(groupExpenses.length, 0);
  });

  await client.close();
});
```
