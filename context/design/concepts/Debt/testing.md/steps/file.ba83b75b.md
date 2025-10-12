---
timestamp: 'Sat Oct 11 2025 23:55:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251011_235516.92845a4d.md]]'
content_id: ba83b75b1d11d6c80fddd830c50c45b6780735674e96c64890b8f3e52ff37151
---

# file: src/debt/debtConcept.test.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts"; // Assuming ID is a type alias for string with branding
import { freshID } from "@utils/database.ts";
import DebtConcept, { PersonalDebt, DebtRecord } from "./debtConcept.ts";
import { testDb } from "@utils/database.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";

// Mocking freshID for predictable test IDs
let mockFreshIDCounter = 0;
const mockFreshID = async (): Promise<ID> => {
  mockFreshIDCounter++;
  return `mockId${mockFreshIDCounter}` as ID;
};

// Helper to create a DebtConcept instance with mock freshID
const createDebtConcept = async (
  db: Db,
): Promise<{ debtConcept: DebtConcept; client: any }> => {
  const [testDbInstance, client] = await testDb();
  const debtConcept = new DebtConcept(testDbInstance);
  // Override the internal freshID with our mock for predictability
  (debtConcept as any).freshID = mockFreshID;
  // Reset counter for each test
  mockFreshIDCounter = 0;
  return { debtConcept, client };
};

Deno.test("DebtConcept - Personal Debts", async (t) => {
  const [db, client] = await testDb();
  const debtConcept = new DebtConcept(db);
  const userAlice: User = "alice" as User;
  const userBob: User = "bob" as User;
  const userCharlie: User = "charlie" as User;

  t.step("createPersonalDebt: successfully creates a new personal debt", async () => {
    const res = await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob });
    assertEquals("debt" in res, true);
    assertEquals(res.debt.userA, userAlice);
    assertEquals(res.debt.userB, userBob);
    assertEquals(res.debt.balance, 0);
  });

  t.step("createPersonalDebt: returns error if personal debt already exists", async () => {
    await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob }); // Create first
    const res = await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Try to create again (order reversed)
    assertEquals("error" in res, true);
    assertEquals(res.error, "Personal debt already exists between these users.");
  });

  t.step("updatePersonalDebt: updates balance when userA pays userB", async () => {
    await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob }); // Alice owes Bob initially 0
    const res = await debtConcept.updatePersonalDebt({ payer: userAlice, receiver: userBob, amount: 10 }); // Alice pays Bob
    assertEquals("balance" in res, true);
    assertEquals(res.balance, -10); // Alice owes Bob 10 less (or Bob owes Alice 10 more)
  });

  t.step("updatePersonalDebt: updates balance when userB pays userA", async () => {
    await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob }); // Alice owes Bob initially 0
    const res = await debtConcept.updatePersonalDebt({ payer: userBob, receiver: userAlice, amount: 10 }); // Bob pays Alice
    assertEquals("balance" in res, true);
    assertEquals(res.balance, 10); // Alice owes Bob 10 more
  });

  t.step("updatePersonalDebt: returns error if personal debt does not exist", async () => {
    const res = await debtConcept.updatePersonalDebt({ payer: userAlice, receiver: userCharlie, amount: 10 });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Personal debt does not exist between payer and receiver.");
  });

  t.step("getDebt: retrieves the correct balance when userA owes userB", async () => {
    await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob });
    await debtConcept.updatePersonalDebt({ payer: userAlice, receiver: userBob, amount: 25 }); // Alice owes Bob 25
    const res = await debtConcept.getDebt({ userA: userAlice, userB: userBob });
    assertEquals("balance" in res, true);
    assertEquals(res.balance, -25); // Alice owes Bob 25
  });

  t.step("getDebt: retrieves the correct balance when userB owes userA", async () => {
    await debtConcept.createPersonalDebt({ userA: userAlice, userB: userBob });
    await debtConcept.updatePersonalDebt({ payer: userBob, receiver: userAlice, amount: 30 }); // Bob owes Alice 30
    const res = await debtConcept.getDebt({ userA: userAlice, userB: userBob });
    assertEquals("balance" in res, true);
    assertEquals(res.balance, 30); // Bob owes Alice 30
  });

  t.step("getDebt: returns error if personal debt does not exist", async () => {
    const res = await debtConcept.getDebt({ userA: userAlice, userB: userCharlie });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Personal debt does not exist between these users.");
  });

  await client.close();
});

Deno.test("DebtConcept - Debt Records", async (t) => {
  const { debtConcept, client } = await createDebtConcept(await testDb().then(r => r[0])); // Use mock freshID

  const userAlice: User = "alice" as User;
  const userBob: User = "bob" as User;
  const userCharlie: User = "charlie" as User;
  const userDavid: User = "david" as User;

  t.step("createDebtRecord: successfully creates a debt record and updates personal debts", async () => {
    // Pre-condition: personal debts might not exist, they should be created implicitly or handled by updatePersonalDebt
    // For this test, let's ensure they are created if they don't exist for simplicity of testing createDebtRecord itself.
    await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Bob owes Alice 0
    await debtConcept.createPersonalDebt({ userA: userCharlie, userB: userAlice }); // Charlie owes Alice 0

    const receivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, 50],
    ]);
    const totalCost = 100;
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: totalCost,
      receiversSplit: receivers,
    });

    assertEquals("debtRecord" in res, true);
    const debtRecord = res.debtRecord;
    assertEquals(debtRecord.payer, userAlice);
    assertEquals(debtRecord.totalCost, totalCost);
    assertEquals(debtRecord.receivers.size, 2);
    assertEquals(debtRecord.receivers.get(userBob), 50);
    assertEquals(debtRecord.receivers.get(userCharlie), 50);

    // Verify personal debt updates
    const bobAliceDebt = await debtConcept.getDebt({ userA: userAlice, userB: userBob });
    assertEquals("balance" in bobAliceDebt, true);
    assertEquals(bobAliceDebt.balance, -50); // Alice owes Bob 50

    const charlieAliceDebt = await debtConcept.getDebt({ userA: userAlice, userB: userCharlie });
    assertEquals("balance" in charlieAliceDebt, true);
    assertEquals(charlieAliceDebt.balance, -50); // Alice owes Charlie 50
  });

  t.step("createDebtRecord: returns error if receivers split is empty", async () => {
    const receivers = new Map<User, number>();
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Receivers split cannot be empty.");
  });

  t.step("createDebtRecord: returns error if total cost is negative", async () => {
    const receivers = new Map<User, number>([[userBob, 50]]);
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: -100,
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Total cost cannot be negative.");
  });

  t.step("createDebtRecord: returns error if any amount in receivers split is negative", async () => {
    const receivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, -50],
    ]);
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 0, // Sum will not match if one is negative
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Amounts in receivers split cannot be negative.");
  });

  t.step("createDebtRecord: returns error if sum of receivers split does not equal total cost", async () => {
    const receivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, 60],
    ]);
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Sum of receiver splits must equal total cost.");
  });

  t.step("createDebtRecord: handles payer also being a receiver without affecting personal debt", async () => {
    // Alice pays herself, Bob owes Alice
    await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Bob owes Alice 0

    const receivers = new Map<User, number>([
      [userAlice, 100], // Alice is also a receiver
      [userBob, 0], // Bob owes nothing in this record
    ]);
    const totalCost = 100;
    const res = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: totalCost,
      receiversSplit: receivers,
    });

    assertEquals("debtRecord" in res, true);
    const debtRecord = res.debtRecord;
    assertEquals(debtRecord.payer, userAlice);
    assertEquals(debtRecord.totalCost, totalCost);
    assertEquals(debtRecord.receivers.get(userAlice), 100);
    assertEquals(debtRecord.receivers.get(userBob), 0);

    // Verify personal debt updates (Alice paying Alice shouldn't change anything)
    const bobAliceDebt = await debtConcept.getDebt({ userA: userAlice, userB: userBob });
    assertEquals("balance" in bobAliceDebt, true);
    assertEquals(bobAliceDebt.balance, 0); // No change as Alice paid herself
  });

  t.step("editDebtRecord: successfully edits a debt record and recalculates personal debts", async () => {
    // Setup: Alice pays Bob 100, split 50/50 between Bob and Charlie
    await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Bob owes Alice 0
    await debtConcept.createPersonalDebt({ userA: userCharlie, userB: userAlice }); // Charlie owes Alice 0

    const initialReceivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, 50],
    ]);
    const initialCreateRes = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: initialReceivers,
    });
    const debtRecordId = initialCreateRes.debtRecord._id;

    // Initial state: Alice owes Bob 50, Alice owes Charlie 50
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -50);
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -50);

    // Edit: Alice pays Bob 150, split 75/75 between Bob and Charlie
    const updatedReceivers = new Map<User, number>([
      [userBob, 75],
      [userCharlie, 75],
    ]);
    const editRes = await debtConcept.editDebtRecord({
      debtRecordId: debtRecordId,
      totalCost: 150,
      receiversSplit: updatedReceivers,
    });

    assertEquals("debtRecord" in editRes, true);
    const updatedDebtRecord = editRes.debtRecord;
    assertEquals(updatedDebtRecord.totalCost, 150);
    assertEquals(updatedDebtRecord.receivers.get(userBob), 75);
    assertEquals(updatedDebtRecord.receivers.get(userCharlie), 75);

    // Verify personal debt updates after edit
    // Old state: Alice owes Bob 50, Alice owes Charlie 50
    // New state: Alice owes Bob 75, Alice owes Charlie 75
    // Change for Bob: -50 -> -75. Net change -25.
    // Change for Charlie: -50 -> -75. Net change -25.
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -75);
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -75);
  });

  t.step("editDebtRecord: returns error if debt record not found", async () => {
    const receivers = new Map<User, number>([[userBob, 50]]);
    const res = await debtConcept.editDebtRecord({
      debtRecordId: "nonExistentId" as ID,
      totalCost: 100,
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Debt record not found.");
  });

  t.step("editDebtRecord: returns error if total cost is not positive", async () => {
    // Setup a debt record first
    const initialReceivers = new Map<User, number>([[userBob, 50]]);
    const initialCreateRes = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: initialReceivers,
    });
    const debtRecordId = initialCreateRes.debtRecord._id;

    const receivers = new Map<User, number>([[userBob, 50]]);
    const res = await debtConcept.editDebtRecord({
      debtRecordId: debtRecordId,
      totalCost: 0, // Invalid total cost
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Total cost must be positive.");
  });

  t.step("editDebtRecord: returns error if sum of receivers split does not equal total cost", async () => {
    // Setup a debt record first
    const initialReceivers = new Map<User, number>([[userBob, 50]]);
    const initialCreateRes = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: initialReceivers,
    });
    const debtRecordId = initialCreateRes.debtRecord._id;

    const receivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, 60],
    ]);
    const res = await debtConcept.editDebtRecord({
      debtRecordId: debtRecordId,
      totalCost: 100, // Mismatch
      receiversSplit: receivers,
    });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Sum of receiver splits must equal total cost.");
  });


  t.step("deleteDebtRecord: successfully deletes a debt record and adjusts personal debts", async () => {
    // Setup: Alice pays Bob 100, split 50/50 between Bob and Charlie
    await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Bob owes Alice 0
    await debtConcept.createPersonalDebt({ userA: userCharlie, userB: userAlice }); // Charlie owes Alice 0

    const initialReceivers = new Map<User, number>([
      [userBob, 50],
      [userCharlie, 50],
    ]);
    const initialCreateRes = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: 100,
      receiversSplit: initialReceivers,
    });
    const debtRecordId = initialCreateRes.debtRecord._id;

    // Initial state: Alice owes Bob 50, Alice owes Charlie 50
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -50);
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -50);

    // Delete the debt record
    const deleteRes = await debtConcept.deleteDebtRecord({ debtRecordId: debtRecordId });

    // Verify deletion
    assertEquals(deleteRes, {}, "Deletion should succeed");
    const deletedRecord = await (debtConcept.debtRecords as Collection<DebtRecord>).findOne({ _id: debtRecordId });
    assertEquals(deletedRecord, null, "Debt record should be deleted");

    // Verify personal debt adjustments: deleting the record should revert the balances
    // Original state before the debt record: Alice owes Bob 0, Alice owes Charlie 0
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, 0);
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, 0);
  });

  t.step("deleteDebtRecord: returns error if debt record not found", async () => {
    const res = await debtConcept.deleteDebtRecord({ debtRecordId: "nonExistentId" as ID });
    assertEquals("error" in res, true);
    assertEquals(res.error, "Debt record not found.");
  });

  t.step("deleteDebtRecord: correctly adjusts balances when payer is also a receiver in the deleted record", async () => {
    // Setup: Alice pays herself and Bob for an expense. Bob owes Alice.
    await debtConcept.createPersonalDebt({ userA: userBob, userB: userAlice }); // Bob owes Alice 0

    const receivers = new Map<User, number>([
      [userAlice, 50], // Alice receives from herself
      [userBob, 50], // Bob owes Alice
    ]);
    const totalCost = 100;
    const createRes = await debtConcept.createDebtRecord({
      payer: userAlice,
      totalCost: totalCost,
      receiversSplit: receivers,
    });
    const debtRecordId = createRes.debtRecord._id;

    // After creation: Bob owes Alice 50. Alice's debt to herself is irrelevant.
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -50);

    // Delete the debt record. The amount Bob owed Alice should be reversed.
    await debtConcept.deleteDebtRecord({ debtRecordId: debtRecordId });

    // After deletion: Bob should no longer owe Alice for this record.
    assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, 0);
  });

  await client.close();
});


// Helper function to create a DebtRecord for testing
async function createSampleDebtRecord(
  debtConcept: DebtConcept,
  payer: User,
  receiversSplit: Map<User, number>,
  totalCost: number,
): Promise<DebtRecord> {
  const res = await debtConcept.createDebtRecord({ payer, totalCost, receiversSplit });
  if ("error" in res) {
    throw new Error(`Failed to create sample debt record: ${res.error}`);
  }
  return res.debtRecord;
}

// Helper function to create PersonalDebts if they don't exist
async function ensurePersonalDebtsExist(
  debtConcept: DebtConcept,
  userA: User,
  userB: User,
) {
  const debt = await debtConcept.personalDebts.findOne({
    $or: [
      { userA: userA, userB: userB },
      { userA: userB, userB: userA },
    ],
  });
  if (!debt) {
    await debtConcept.createPersonalDebt({ userA, userB });
  }
}


// # trace:
// 1. A user (e.g., Alice) pays for an expense.
// 2. The cost is split among several other users (e.g., Bob, Charlie).
// 3. A `DebtRecord` is created to log this transaction.
// 4. For each user in the split (Bob, Charlie), their personal debt balance with the payer (Alice) is updated. If Bob owes Alice, the `balance` in their `PersonalDebt` record (where userA is Bob and userB is Alice) increases. If Alice owes Bob, it decreases.
// 5. This process is repeated for multiple expenses, potentially involving different payers and receivers.
// 6. The `getDebt` function can then be used to query the net balance between any two users, aggregating across all relevant `PersonalDebt` records.
// 7. If an expense is edited or deleted, the corresponding `DebtRecord` is updated or removed, and the personal debt balances are recalculated accordingly by reversing the old transactions and applying new ones.

Deno.test("DebtConcept - Principle: Shared Expense and Personal Debt Aggregation", async () => {
  const { debtConcept, client } = await createDebtConcept(await testDb().then(r => r[0])); // Use mock freshID

  const userAlice: User = "alice" as User;
  const userBob: User = "bob" as User;
  const userCharlie: User = "charlie" as User;

  // Ensure personal debts exist for the users involved
  await ensurePersonalDebtsExist(debtConcept, userAlice, userBob);
  await ensurePersonalDebtsExist(debtConcept, userAlice, userCharlie);
  await ensurePersonalDebtsExist(debtConcept, userBob, userCharlie);


  // Expense 1: Alice pays for dinner, Bob and Charlie owe Alice
  const receivers1 = new Map<User, number>([
    [userBob, 75], // Bob owes Alice 75
    [userCharlie, 25], // Charlie owes Alice 25
  ]);
  await createSampleDebtRecord(debtConcept, userAlice, receivers1, 100);

  // Verify individual debts after Expense 1
  // Alice owes Bob: -75 (because Bob owes Alice)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -75);
  // Alice owes Charlie: -25 (because Charlie owes Alice)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -25);
  // Bob owes Charlie: 0 (no direct interaction yet)
  assertEquals((await debtConcept.getDebt({ userA: userBob, userB: userCharlie })).balance, 0);


  // Expense 2: Bob pays for movie tickets, Alice owes Bob
  const receivers2 = new Map<User, number>([
    [userAlice, 60], // Alice owes Bob 60
  ]);
  await createSampleDebtRecord(debtConcept, userBob, receivers2, 60);

  // Verify individual debts after Expense 2
  // Alice owes Bob: -75 (from Exp1) + 60 (from Exp2) = -15
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -15);
  // Alice owes Charlie: -25 (no change)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -25);
  // Bob owes Charlie: 0 (no change)
  assertEquals((await debtConcept.getDebt({ userA: userBob, userB: userCharlie })).balance, 0);


  // Expense 3: Charlie pays for snacks, Alice owes Charlie
  const receivers3 = new Map<User, number>([
    [userAlice, 40], // Alice owes Charlie 40
  ]);
  await createSampleDebtRecord(debtConcept, userCharlie, receivers3, 40);

  // Verify individual debts after Expense 3
  // Alice owes Bob: -15 (no change)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -15);
  // Alice owes Charlie: -25 (from Exp1) + 40 (from Exp3) = 15
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, 15);
  // Bob owes Charlie: 0 (no change)
  assertEquals((await debtConcept.getDebt({ userA: userBob, userB: userCharlie })).balance, 0);


  // Final check of net balances
  // Alice owes Bob: 15 (Alice should pay Bob 15)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -15);
  // Charlie owes Alice: -15 (Alice owes Charlie 15)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, 15);
  // Bob owes Charlie: 0
  assertEquals((await debtConcept.getDebt({ userA: userBob, userB: userCharlie })).balance, 0);

  await client.close();
});


Deno.test("DebtConcept - Edit and Delete Principle", async () => {
  const { debtConcept, client } = await createDebtConcept(await testDb().then(r => r[0])); // Use mock freshID

  const userAlice: User = "alice" as User;
  const userBob: User = "bob" as User;
  const userCharlie: User = "charlie" as User;

  // Ensure personal debts exist
  await ensurePersonalDebtsExist(debtConcept, userAlice, userBob);
  await ensurePersonalDebtsExist(debtConcept, userAlice, userCharlie);

  // --- Scenario: Create and Edit ---
  // Initial expense: Alice pays 100, split 50/50 between Bob and Charlie
  const initialReceivers = new Map<User, number>([
    [userBob, 50], // Bob owes Alice 50
    [userCharlie, 50], // Charlie owes Alice 50
  ]);
  const initialCreateRes = await createSampleDebtRecord(debtConcept, userAlice, initialReceivers, 100);
  const debtRecordIdToEdit = initialCreateRes._id;

  // Check initial state: Alice owes Bob 50, Alice owes Charlie 50
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -50);
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -50);

  // Edit the expense: Alice pays 120, split 60/60
  const editedReceivers = new Map<User, number>([
    [userBob, 60], // Bob owes Alice 60
    [userCharlie, 60], // Charlie owes Alice 60
  ]);
  await debtConcept.editDebtRecord({
    debtRecordId: debtRecordIdToEdit,
    totalCost: 120,
    receiversSplit: editedReceivers,
  });

  // Check state after edit: Alice owes Bob 60, Alice owes Charlie 60
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -60);
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -60);

  // --- Scenario: Create and Delete ---
  // Create another expense: Bob pays 80, Alice owes Bob 80
  const initialReceiversDelete = new Map<User, number>([
    [userAlice, 80],
  ]);
  const initialCreateResDelete = await createSampleDebtRecord(debtConcept, userBob, initialReceiversDelete, 80);
  const debtRecordIdToDelete = initialCreateResDelete._id;

  // Check state after creation: Alice owes Bob 60 (from edit) + 80 (from this new record) = 140
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -140);

  // Delete the second expense
  await debtConcept.deleteDebtRecord({ debtRecordId: debtRecordIdToDelete });

  // Check state after deletion: Alice should only owe Bob 60 again (from the first edited expense)
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userBob })).balance, -60);
  // Charlie's debt is unaffected by this deletion
  assertEquals((await debtConcept.getDebt({ userA: userAlice, userB: userCharlie })).balance, -60);


  await client.close();
});
```
