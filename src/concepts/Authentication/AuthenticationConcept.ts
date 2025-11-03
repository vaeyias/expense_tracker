import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

const PREFIX = "Authentication" + ".";

// Generic types of this concept
type User = ID;

/**
 * a set of Users with
 *   a username String
 *   a displayName String
 *   optional token for authentication
 */
interface Users {
  _id: User;
  username: string;
  displayName: string;
  password: string;
  token?: string;
}

export default class AuthenticationConcept {
  users: Collection<Users>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
  }

  async createUser({
    username,
    displayName,
    password,
  }: {
    username: string;
    displayName: string;
    password: string;
  }): Promise<{ user: User } | { error: string }> {
    const existingUser = await this.users.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      return { error: "Username already exists." };
    }

    const newUser = {
      _id: freshID(),
      username: username.toLowerCase(),
      displayName,
      password,
    };

    const result = await this.users.insertOne(newUser);
    const userId = result.insertedId.toString() as User;

    return { user: userId };
  }

  async editUser(
    { user, newDisplayName }: { user: User; newDisplayName: string },
  ): Promise<{}> {
    const result = await this.users.findOneAndUpdate(
      { _id: user },
      { $set: { displayName: newDisplayName } },
    );
    if (!result) {
      return { error: "User not found." };
    }
    return {};
  }

  async deleteUser({ user }: { user: User }): Promise<{}> {
    const result = await this.users.deleteOne({ _id: user });
    if (result.deletedCount === 0) {
      return { error: "User not found." };
    }
    return {};
  }

  /**
   * Authenticates a user with a username and password, returns a token.
   */
  async authenticate({
    username,
    password,
  }: {
    username: string;
    password: unknown;
  }): Promise<{ user: User; token: string } | { error: string }> {
    const user = await this.users.findOne({ username: username.toLowerCase() });
    if (!user) {
      return { error: "User not found." };
    }

    const passwordMatch = user.password === String(password);
    if (!passwordMatch) {
      return { error: "Invalid password." };
    }

    // Generate a simple token (replace with JWT in production)
    const token = freshID() as string;

    // Save token in user record
    await this.users.updateOne({ _id: user._id }, { $set: { token } });

    return { user: user._id, token };
  }

  async _getUserById(
    { user }: { user: User },
  ): Promise<{ userInfo: Users } | { error: string }> {
    const userInfo = await this.users.findOne({ _id: user });
    if (!userInfo) {
      return { error: "User not found." };
    }
    return { userInfo };
  }

  async _getUserByUsername(
    { username }: { username: string },
  ): Promise<{ userInfo: Users } | { error: string }> {
    const userInfo = await this.users.findOne({
      username: username.toLowerCase(),
    });
    if (!userInfo) {
      return { error: "User not found." };
    }
    return { userInfo };
  }

  /**
   * Validates a token for sync guards.
   */
  async _validateToken(
    { token }: { token: string },
  ): Promise<{ user: User } | { error: string }> {
    const user = await this.users.findOne({ token });
    if (!user) {
      return { error: "Invalid token." };
    }
    return { user: user._id };
  }
}
