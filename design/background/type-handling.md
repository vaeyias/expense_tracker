# Type_hnadling


## Explicit Casting
- When accessing properties of objects that may have multiple types (e.g., `Result<T>` or objects that may contain errors), check for error and then explicitly cast to the expected type.
- Example:
```ts
const debt = await debtConcept.getDebt({ userA: alice, userB: bob });
const balance = (debt as { balance: number }).balance;
```

```ts
assertNotEquals("error" in aliceBobDebtRes, true, (aliceBobDebtRes as {error:string}).error);
```
