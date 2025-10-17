# Folder Concept
```
concept Folder
    purpose allows users to organize groups into custom structures
    principle after a user creates a folder, the user can add or remove groups to the folders.
    state
        a set of Folders with
            a parent Folder
            a name String
            an owner User
            a set of Groups
    actions
        createFolder(owner:User, name:String): (folder:Folder)
            requires owner and folder name doesn't already exist with the owner
            effect creates a new folder with the given name and owner

        addGroupToFolder(user:User,folderName:String, group:Group):
            requires folder with folderName and group exists. folder belongs to owner and user is in the group
            effect adds the group into the folder

        removeGroupFromFolder(user:User,folder:Folder, group:Group):
            requires user, folder and group exists. folder belongs to user, user is in the group, and group is inside folder
            effect removes the group from the folder

        moveFolder(user:User,folderToMove:String, parentFolder:String):
            requires folderToMove and parentFolder to exist. Both folders belongs to the user.
            effect changes parent of folderToMove to parentFolder

        deleteFolder(user:User, folder:Folder):
            requires user and folder exists. folder belongs to user.
            effect deletes the folder and moves all groups to the home page (no inside any folder)

        renameFolder(user:User, folder:Folder, name:String):
            requires user and folder exists and user is the folder's owner
            effect changes name of folder to name

```
