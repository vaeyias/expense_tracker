import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

const PREFIX = "Authentication" + ".";

// Generic type for User ID
type User = ID;

/**
 * Represents a user in the system
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

  /**
   * Create a new user
   */
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
      token: undefined,
    };

    const result = await this.users.insertOne(newUser);
    const userId = result.insertedId.toString() as User;

    return { user: userId };
  }

  /**
   * Edit user's display name
   */
  async editUser({
    user,
    token,
    newDisplayName,
  }: {
    user: User;
    token: string;
    newDisplayName: string;
  }): Promise<{} | { error: string }> {
    const validation = await this.validateToken({ user, token });
    if ("error" in validation) return { error: "Invalid token." };

    const result = await this.users.updateOne(
      { _id: user },
      { $set: { displayName: newDisplayName } },
    );

    if (!result) return { error: "User not found." };
    return {};
  }

  /**
   * Delete a user
   */
  async deleteUser({
    user,
    token,
  }: {
    user: User;
    token: string;
  }): Promise<{} | { error: string }> {
    const validation = await this.validateToken({ user, token });
    if ("error" in validation) return { error: "Invalid token." };

    const result = await this.users.deleteOne({ _id: user });
    if (result.deletedCount === 0) return { error: "User not found." };
    return {};
  }

  /**
   * Authenticate a user, returns a token
   */
  async authenticate({
    username,
    password,
  }: {
    username: string;
    password: unknown;
  }): Promise<{ user: User; token: string } | { error: string }> {
    const user = await this.users.findOne({
      username: username.toLowerCase(),
    });

    if (!user) return { error: "User not found." };
    if (user.password !== String(password)) {
      return { error: "Invalid password." };
    }

    const token = freshID() as string;
    await this.users.updateOne({ _id: user._id }, { $set: { token } });

    return { user: user._id, token };
  }

  /**
   * Validate a token for a given user
   */
  async validateToken({
    user,
    token,
  }: {
    user: User;
    token: string;
  }): Promise<{ user: User } | { error: string }> {
    const foundUser = await this.users.findOne({ _id: user, token: token });

    if (!foundUser) return { error: "User not authenticated. Please log in." };
    return { user: foundUser._id };
  }

  async logout({
    user,
    token,
  }: {
    user: User;
    token: string;
  }): Promise<{} | { error: string }> {
    const validation = await this.validateToken({ user, token });
    if ("error" in validation) return { error: "Invalid token." };

    await this.users.updateOne({ _id: user }, { $set: { token: undefined } });
    return {};
  }

  /**
   * Get user info by ID
   */
  async _getUserById({
    user,
  }: {
    user: User;
  }): Promise<{ userInfo: Users } | { error: string }> {
    const userInfo = await this.users.findOne({ _id: user });
    if (!userInfo) return { error: "User not found." };
    return { userInfo };
  }

  /**
   * Get user info by username
   */
  async _getUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<{ userInfo: Users } | { error: string }> {
    const userInfo = await this.users.findOne({
      username: username.toLowerCase(),
    });
    if (!userInfo) return { error: "User not found." };
    return { userInfo };
  }
}
