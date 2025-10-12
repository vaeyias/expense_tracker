# test_cases
```
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import DebtConcept from "./DebtConcept.ts";

Deno.test("💰 DebtConcept - full workflow and edge cases", async (t) => {
  const [db, client] = await testDb();
  const debtConcept = new DebtConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const charlie = "user:Charlie" as ID;
  const expense = "expense:1" as ID;

  // Test Case #1: Create, edit, retrieve, and delete a debt record
  await t.step("Test Case #1: Full debt workflow", async () => {
    console.log("[1] Creating PersonalDebts between Alice, Bob, Charlie..");
    const aliceBobDebtRes = await debtConcept.createPersonalDebt({
      userA: alice,
      userB: bob,
    });

    const charlieAliceDebtRes = await debtConcept.createPersonalDebt({
      userA: charlie,
      userB: alice,
    });

    const bobCharlieDebtRes = await debtConcept.createPersonalDebt({
      userA: bob,
      userB: charlie,
    });

    console.log(
      "[1] Updating personal debts.. Bob gives Alice 30. Charlie gives Alice 60",
    );

    await debtConcept.updatePersonalDebt({
      payer: bob,
      receiver: alice,
      amount: 30,
    });

    await debtConcept.updatePersonalDebt({
      payer: charlie,
      receiver: alice,
      amount: 60,
    });

    let aliceBobDebt = await debtConcept.getDebt({
      userA: alice,
      userB: bob,
    });
    let aliceCharlieDebt = await debtConcept.getDebt({
      userA: alice,
      userB: charlie,
    });
    console.log(
      `[1] PersonalDebts: Alice owes Bob: ${
        (aliceBobDebt as { balance: number }).balance
      }, Alice owes Charlie: ${
        (aliceCharlieDebt as { balance: number }).balance
      }`,
    );

    console.log(
      "[1] Updating personal debts.. Alice gives Charlie 60",
    );

    await debtConcept.updatePersonalDebt({
      payer: alice,
      receiver: charlie,
      amount: 60,
    });

    aliceCharlieDebt = await debtConcept.getDebt({
      userA: alice,
      userB: charlie,
    });

    console.log(
      `[1] PersonalDebts: Alice owes Bob: ${
        (aliceBobDebt as { balance: number }).balance
      }, Alice owes Charlie: ${
        (aliceCharlieDebt as { balance: number }).balance
      }`,
    );

    assertEquals((aliceBobDebt as { balance: number }).balance, 30);
    assertEquals((aliceCharlieDebt as { balance: number }).balance, 0);

    console.log("\n");
    const createRes = await debtConcept.createDebtRecord({
      payer: alice,
      totalCost: 100,
      receiversSplit: { [bob]: 50, [alice]: 50 },
      expenseId: expense,
    });
    assertNotEquals(
      "error" in createRes,
      true,
      "DebtRecord creation should succeed",
    );
    const debtId = (createRes as { debtRecord: { _id: ID } }).debtRecord._id;
    console.log(
      `[1] Creating DebtRecord paid by Alice, total=100, Charlie owes Alice 50`,
    );
    console.log(
      `[1] Created DebtRecord ID: ${
        (createRes as { debtRecord: { _id: ID } }).debtRecord._id
      }`,
    );

    aliceBobDebt = await debtConcept.getDebt({
      userA: alice,
      userB: bob,
    });
    aliceCharlieDebt = await debtConcept.getDebt({
      userA: alice,
      userB: charlie,
    });
    console.log(
      `[1] PersonalDebts: Alice owes Bob: ${
        (aliceBobDebt as { balance: number }).balance
      }, Alice owes Charlie: ${
        (aliceCharlieDebt as { balance: number }).balance
      }`,
    );
    assertEquals((aliceBobDebt as { balance: number }).balance, -20);
    assertEquals((aliceCharlieDebt as { balance: number }).balance, 0);

    const editRes = await debtConcept.editDebtRecord({
      debtRecordId: debtId,
      totalCost: 120,
      receiversSplit: { [bob]: 20, [charlie]: 100 },
    });
    assertEquals(
      "error" in editRes,
      false,
      "Editing DebtRecord should succeed",
    );
    console.log(
      `[1] Editing DebtRecord.. totalCost = 120, Bob owes Alice 20,  Charlie owes Alice 100`,
    );

    console.log(
      `[1] Edited DebtRecord ID: ${
        (editRes as { debtRecord: { _id: ID } }).debtRecord._id
      }`,
    );

    aliceBobDebt = await debtConcept.getDebt({
      userA: bob,
      userB: alice,
    });
    aliceCharlieDebt = await debtConcept.getDebt({
      userA: charlie,
      userB: alice,
    });
    console.log(
      `[1] PersonalDebts: Bob owes Alice: ${
        (aliceBobDebt as { balance: number }).balance
      }, Charlie owes Alice: ${
        (aliceCharlieDebt as { balance: number }).balance
      }`,
    );
    assertEquals((aliceBobDebt as { balance: number }).balance, -10);
    assertEquals((aliceCharlieDebt as { balance: number }).balance, 100);
    console.log("\n");
    const deleteRes = await debtConcept.deleteDebtRecord({
      debtRecordId: debtId,
    });
    assertEquals(
      "error" in deleteRes,
      false,
      "Deleting DebtRecord should succeed",
    );
    console.log(
      `[1] Successfully Deleted DebtRecord`,
    );

    const afterDelete = await debtConcept.getDebt({
      userA: charlie,
      userB: alice,
    });
    console.log(
      `[1] After deletion, Charlie owes Alice: ${
        (afterDelete as { balance: number }).balance
      }`,
    );
    assertEquals((afterDelete as { balance: number }).balance, 0);
  });

  // Test Case #2: Invalid total cost should return error
  await t.step("Test Case #2: Invalid total cost returns error", async () => {
    const res = await debtConcept.createDebtRecord({
      payer: alice,
      totalCost: -5,
      receiversSplit: { [bob]: 0 },
      expenseId: expense,
    });
    console.log(
      `[2] Attempted creation with totalCost=0, error: ${
        (res as { error: string }).error
      }`,
    );
    assertEquals("error" in res, true);
  });

  // Test Case #3: Receivers sum mismatch returns error
  await t.step(
    "Test Case #3: Receivers sum mismatch returns error",
    async () => {
      const res = await debtConcept.createDebtRecord({
        payer: alice,
        totalCost: 100,
        receiversSplit: { [bob]: 60, [charlie]: 50 },
        expenseId: expense,
      });
      console.log(
        `[3] Attempted creation with sum mismatch, error: ${
          (res as { error: string }).error
        }`,
      );
      assertEquals("error" in res, true);
    },
  );

  // Test Case #4: Editing DebtRecord with negative amounts returns error
  await t.step(
    "Test Case #4: Editing with negative debt returns error",
    async () => {
      const createRes = await debtConcept.createDebtRecord({
        payer: alice,
        totalCost: 50,
        receiversSplit: { [bob]: 50 },
        expenseId: expense,
      });
      const debtId = (createRes as { debtRecord: { _id: ID } }).debtRecord._id;

      const editRes = await debtConcept.editDebtRecord({
        debtRecordId: debtId,
        totalCost: 50,
        receiversSplit: { [bob]: -10, [alice]: 60 },
      });
      console.log(
        `[4] Attempted edit with negative debt, error: ${
          (editRes as { error: string }).error
        }`,
      );
      assertEquals("error" in editRes, true);

      await debtConcept.deleteDebtRecord({ debtRecordId: debtId });
    },
  );

  // Test Case #5: Querying non-existent debt returns error
  await t.step("Test Case #5: Querying non-existent debt", async () => {
    const res = await debtConcept.getDebt({
      userA: alice,
      userB: "user:Unknown" as ID,
    });
    console.log(
      `[5] Querying non-existent debt, error: ${
        (res as { error: string }).error
      }`,
    );
    assertEquals("error" in res, true);
  });

  await client.close();
});
```
