---
timestamp: 'Mon Oct 20 2025 00:33:05 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251020_003305.af43db7c.md]]'
content_id: e2127cbabe59bf41d943b5066d9a6365dbb057e6fe000b2c582c82385eb15908
---

# concept: Authentication

* **purpose**: limit access to known users
* **principle**: after a user registers with a username and a password, they can authenticate with that same username and password and be treated each time as the same user.
* **state**:
  * a set of Users with
    * a username String
    * a password String
* **actions**:
  * `register` (username: String, password: String): (user: User)
    * **requires**: username to not already exist
    * **effects**: creates a new User with given username and password
  * `authenticate` (username: String, password: String): (user: User)
    * **requires**: a User to exist with the given username
    * **effects**: if a User with the given username exists and the given password matches the User's password then access is granted. Otherwise, access is denied.
