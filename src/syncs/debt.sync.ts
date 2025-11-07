import { actions, Sync } from "@engine";
import { Authentication, Debt, Requesting } from "@concepts";

/* ---------- DEBT: CREATE / UPDATE / DELETE ---------- */

export const CreateDebtRequest: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user: user, token }, { user }],
  ),
});

export const CreateDebtValidate: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, { user }],
  ),
  then: actions(
    [Debt.createDebt, { userA, userB }],
  ),
});

export const CreateDebtResponse: Sync = (
  { request, user, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, {}],
    [Debt.createDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const CreateDebtResponseError: Sync = (
  { request, user, userA, userB, token, error },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/createDebt",
      user,
      userA,
      userB,
      token,
    }, {
      request,
    }],
    [Authentication.validateToken, { user, token }, { user }],
    [Debt.createDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const UpdateDebtRequest: Sync = (
  { request, payer, receiver, amount, creator, token },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
      creator,
    }, { request }],
  ),
  then: actions(
    [Authentication.validateToken, { user: creator, token }, {}],
  ),
});

export const UpdateDebtValidate: Sync = (
  { request, payer, receiver, amount, token, creator },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      creator,
      amount,
      token,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
  ),
  then: actions(
    [Debt.updateDebt, { payer, receiver, amount }],
  ),
});

export const UpdateDebtResponse: Sync = (
  { request, payer, receiver, amount, token, creator },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
      creator,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Debt.updateDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const UpdateDebtResponseError: Sync = (
  { request, payer, receiver, amount, token, error, creator },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Debt/updateDebt",
      payer,
      receiver,
      amount,
      token,
      creator,
    }, { request }],
    [Authentication.validateToken, { user: creator, token }, { user: creator }],
    [Debt.updateDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const DeleteDebtRequest: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
  ),
  then: actions(
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
  ),
});

export const DeleteDebtValidate: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
  ),
  then: actions(
    [Debt.deleteDebt, { userA, userB }],
  ),
});

export const DeleteDebtResponse: Sync = (
  { request, userA, userB, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
    [Debt.deleteDebt, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const DeleteDebtResponseError: Sync = (
  { request, userA, userB, token, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Debt/deleteDebt", userA, userB, token }, {
      request,
    }],
    [Authentication.validateToken, { user: userA, token }, { user: userA }],
    [Debt.deleteDebt, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});
