```
concept Authentication
    purpose limit access to known users
    principle after a user registers with a username and a password, they can authenticate with that same username and password and be treated each time as the same user.
    state
        a set of Users with
            a username String
            a displayName String
            a password String
            a token String

    actions
        createUser (username: String, password: String): (user: User)
            requires username (not case sensitive) to not already exist
            effects creates a new User with given username and password

        editUser(user:User, token:String, newDisplayName:String):
            requires token matches the token stored in user
            effects changes user's display name to the new display name

        authenticate (username: String, password: String): (user: User, token: String)
            requires a User to exist with the given username
            effects if a User with the given username exists and the given password matches the User's password then the user is authenticated and a session token is generated. Otherwise, access is denied.

        validateToken (user:User, token:String):(user:User)
            requires user exists and token matches
            effects verifies that user if authenticated.
```
