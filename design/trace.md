```ts
Authentication.authenticate { username: 'jayy', password: '123' } => {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
}
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => []
[Requesting] Received request for path: /Debt/updateDebt
Requesting.request {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amount: 150,
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/updateDebt'
} => { request: '019a6122-af50-7f64-b6ae-74657e9bab38' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amount: 150
} => { balance: 50 }
[Requesting] Responded to request: 019a6122-af50-7f64-b6ae-74657e9bab38
Requesting.respond { request: '019a6122-af50-7f64-b6ae-74657e9bab38' } => { request: '019a6122-af50-7f64-b6ae-74657e9bab38' }
Authentication.logout {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6122-6cc1-76b8-aaf5-36a3858e50ad'
} => {}
Authentication.authenticate { username: 'jayy', password: '123' } => {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
}
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
[Requesting] Received request for path: /Debt/updateDebt
Requesting.request {
  payer: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 80,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/updateDebt'
} => { request: '019a6123-4383-7dbf-93de-79a6395e157c' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 80
} => { balance: -30 }
[Requesting] Responded to request: 019a6123-4383-7dbf-93de-79a6395e157c
Requesting.respond { request: '019a6123-4383-7dbf-93de-79a6395e157c' } => { request: '019a6123-4383-7dbf-93de-79a6395e157c' }
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1'
} => []
[Requesting] Received request for path: /Group/createGroup
Requesting.request {
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  name: 'Canada',
  description: 'Trip',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  folderName: 'Summer 2026',
  path: '/Group/createGroup'
} => { request: '019a6123-8f62-7b71-a9a5-9f71236ba17e' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Group.createGroup {
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  name: 'Canada',
  description: 'Trip'
} => { group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3' }
Folder.addGroupToFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folderName: 'Summer 2026',
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
} => {}
[Requesting] Responded to request: 019a6123-8f62-7b71-a9a5-9f71236ba17e
Requesting.respond {
  request: '019a6123-8f62-7b71-a9a5-9f71236ba17e',
  group: {
    _id: Symbol(group),
    name: Symbol(name),
    description: Symbol(description),
    creator: Symbol(creator)
  }
} => { request: '019a6123-8f62-7b71-a9a5-9f71236ba17e' }
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1'
} => []
[Requesting] Received request for path: /Group/addUser
Requesting.request {
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3',
  inviter: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  newMember: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Group/addUser'
} => { request: '019a6123-bead-76d6-bee2-6592654d62d6' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Group.addUser {
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3',
  inviter: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  newMember: '019a606f-a83f-752b-a2aa-90d5a2fb6a63'
} => {}
Folder.addGroupToFolder {
  user: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  folderName: '.root',
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
} => {}
[Requesting] Responded to request: 019a6123-bead-76d6-bee2-6592654d62d6
Requesting.respond { request: '019a6123-bead-76d6-bee2-6592654d62d6' } => { request: '019a6123-bead-76d6-bee2-6592654d62d6' }
[Requesting] Received request for path: /Debt/createDebt
Requesting.request {
  userA: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  userB: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/createDebt'
} => { request: '019a6123-c16a-7174-bd22-e58038e9bd50' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.createDebt {
  userA: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  userB: '019a609f-f9df-7f31-8137-6ed8210c93e0'
} => { error: 'Debt already exists between these users.' }
[Requesting] Responded to request: 019a6123-c16a-7174-bd22-e58038e9bd50
Requesting.respond { request: '019a6123-c16a-7174-bd22-e58038e9bd50' } => { request: '019a6123-c16a-7174-bd22-e58038e9bd50' }
[Requesting] Responded to request: 019a6123-c16a-7174-bd22-e58038e9bd50
Requesting.respond {
  request: '019a6123-c16a-7174-bd22-e58038e9bd50',
  error: 'Debt already exists between these users.'
} => { request: '019a6123-c16a-7174-bd22-e58038e9bd50' }
[Requesting] Received request for path: /Group/addUser
Requesting.request {
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3',
  inviter: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  newMember: '019a6051-af33-71d1-b649-38146787e98e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Group/addUser'
} => { request: '019a6123-cfac-7e90-aea0-ba42f782cdf2' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Group.addUser {
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3',
  inviter: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  newMember: '019a6051-af33-71d1-b649-38146787e98e'
} => {}
Folder.addGroupToFolder {
  user: '019a6051-af33-71d1-b649-38146787e98e',
  folderName: '.root',
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
} => {}
[Requesting] Responded to request: 019a6123-cfac-7e90-aea0-ba42f782cdf2
Requesting.respond { request: '019a6123-cfac-7e90-aea0-ba42f782cdf2' } => { request: '019a6123-cfac-7e90-aea0-ba42f782cdf2' }
[Requesting] Received request for path: /Debt/createDebt
Requesting.request {
  userA: '019a6051-af33-71d1-b649-38146787e98e',
  userB: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/createDebt'
} => { request: '019a6123-d1dd-7c93-b1db-048b140dda85' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.createDebt {
  userA: '019a6051-af33-71d1-b649-38146787e98e',
  userB: '019a609f-f9df-7f31-8137-6ed8210c93e0'
} => { error: 'Debt already exists between these users.' }
[Requesting] Responded to request: 019a6123-d1dd-7c93-b1db-048b140dda85
Requesting.respond { request: '019a6123-d1dd-7c93-b1db-048b140dda85' } => { request: '019a6123-d1dd-7c93-b1db-048b140dda85' }
[Requesting] Responded to request: 019a6123-d1dd-7c93-b1db-048b140dda85
Requesting.respond {
  request: '019a6123-d1dd-7c93-b1db-048b140dda85',
  error: 'Debt already exists between these users.'
} => { request: '019a6123-d1dd-7c93-b1db-048b140dda85' }
[Requesting] Received request for path: /Debt/createDebt
Requesting.request {
  userA: '019a6051-af33-71d1-b649-38146787e98e',
  userB: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/createDebt'
} => { request: '019a6123-d395-773d-9e15-18da8275861e' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.createDebt {
  userA: '019a6051-af33-71d1-b649-38146787e98e',
  userB: '019a606f-a83f-752b-a2aa-90d5a2fb6a63'
} => { error: 'Debt already exists between these users.' }
[Requesting] Responded to request: 019a6123-d395-773d-9e15-18da8275861e
Requesting.respond { request: '019a6123-d395-773d-9e15-18da8275861e' } => { request: '019a6123-d395-773d-9e15-18da8275861e' }
[Requesting] Responded to request: 019a6123-d395-773d-9e15-18da8275861e
Requesting.respond {
  request: '019a6123-d395-773d-9e15-18da8275861e',
  error: 'Debt already exists between these users.'
} => { request: '019a6123-d395-773d-9e15-18da8275861e' }
[Requesting] Received request for path: /Expense/createExpense
Requesting.request {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/createExpense'
} => { request: '019a6124-1b99-7286-921f-f613d08701cf' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.createExpense {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  group: '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
} => { expense: '019a6124-1c21-740b-ac99-7d1436e81567' }
[Requesting] Responded to request: 019a6124-1b99-7286-921f-f613d08701cf
Requesting.respond {
  request: '019a6124-1b99-7286-921f-f613d08701cf',
  expense: '019a6124-1c21-740b-ac99-7d1436e81567'
} => { request: '019a6124-1b99-7286-921f-f613d08701cf' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-1d75-7215-ae54-e52157f01cb2' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100
} => { userSplit: '019a6124-1e80-7351-b8a5-6cd55f5b1e3c' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 100
} => { error: 'Debt does not exist between payer and receiver.' }
[Requesting] Responded to request: 019a6124-1d75-7215-ae54-e52157f01cb2
Requesting.respond { request: '019a6124-1d75-7215-ae54-e52157f01cb2' } => { request: '019a6124-1d75-7215-ae54-e52157f01cb2' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  user: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-2007-710b-861f-55b8666c02ff' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amountOwed: 100
} => { userSplit: '019a6124-2112-7957-8537-7cc94587f9f9' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amount: 100
} => { balance: 70 }
[Requesting] Responded to request: 019a6124-2007-710b-861f-55b8666c02ff
Requesting.respond { request: '019a6124-2007-710b-861f-55b8666c02ff' } => { request: '019a6124-2007-710b-861f-55b8666c02ff' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  user: '019a6051-af33-71d1-b649-38146787e98e',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-22de-76bf-a92a-3f32803a3b01' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a6051-af33-71d1-b649-38146787e98e',
  amountOwed: 100
} => { userSplit: '019a6124-23e9-76c6-90e8-869c2f84db00' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a6051-af33-71d1-b649-38146787e98e',
  amount: 100
} => { balance: 0 }
[Requesting] Responded to request: 019a6124-22de-76bf-a92a-3f32803a3b01
Requesting.respond { request: '019a6124-22de-76bf-a92a-3f32803a3b01' } => { request: '019a6124-22de-76bf-a92a-3f32803a3b01' }
[Requesting] Received request for path: /Expense/editExpense
Requesting.request {
  expenseToEdit: '019a6124-1c21-740b-ac99-7d1436e81567',
  title: 'Hotel',
  description: '',
  category: 'Lodging',
  totalCost: 300,
  date: '2025-11-08T00:00:00.000Z',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/editExpense'
} => { request: '019a6124-262c-7abf-bb6e-a6ea4a30fc77' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.editExpense {
  expenseToEdit: '019a6124-1c21-740b-ac99-7d1436e81567',
  newExpense: '019a6124-1c21-740b-ac99-7d1436e81567',
  totalCost: 300,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  description: '',
  date: '2025-11-08T00:00:00.000Z',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  category: 'Lodging',
  title: 'Hotel'
} => { newExpense: '019a6124-1c21-740b-ac99-7d1436e81567' }
[Requesting] Responded to request: 019a6124-262c-7abf-bb6e-a6ea4a30fc77
Requesting.respond { request: '019a6124-262c-7abf-bb6e-a6ea4a30fc77' } => { request: '019a6124-262c-7abf-bb6e-a6ea4a30fc77' }
[Requesting] Received request for path: /Expense/removeUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-1e80-7351-b8a5-6cd55f5b1e3c',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/removeUserSplit'
} => { request: '019a6124-68d2-790c-b6eb-73a18dea388f' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: -100
} => { error: 'Debt does not exist between payer and receiver.' }
Expense.removeUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-1e80-7351-b8a5-6cd55f5b1e3c'
} => {}
[Requesting] Responded to request: 019a6124-68d2-790c-b6eb-73a18dea388f
Requesting.respond { request: '019a6124-68d2-790c-b6eb-73a18dea388f' } => { request: '019a6124-68d2-790c-b6eb-73a18dea388f' }
[Requesting] Received request for path: /Expense/removeUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-2112-7957-8537-7cc94587f9f9',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/removeUserSplit'
} => { request: '019a6124-6b47-7747-ac13-b233581a8d68' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amount: -100
} => { balance: -30 }
Expense.removeUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-2112-7957-8537-7cc94587f9f9'
} => {}
[Requesting] Responded to request: 019a6124-6b47-7747-ac13-b233581a8d68
Requesting.respond { request: '019a6124-6b47-7747-ac13-b233581a8d68' } => { request: '019a6124-6b47-7747-ac13-b233581a8d68' }
[Requesting] Received request for path: /Expense/removeUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-23e9-76c6-90e8-869c2f84db00',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Expense/removeUserSplit'
} => { request: '019a6124-6e0e-7bea-86d9-17d5311f15ed' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a6051-af33-71d1-b649-38146787e98e',
  amount: -100
} => { balance: -100 }
Expense.removeUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  userSplit: '019a6124-23e9-76c6-90e8-869c2f84db00'
} => {}
[Requesting] Responded to request: 019a6124-6e0e-7bea-86d9-17d5311f15ed
Requesting.respond { request: '019a6124-6e0e-7bea-86d9-17d5311f15ed' } => { request: '019a6124-6e0e-7bea-86d9-17d5311f15ed' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-7133-7afd-8919-fa8d8e41236f' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100
} => { userSplit: '019a6124-7238-792d-9c5b-7e997b58a146' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 100
} => { error: 'Debt does not exist between payer and receiver.' }
[Requesting] Responded to request: 019a6124-7133-7afd-8919-fa8d8e41236f
Requesting.respond { request: '019a6124-7133-7afd-8919-fa8d8e41236f' } => { request: '019a6124-7133-7afd-8919-fa8d8e41236f' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-73b4-70e5-a7e4-119a2dbf6bf3' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amountOwed: 100
} => { userSplit: '019a6124-74b7-7a0a-8625-534428ab6264' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  amount: 100
} => { balance: 70 }
[Requesting] Responded to request: 019a6124-73b4-70e5-a7e4-119a2dbf6bf3
Requesting.respond { request: '019a6124-73b4-70e5-a7e4-119a2dbf6bf3' } => { request: '019a6124-73b4-70e5-a7e4-119a2dbf6bf3' }
[Requesting] Received request for path: /Expense/addUserSplit
Requesting.request {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a6051-af33-71d1-b649-38146787e98e',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amountOwed: 100,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Expense/addUserSplit'
} => { request: '019a6124-7676-7d60-8ef4-b08f81e03ca7' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.addUserSplit {
  expense: '019a6124-1c21-740b-ac99-7d1436e81567',
  user: '019a6051-af33-71d1-b649-38146787e98e',
  amountOwed: 100
} => { userSplit: '019a6124-777a-72f0-ac36-94e56b5f52d0' }
Debt.updateDebt {
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  receiver: '019a6051-af33-71d1-b649-38146787e98e',
  amount: 100
} => { balance: 0 }
[Requesting] Responded to request: 019a6124-7676-7d60-8ef4-b08f81e03ca7
Requesting.respond { request: '019a6124-7676-7d60-8ef4-b08f81e03ca7' } => { request: '019a6124-7676-7d60-8ef4-b08f81e03ca7' }
[Requesting] Received request for path: /Expense/editExpense
Requesting.request {
  expenseToEdit: '019a6124-1c21-740b-ac99-7d1436e81567',
  title: 'Hotel',
  description: '3 Rooms',
  category: 'Lodging',
  totalCost: 300,
  date: '2025-11-08T00:00:00.000Z',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Expense/editExpense'
} => { request: '019a6124-798e-70aa-bfbc-0a3febc79412' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Expense.editExpense {
  expenseToEdit: '019a6124-1c21-740b-ac99-7d1436e81567',
  newExpense: '019a6124-1c21-740b-ac99-7d1436e81567',
  totalCost: 300,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  description: '3 Rooms',
  date: '2025-11-08T00:00:00.000Z',
  payer: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  category: 'Lodging',
  title: 'Hotel'
} => { newExpense: '019a6124-1c21-740b-ac99-7d1436e81567' }
[Requesting] Responded to request: 019a6124-798e-70aa-bfbc-0a3febc79412
Requesting.respond { request: '019a6124-798e-70aa-bfbc-0a3febc79412' } => { request: '019a6124-798e-70aa-bfbc-0a3febc79412' }
[Requesting] Received request for path: /Debt/updateDebt
Requesting.request {
  payer: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 70,
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  creator: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  path: '/Debt/updateDebt'
} => { request: '019a6124-ccae-710a-aa0f-277f848c33da' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Debt.updateDebt {
  payer: '019a606f-a83f-752b-a2aa-90d5a2fb6a63',
  receiver: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  amount: 70
} => { balance: 0 }
[Requesting] Responded to request: 019a6124-ccae-710a-aa0f-277f848c33da
Requesting.respond { request: '019a6124-ccae-710a-aa0f-277f848c33da' } => { request: '019a6124-ccae-710a-aa0f-277f848c33da' }
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
[Requesting] Received request for path: /Group/leaveGroup
Requesting.request {
  group: '019a6121-7078-79c4-8007-22431666a8a0',
  member: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Group/leaveGroup'
} => { request: '019a6125-1152-7d91-bc9a-e7d6a38258b6' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Group.leaveGroup {
  group: '019a6121-7078-79c4-8007-22431666a8a0',
  member: '019a609f-f9df-7f31-8137-6ed8210c93e0'
} => { left: true }
[Requesting] Responded to request: 019a6125-1152-7d91-bc9a-e7d6a38258b6
Requesting.respond { request: '019a6125-1152-7d91-bc9a-e7d6a38258b6' } => { request: '019a6125-1152-7d91-bc9a-e7d6a38258b6' }
[Requesting] Received request for path: /Folder/removeGroupFromFolder
Requesting.request {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a609f-fa60-724a-a232-f837844115c9',
  group: '019a6121-7078-79c4-8007-22431666a8a0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Folder/removeGroupFromFolder'
} => { request: '019a6125-14de-73bf-81e4-b1ed0068e116' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Folder.removeGroupFromFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a609f-fa60-724a-a232-f837844115c9',
  group: '019a6121-7078-79c4-8007-22431666a8a0'
} => {}
[Requesting] Responded to request: 019a6125-14de-73bf-81e4-b1ed0068e116
Requesting.respond { request: '019a6125-14de-73bf-81e4-b1ed0068e116' } => { request: '019a6125-14de-73bf-81e4-b1ed0068e116' }
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.getRootFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => []
[Requesting] Received request for path: /Folder/removeGroupFromFolder
Requesting.request {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a609f-fa60-724a-a232-f837844115c9',
  group: '019a60a0-867a-7dd4-aa37-eecf6ba3f858',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Folder/removeGroupFromFolder'
} => { request: '019a6125-4197-7a29-a7dd-bd2fa98e92e2' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Folder.removeGroupFromFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a609f-fa60-724a-a232-f837844115c9',
  group: '019a60a0-867a-7dd4-aa37-eecf6ba3f858'
} => {}
[Requesting] Responded to request: 019a6125-4197-7a29-a7dd-bd2fa98e92e2
Requesting.respond { request: '019a6125-4197-7a29-a7dd-bd2fa98e92e2' } => { request: '019a6125-4197-7a29-a7dd-bd2fa98e92e2' }
[Requesting] Received request for path: /Folder/addGroupToFolder
Requesting.request {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folderName: 'Events',
  group: '019a60a0-867a-7dd4-aa37-eecf6ba3f858',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Folder/addGroupToFolder'
} => { request: '019a6125-43b9-733e-8bfa-248ae8765263' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Folder.addGroupToFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folderName: 'Events',
  group: '019a60a0-867a-7dd4-aa37-eecf6ba3f858'
} => {}
[Requesting] Responded to request: 019a6125-43b9-733e-8bfa-248ae8765263
Requesting.respond { request: '019a6125-43b9-733e-8bfa-248ae8765263' } => { request: '019a6125-43b9-733e-8bfa-248ae8765263' }
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: []
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [ '019a60a0-867a-7dd4-aa37-eecf6ba3f858' ]
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e'
} => [
  {
    _id: '019a6121-c0d0-73cd-9d99-5e500823d467',
    parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    name: 'Events',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [ '019a60a0-867a-7dd4-aa37-eecf6ba3f858' ]
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a6121-c0d0-73cd-9d99-5e500823d467'
} => []
[Requesting] Received request for path: /Folder/deleteFolder
Requesting.request {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a6121-c0d0-73cd-9d99-5e500823d467',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb',
  path: '/Folder/deleteFolder'
} => { request: '019a6125-76c0-7bf7-82ac-94ef3a82cda3' }
Authentication.validateToken {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' }
Folder.deleteFolder {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  folder: '019a6121-c0d0-73cd-9d99-5e500823d467'
} => { folderDeleted: true }
[Requesting] Responded to request: 019a6125-76c0-7bf7-82ac-94ef3a82cda3
Requesting.respond { request: '019a6125-76c0-7bf7-82ac-94ef3a82cda3' } => { request: '019a6125-76c0-7bf7-82ac-94ef3a82cda3' }
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e'
} => []
Folder.getRootFolder { user: '019a609f-f9df-7f31-8137-6ed8210c93e0' } => [
  {
    _id: '019a60a0-1685-7a6a-a512-73f024f3f1e1',
    parent: null,
    name: 'Summer 2026',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [
      '019a6108-9688-723e-b236-fe0a6e9d7ccc',
      '019a6111-718a-7118-b40e-24d93a86d9c6',
      '019a6123-8fe9-7a17-be05-bbb0c659c9f3'
    ]
  },
  {
    _id: '019a60e4-0d1a-72dd-9e39-59f6c683ba5e',
    parent: null,
    name: 'Dorm',
    owner: '019a609f-f9df-7f31-8137-6ed8210c93e0',
    groups: [ '019a60a0-867a-7dd4-aa37-eecf6ba3f858' ]
  }
]
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1'
} => []
Folder.listSubfolders {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  parent: '019a60a0-1685-7a6a-a512-73f024f3f1e1'
} => []
Authentication.logout {
  user: '019a609f-f9df-7f31-8137-6ed8210c93e0',
  token: '019a6123-02df-7fb2-8989-dfab2f44ddcb'
} => {}
```
