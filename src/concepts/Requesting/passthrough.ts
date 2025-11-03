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

  // Group routes
  "/api/Group/createGroup",
  "/api/Group/addUser",
  "/api/Group/removeUser",
  "/api/Group/leaveGroup",
  "/api/Group/deleteGroup",
  "/api/Group/_listMembers",
  "/api/Group/isMember",
  "/api/Group/groupExists",
  "/api/Group/userExists",
];
