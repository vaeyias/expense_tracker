---
timestamp: 'Sat Oct 11 2025 12:24:20 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_122420.e965be4c.md]]'
content_id: 2c1f9a8356b099cf9232668f2caaceeea25b3c8b2be8041a68f2d6d04dd73981
---

# response:

```typescript
import { assertEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import ExpenseConcept from "@concepts/ExpenseConcept.ts";
import { freshID } from "@utils/database.ts";

Deno.test("ExpenseConcept should add and retrieve expenses", async (t) => {
  const [db, client] = await testDb();
  const expenseConcept = new ExpenseConcept(db);

  const userId1 = freshID();
  const categoryId1 = freshID();
  const categoryId2 = freshID();

  await t.step("addExpense should add a new expense", async () => {
    const result = await expenseConcept.addExpense({
      user: userId1,
      category: categoryId1,
      amount: 50.0,
      description: "Groceries",
      date: new Date("2023-10-26"),
    });
    assertEquals(result.expense.amount, 50.0);
    assertEquals(result.expense.description, "Groceries");
  });

  await t.step("getExpenses should retrieve expenses for a specific user and category", async () => {
    // Add another expense for the same user but different category
    await expenseConcept.addExpense({
      user: userId1,
      category: categoryId2,
      amount: 30.0,
      description: "Books",
      date: new Date("2023-10-25"),
    });

    // Add another expense for the same user and category
    const result = await expenseConcept.addExpense({
      user: userId1,
      category: categoryId1,
      amount: 25.0,
      description: "More Groceries",
      date: new Date("2023-10-27"),
    });

    const expenses = await expenseConcept.getExpenses({
      user: userId1,
      category: categoryId1,
    });

    assertEquals(expenses.expenses.length, 2);
    // Check if the added expenses are present and match
    const foundExpense1 = expenses.expenses.find(
      (exp) => exp.description === "Groceries",
    );
    const foundExpense2 = expenses.expenses.find(
      (exp) => exp.description === "More Groceries",
    );
    assertEquals(foundExpense1?.amount, 50.0);
    assertEquals(foundExpense2?.amount, 25.0);
  });

  await t.step("getExpenses should return an empty list if no expenses found", async () => {
    const nonExistentUserId = freshID();
    const expenses = await expenseConcept.getExpenses({
      user: nonExistentUserId,
      category: categoryId1,
    });
    assertEquals(expenses.expenses.length, 0);
  });

  await t.step("deleteExpense should remove an expense", async () => {
    const initialExpenses = await expenseConcept.getExpenses({
      user: userId1,
      category: categoryId1,
    });
    assertEquals(initialExpenses.expenses.length, 2);

    const expenseToDelete = initialExpenses.expenses.find(
      (exp) => exp.description === "Groceries",
    );
    if (!expenseToDelete) {
      throw new Error("Expense to delete not found for testing.");
    }

    await expenseConcept.deleteExpense({ expense: expenseToDelete._id });

    const remainingExpenses = await expenseConcept.getExpenses({
      user: userId1,
      category: categoryId1,
    });
    assertEquals(remainingExpenses.expenses.length, 1);
    assertEquals(
      remainingExpenses.expenses[0].description,
      "More Groceries",
    );
  });

  await t.step("deleteExpense should throw an error if expense does not exist", async () => {
    const nonExistentExpenseId = freshID();
    await assertEquals(
      expenseConcept.deleteExpense({ expense: nonExistentExpenseId }),
      Promise.reject(new Error(`Expense with ID ${nonExistentExpenseId} not found.`)),
    );
  });

  await client.close();
});

// Trace for the principle: "if a user adds an expense for a certain amount and category, and later views their expenses for that category, the added expense will be visible."
// This trace is demonstrated within the "addExpense should add a new expense" and "getExpenses should retrieve expenses for a specific user and category" steps of the test above.
```
