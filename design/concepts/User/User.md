```
concept User
    purpose provides a unique identity for each person using the application
    principle a user is created with a username
    state
        a set of Users with
            a username String
            a displayName String

    actions
        createUser(username:String, displayName:String): (user:User)
            requires username is unique
            effect creates a new user profile with the given username and display name

        editUser(user:User, newDisplayName:String): (user:user)
          requires user exists
          effect edits the user's displayName to newDisplayName

        deleteUser(user:User):
            requires user exists
            effect deletes the user profile from the system

        getUserById(user:User): (userInfo:User)
            requires user exists
            effect returns the profile information of the user

```
