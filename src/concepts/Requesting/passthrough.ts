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
  "/api/Authentication/validateToken": "validate session tokens",
  "/api/Authentication/logout": "logout user",
  "/api/Authentication/testingSomething": "testing endpoint",
  "/api/Folder/_listFolders": "list all folders",
  "/api/Folder/_getFolderById": "get folder by ID",
  "/api/Folder/_listSubfolders": "list subfolders",
  "/api/Folder/_listGroupsInFolder": "list groups in folder",
  "/api/Folder/_getFolderByGroupAndUser": "get folder by group and user",
  "/api/Folder/_listGroupsInFolderByName": "list groups in folder by name",
  "/api/Folder/_getRootId": "get root folder ID",
  "/api/Folder/_getRootFolder": "get root folders",
  "/api/Folder/listSubfolders": "list subfolders",
  "/api/Folder/getRootFolder": "get root folders",
  "/api/Expense/_getExpensesByGroup": "get expenses by group",
  "/api/Expense/_getExpenseById": "get expense by ID",
  "/api/Expense/_getUserSplitById": "get user split by ID",
  "/api/Expense/_getSplitsByExpense": "get splits by expense",
  "/api/Expense/_getSplitForExpense": "get split for expense",
  "/api/Expense/_getExpensesByUser": "get expenses by user",
  "/api/Debt/_listDebtsForUser": "list debts",
  "/api/Debt/_getNetBalance": "get balance",
  // "/api/Group/_listMembers": "list members of a group",
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
  "/api/Group/_listMembers",

  // Debt routes
  "/api/Debt/createDebt",
  "/api/Debt/updateDebt",
  "/api/Debt/deleteDebt",
  "/api/Debt/getDebt",

  // Expense routes
  "/api/Expense/createExpense",
  "/api/Expense/editExpense",
  "/api/Expense/deleteExpense",
  "/api/Expense/addUserSplit",
  "/api/Expense/editUserSplit",
  "/api/Expense/removeUserSplit",

  // Folder routes
  "/api/Folder/createFolder",
  "/api/Folder/moveFolder",
  "/api/Folder/addGroupToFolder",
  "/api/Folder/removeGroupFromFolder",
  "/api/Folder/deleteFolder",
  "/api/Folder/renameFolder",

  // Group routes
  "/api/Group/createGroup",
  "/api/Group/addUser",
  "/api/Group/removeUser",
  "/api/Group/leaveGroup",
  "/api/Group/deleteGroup",
  "/api/Group/isMember",
  "/api/Group/groupExists",
  "/api/Group/userExists",

  "/api/Group/createGroupAndAddToFolder",
  "/api/Group/addUserAndSetup",
  "/api/Group/removeUserAndCleanup",
  "/api/Group/leaveGroupAndCleanup",
  "/api/Expense/createExpenseFull",
];
