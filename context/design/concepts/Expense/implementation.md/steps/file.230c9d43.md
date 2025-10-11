---
timestamp: 'Sat Oct 11 2025 11:13:13 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_111313.299a9687.md]]'
content_id: 230c9d4394b1da187528a335e5a086bf1754898c69a805216be2f23c947cdf8b
---

# file: src/Expense/ExpenseConcept.ts

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";

// Declare collection prefix, use concept name
const PREFIX = "Expense" + ".";

// Generic types of this concept
type User = ID;
type Group = ID;
type Expense = ID;

/**
 * Represents the state of an expense.
 */
interface ExpenseDocument {
  _id: Expense;
  title: string;
  description?: string;
  category: string;
  totalCost: number;
  date: Date;
  payer: User;
  group: Group;
  debtMapping: Record<User, number>; // MongoDB stores Map as embedded documents (records)
}

export default class ExpenseConcept {
  expenses: Collection<ExpenseDocument>;

  constructor(private readonly db: Db) {
    this.expenses = this.db.collection(PREFIX + "expenses");
  }

  /**
   * Creates a new expense.
   * @param payer The user who paid for the expense.
   * @param title The title of the expense.
   * @param category The category of the expense.
   * @param date The date of the expense.
   * @param totalCost The total cost of the expense.
   * @param description An optional description of the expense.
   * @param group The group the expense belongs to.
   * @param debtMapping A mapping of users to the amount they owe for the expense.
   * @returns The created expense ID.
   */
  async createExpense({
    payer,
    title,
    category,
    date,
    totalCost,
    description,
    group,
    debtMapping,
  }: {
    payer: User;
    title: string;
    category: string;
    date: Date;
    totalCost: number;
    description?: string;
    group: Group;
    debtMapping: Record<User, number>;
  }): Promise<{ expense: Expense }> {
    // Basic validation for requires clause (more robust validation might be needed depending on context)
    if (!payer || !group || totalCost <= 0) {
      throw new Error("Invalid input for createExpense");
    }
    for (const userId in debtMapping) {
      if (debtMapping[userId] < 0) {
        throw new Error("Debt amounts must be non-negative");
      }
    }

    const newExpenseId = freshID();
    const expenseDocument: ExpenseDocument = {
      _id: newExpenseId,
      title,
      description,
      category,
      totalCost,
      date,
      payer,
      group,
      debtMapping,
    };

    await this.expenses.insertOne(expenseDocument);

    // This assumes you have a Group concept to validate users belong to the group.
    // For now, we'll just assume they exist.
    // A real implementation would involve synchronizations or checking against a Group concept.

    return { expense: newExpenseId };
  }

  /**
   * Edits an existing expense.
   * @param expenseToEdit The ID of the expense to edit.
   * @param updates An object containing the fields to update.
   * @returns The updated expense ID.
   */
  async editExpense({
    expenseToEdit,
    ...updates
  }: {
    expenseToEdit: Expense;
    payer?: User;
    title?: string;
    description?: string;
    category?: string;
    totalCost?: number;
    date?: Date;
    debtMapping?: Record<User, number>;
  }): Promise<{ newExpense: Expense }> {
    const existingExpense = await this.expenses.findOne({ _id: expenseToEdit });
    if (!existingExpense) {
      throw new Error(`Expense with ID ${expenseToEdit} not found.`);
    }

    // Basic validation for requires clause
    if (updates.totalCost !== undefined && updates.totalCost <= 0) {
      throw new Error("Total cost must be positive.");
    }
    if (updates.debtMapping) {
      for (const userId in updates.debtMapping) {
        if (updates.debtMapping[userId] < 0) {
          throw new Error("Debt amounts must be non-negative");
        }
      }
    }
    // Payer validation against group would be here if Group concept was available

    const updateResult = await this.expenses.updateOne(
      { _id: expenseToEdit },
      { $set: updates }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error(`Failed to find and update expense ${expenseToEdit}`);
    }

    return { newExpense: expenseToEdit };
  }

  /**
   * Deletes an expense.
   * @param expenseToDelete The ID of the expense to delete.
   * @returns The ID of the deleted expense.
   */
  async deleteExpense({
    expenseToDelete,
  }: {
    expenseToDelete: Expense;
  }): Promise<{ deletedExpense: Expense }> {
    const deleteResult = await this.expenses.deleteOne({
      _id: expenseToDelete,
    });

    if (deleteResult.deletedCount === 0) {
      throw new Error(`Expense with ID ${expenseToDelete} not found or could not be deleted.`);
    }

    return { deletedExpense: expenseToDelete };
  }

  // --- Queries (optional, for testing/observability) ---

  /**
   * Retrieves an expense by its ID.
   * @param id The ID of the expense to retrieve.
   * @returns The expense document or null if not found.
   */
  async _getExpenseById(id: Expense): Promise<ExpenseDocument | null> {
    return this.expenses.findOne({ _id: id });
  }

  /**
   * Retrieves all expenses for a given group.
   * @param groupId The ID of the group.
   * @returns An array of expense documents.
   */
  async _getExpensesByGroup(groupId: Group): Promise<ExpenseDocument[]> {
    return this.expenses.find({ group: groupId }).toArray();
  }

  /**
   * Retrieves all expenses paid by a specific user.
   * @param userId The ID of the user.
   * @returns An array of expense documents.
   */
  async _getExpensesByPayer(userId: User): Promise<ExpenseDocument[]> {
    return this.expenses.find({ payer: userId }).toArray();
  }

  /**
   * Calculates the total amount spent by a user across all their expenses.
   * This is a more complex query that might involve aggregation.
   * @param userId The ID of the user.
   * @returns The total amount spent.
   */
  async _getTotalSpentByUser(userId: User): Promise<number> {
    const expenses = await this.expenses.find({ payer: userId }).toArray();
    return expenses.reduce((sum, expense) => sum + expense.totalCost, 0);
  }

  /**
   * Calculates the total amount owed by a user within a specific group.
   * This would require logic to parse the debtMapping.
   * @param userId The ID of the user.
   * @param groupId The ID of the group.
   * @returns The total amount owed by the user in that group.
   */
  async _getTotalOwedByUserInGroup(userId: User, groupId: Group): Promise<number> {
    const expenses = await this.expenses.find({ group: groupId }).toArray();
    let totalOwed = 0;
    for (const expense of expenses) {
      if (expense.debtMapping && expense.debtMapping[userId]) {
        totalOwed += expense.debtMapping[userId];
      }
    }
    return totalOwed;
  }
}
```

### Explanation of the Implementation:

1. **Imports**: We import necessary types and functions from `npm:mongodb` and our utility files.
2. **Prefix and Generic Types**: `PREFIX` is defined for MongoDB collection naming. `User`, `Group`, and `Expense` are defined as `ID` types, indicating they are strings used as identifiers.
3. **`ExpenseDocument` Interface**: This interface defines the structure of a document stored in the `Expense` collection in MongoDB.
   * `_id`: This will be the unique identifier for each expense. We use the generic `Expense` type (which is an `ID`).
   * `debtMapping`: MongoDB doesn't have a direct `Map` type like some programming languages. We represent it as a `Record<User, number>`, which is effectively a JSON object where keys are user IDs (strings) and values are the amounts owed (numbers).
4. **`ExpenseConcept` Class**:
   * **Constructor**: It takes a `Db` instance and initializes the `expenses` collection.
   * **`createExpense` Method**:
     * It takes all the required parameters for creating an expense.
     * **Requires Clause Validation**: Basic checks are performed to ensure `payer`, `group`, `totalCost`, and `debtMapping` values meet the `requires` conditions. In a full system, you'd likely call other concepts (e.g., `GroupConcept` to verify `payer` and `debtMapping` users are in the `group`).
     * A new `Expense` ID is generated using `freshID()`.
     * An `expenseDocument` is created, mapping the input parameters to the `ExpenseDocument` interface.
     * `this.expenses.insertOne(expenseDocument)` inserts the new expense into MongoDB.
     * It returns an object `{ expense: newExpenseId }` as per the action signature.
   * **`editExpense` Method**:
     * It takes the `expenseToEdit` ID and an object of `updates`.
     * **Requires Clause Validation**: It first fetches the existing expense and performs checks on the provided updates (e.g., `totalCost > 0`).
     * `this.expenses.updateOne` is used to update the document. `$set` operator is used to apply only the provided updates.
     * It returns an object `{ newExpense: expenseToEdit }` as per the action signature.
   * **`deleteExpense` Method**:
     * It takes the `expenseToDelete` ID.
     * `this.expenses.deleteOne` removes the document from MongoDB.
     * It returns an object `{ deletedExpense: expenseToDelete }` as per the action signature.
   * **Queries (`_` prefixed methods)**: These are provided for testing and observing the state of the concept. They demonstrate how to query the MongoDB collection for different criteria.
     * `_getExpenseById`: Fetches a single expense by its `_id`.
     * `_getExpensesByGroup`: Finds all expenses belonging to a specific group.
     * `_getExpensesByPayer`: Finds all expenses paid by a specific user.
     * `_getTotalSpentByUser`: Demonstrates a simple aggregation to sum up costs.
     * `_getTotalOwedByUserInGroup`: Shows how to iterate through expenses and sum up amounts from the `debtMapping` to determine what a user owes.

### How to use this implementation:

1. **Setup**:
   * Ensure you have Deno installed.
   * Create a `.env` file in your project root with your MongoDB connection details:
     ```env
     MONGO_URL=mongodb://localhost:27017
     MONGO_DB_NAME=concept_db
     ```
   * Set up the `utils` directory with `types.ts` and `database.ts` as provided earlier.
   * Create the `src/Expense` directory and place `ExpenseConcept.ts` inside it.

2. **Initialization and Usage (Example)**:

   ```typescript
   // main.ts
   import { getDb } from "@utils/database.ts";
   import ExpenseConcept from "./src/Expense/ExpenseConcept.ts";
   import { ID } from "@utils/types.ts";

   async function main() {
     const [db, client] = await getDb();
     const expenseConcept = new ExpenseConcept(db);

     // Example Users and Groups (as IDs)
     const userAlice = "user:Alice" as ID;
     const userBob = "user:Bob" as ID;
     const userCharlie = "user:Charlie" as ID;
     const group1 = "group:DinnerParty" as ID;

     try {
       // Create an expense
       const createResult = await expenseConcept.createExpense({
         payer: userAlice,
         title: "Dinner",
         category: "Food",
         date: new Date(),
         totalCost: 150.50,
         description: "Dinner at Italian place",
         group: group1,
         debtMapping: {
           [userAlice]: 50.50, // Alice paid 150.50, owes 50.50 to herself (or for her share)
           [userBob]: 50.00,
           [userCharlie]: 50.00,
         },
       });
       console.log("Expense created:", createResult);

       const newExpenseId = createResult.expense;

       // Retrieve the created expense
       const fetchedExpense = await expenseConcept._getExpenseById(newExpenseId);
       console.log("Fetched expense:", fetchedExpense);

       // Edit the expense
       const editResult = await expenseConcept.editExpense({
         expenseToEdit: newExpenseId,
         totalCost: 160.00,
         debtMapping: {
           [userAlice]: 60.00,
           [userBob]: 50.00,
           [userCharlie]: 50.00,
         },
       });
       console.log("Expense edited:", editResult);

       // Retrieve expenses for the group
       const groupExpenses = await expenseConcept._getExpensesByGroup(group1);
       console.log("Expenses for group:", groupExpenses);

       // Calculate total spent by Alice
       const totalAliceSpent = await expenseConcept._getTotalSpentByUser(userAlice);
       console.log("Total spent by Alice:", totalAliceSpent);

       // Calculate total owed by Bob in group1
       const totalBobOwed = await expenseConcept._getTotalOwedByUserInGroup(userBob, group1);
       console.log("Total owed by Bob in group1:", totalBobOwed);


       // Delete the expense
       const deleteResult = await expenseConcept.deleteExpense({
         expenseToDelete: newExpenseId,
       });
       console.log("Expense deleted:", deleteResult);

       // Verify deletion
       const deletedExpense = await expenseConcept._getExpenseById(newExpenseId);
       console.log("Expense after deletion:", deletedExpense); // Should be null

     } catch (error) {
       console.error("An error occurred:", error);
     } finally {
       await client.close();
     }
   }

   main();
   ```

This implementation adheres to the concept design principles, using MongoDB for state persistence and defining explicit actions and queries. The generic `ID` type helps maintain type safety across different concepts.
