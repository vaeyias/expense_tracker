/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // Authentication routes: included because they are required for login/lookup
  "/api/Authentication/createUser": "required for creating users",
  "/api/Authentication/editUser": "required for editing user info",
  "/api/Authentication/deleteUser": "required for deleting users",
  "/api/Authentication/authenticate": "required for login",
  "/api/Authentication/_getUserById": "lookup user info by ID",
  "/api/Authentication/_getUserByUsername": "lookup user info by username",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // Debt routes
  "/api/Debt/createDebt",
  "/api/Debt/updateDebt",
  "/api/Debt/deleteDebt",
  "/api/Debt/getDebt",
  "/api/Debt/_listDebtsForUser",
  "/api/Debt/_getNetBalance",

  // Expense routes
  "/api/Expense/createExpense",
  "/api/Expense/editExpense",
  "/api/Expense/deleteExpense",
  "/api/Expense/addUserSplit",
  "/api/Expense/editUserSplit",
  "/api/Expense/removeUserSplit",
  "/api/Expense/_getExpensesByGroup",
  "/api/Expense/_getExpenseById",
  "/api/Expense/_getUserSplitById",
  "/api/Expense/_getSplitsByExpense",
  "/api/Expense/_getSplitForExpense",
  "/api/Expense/_getExpensesByUser",

  // Folder routes
  "/api/Folder/createFolder",
  "/api/Folder/moveFolder",
  "/api/Folder/addGroupToFolder",
  "/api/Folder/removeGroupFromFolder",
  "/api/Folder/deleteFolder",
  "/api/Folder/renameFolder",
  "/api/Folder/_listFolders",
  "/api/Folder/_getFolderById",
  "/api/Folder/_listSubfolders",
  "/api/Folder/_listGroupsInFolder",
  "/api/Folder/_getFolderByGroupAndUser",
  "/api/Folder/_listGroupsInFolderByName",
  "/api/Folder/_getRootId",
  "/api/Folder/_getRootFolder",

  // Group routes
  "/api/Group/createGroup",
  "/api/Group/addUser",
  "/api/Group/removeUser",
  "/api/Group/leaveGroup",
  "/api/Group/deleteGroup",
  "/api/Group/_listMembers",
  "/api/Group/_getGroup",
  "/api/Group/isMember",
  "/api/Group/groupExists",
  "/api/Group/userExists",
];
