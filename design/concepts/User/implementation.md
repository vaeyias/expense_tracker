[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@error-handling](../../background/error-handling.md)

[@user](User.md)

# implement: User

# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";

const PREFIX = "User" + ".";

// Generic types of this concept
type User = ID;

/**
 * a set of Users with
 *   a username String
 *   a displayName String
 */
interface Users {
  _id: User;
  username: string;
  displayName: string;
}

export default class UserConcept {
  users: Collection<Users>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
  }

  async createUser({
    username,
    displayName,
  }: {
    username: string;
    displayName: string;
  }): Promise<{ user: User } | { error: string }> {
    const existingUser = await this.users.findOne({ username });
    if (existingUser) {
      return { error: "Username already exists." };
    }

    const newUser = {
      _id: "" as User, // Placeholder, will be overridden by freshID
      username,
      displayName,
    };

    const result = await this.users.insertOne(newUser);
    const userId = result.insertedId.toString() as User; // Assuming ObjectId is converted to string for User ID

    return { user: userId };
  }

  async deleteUser({ user }: { user: User }): Promise<{}> {
    const result = await this.users.deleteOne({ _id: user });
    if (result.deletedCount === 0) {
      return { error: "User not found." };
    }
    return {};
  }

  async getUserById({ user }: { user: User }): Promise<{ userInfo: Users } | { error: string }> {
    const userInfo = await this.users.findOne({ _id: user });
    if (!userInfo) {
      return { error: "User not found." };
    }
    return { userInfo };
  }

  // For testing and demonstration, a query to get user by username
  async _getUserByUsername(username: string): Promise<Users | null> {
    return this.users.findOne({ username });
  }
}
```