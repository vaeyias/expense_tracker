---
timestamp: 'Mon Oct 20 2025 00:33:05 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251020_003305.af43db7c.md]]'
content_id: 0472b811f33fe723eb08390036c3fe1b5811b98db02042ef959d3a2edf3760b3
---

# file: src/Authentication/AuthenticationConcept.ts

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { ensureCollections } from "@utils/database.ts";

// Declare collection prefix, use concept name
const PREFIX = "Authentication.";

// Define the generic types used in this concept
// In this case, we'll use User as a specific ID type for users.
export type User = ID<"User">;

/**
 * Represents a user in the Authentication concept.
 * Corresponds to "a set of Users with a username String and a password String".
 */
interface UserDocument {
  _id: User; // Corresponds to the User ID
  username: string;
  passwordHash: string; // Storing password hash for security
}

/**
 * AuthenticationConcept provides user registration and authentication services.
 */
export default class AuthenticationConcept {
  private readonly users: Collection<UserDocument>;
  private readonly collections = ["users"];

  /**
   * Initializes the AuthenticationConcept.
   * @param db The MongoDB database instance.
   */
  constructor(private readonly db: Db) {
    this.users = this.db.collection<UserDocument>(PREFIX + "users");
    // Ensure collections exist when the concept is initialized
    ensureCollections(this.db, this.collections.map(c => PREFIX + c));
  }

  /**
   * Registers a new user.
   * @param params - An object containing username and password.
   * @returns A promise resolving to the newly created user ID, or an error object.
   *
   * Concept specification:
   * action register (username: String, password: String): (user: User)
   *   requires username to not already exist
   *   effects creates a new User with given username and password
   */
  async register({
    username,
    password,
  }: {
    username: string;
    password: unknown; // Use unknown to enforce hashing
  }): Promise<{ user: User } | { error: string }> {
    if (!username || !password) {
      return { error: "Username and password are required." };
    }

    // Check if username already exists
    const existingUser = await this.users.findOne({ username });
    if (existingUser) {
      return { error: `Username '${username}' already exists.` };
    }

    // In a real application, you would securely hash the password here.
    // For demonstration purposes, we'll use a simple placeholder.
    // DO NOT use plain text passwords in production.
    const passwordHash = await hashPassword(password as string); // Placeholder for actual hashing

    const newUser: UserDocument = {
      _id: new ObjectId().toString() as User, // Use string ID as per requirements
      username: username,
      passwordHash: passwordHash,
    };

    try {
      await this.users.insertOne(newUser);
      return { user: newUser._id };
    } catch (e) {
      console.error("Error during user registration:", e);
      return { error: "Failed to register user. Please try again later." };
    }
  }

  /**
   * Authenticates a user.
   * @param params - An object containing username and password.
   * @returns A promise resolving to the authenticated user ID, or an error object.
   *
   * Concept specification:
   * action authenticate (username: String, password: String): (user: User)
   *   requires a User to exist with the given username
   *   effects if a User with the given username exists and the given password matches the User's password then access is granted. Otherwise, access is denied.
   */
  async authenticate({
    username,
    password,
  }: {
    username: string;
    password: unknown; // Use unknown to enforce comparison with hashed password
  }): Promise<{ user: User } | { error: string }> {
    if (!username || !password) {
      return { error: "Username and password are required." };
    }

    const user = await this.users.findOne({ username });

    if (!user) {
      // Require username to exist before checking password, for security
      return { error: "Invalid username or password." };
    }

    // In a real application, you would compare the provided password hash
    // with the stored password hash.
    const passwordMatch = await comparePasswordHash(password as string, user.passwordHash); // Placeholder

    if (!passwordMatch) {
      return { error: "Invalid username or password." };
    }

    // Return the user ID upon successful authentication
    return { user: user._id };
  }
}

// --- Placeholder Hashing Functions ---
// In a real application, use libraries like bcrypt.
// These are simplified for demonstration.

async function hashPassword(password: string): Promise<string> {
  // Replace with a secure hashing algorithm (e.g., bcrypt)
  console.warn("Using insecure placeholder for password hashing. Use a real library in production.");
  return `hashed_${password}`; // Insecure placeholder
}

async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
  // Replace with a secure password comparison function
  console.warn("Using insecure placeholder for password comparison. Use a real library in production.");
  return `hashed_${password}` === hash; // Insecure placeholder
}

// --- Example Usage (for testing purposes) ---
// You can run this with `deno run --allow-env --allow-net src/Authentication/AuthenticationConcept.ts`
async function runExample() {
  const [db, client] = await getDb();
  const authConcept = new AuthenticationConcept(db);

  console.log("--- Authentication Example ---");

  // Clear previous data for a clean run
  await db.collection(PREFIX + "users").deleteMany({});
  console.log("Cleared existing users.");

  // Test registration
  const registrationResult1 = await authConcept.register({
    username: "alice",
    password: "securepassword123",
  });
  console.log("Register alice:", registrationResult1);

  const registrationResult2 = await authConcept.register({
    username: "bob",
    password: "anotherpassword456",
  });
  console.log("Register bob:", registrationResult2);

  // Test duplicate registration
  const duplicateRegistration = await authConcept.register({
    username: "alice",
    password: "newpassword",
  });
  console.log("Register alice again:", duplicateRegistration); // Should be an error

  // Test authentication
  const authResult1 = await authConcept.authenticate({
    username: "alice",
    password: "securepassword123",
  });
  console.log("Authenticate alice (correct password):", authResult1);

  const authResult2 = await authConcept.authenticate({
    username: "bob",
    password: "wrongpassword",
  });
  console.log("Authenticate bob (wrong password):", authResult2); // Should be an error

  const authResult3 = await authConcept.authenticate({
    username: "charlie",
    password: "anypassword",
  });
  console.log("Authenticate charlie (non-existent user):", authResult3); // Should be an error

  const authResult4 = await authConcept.authenticate({
    username: "alice",
    password: "securepassword123",
  });
  console.log("Authenticate alice again:", authResult4);

  client.close();
}

// Uncomment the following line to run the example when this file is executed directly
// await runExample();
```

### Explanation:

1. **`@utils/types.ts`**: Defines `ID` for type-branded string IDs and `Empty` for void return types. `freshID` is a placeholder for generating MongoDB `ObjectId`s.
2. **`@utils/database.ts`**: Provides a helper to connect to MongoDB using environment variables and to ensure collections exist.
3. **`AuthenticationConcept.ts`**:
   * **`PREFIX`**: A constant to prepend to collection names, ensuring isolation for this concept.
   * **`User` type**: Defined as `ID<"User">` for type safety.
   * **`UserDocument` interface**: Maps the concept's state (`username`, `password`) to a MongoDB document structure. Crucially, `passwordHash` is used instead of storing plain passwords for security.
   * **Constructor**: Takes the `Db` instance, initializes the `users` collection, and calls `ensureCollections` to make sure the `users` collection exists.
   * **`register` action**:
     * Takes `username` and `password` as input.
     * Performs input validation (username and password presence).
     * Checks for existing usernames using `this.users.findOne()`.
     * **Placeholder Hashing**: Calls `hashPassword`. **Important**: In a real application, you *must* replace `hashPassword` and `comparePasswordHash` with a robust library like `bcrypt`.
     * Creates a new `UserDocument` with a generated `_id` (as a string `User` ID).
     * Inserts the document into the `users` collection using `insertOne`.
     * Returns `{ user: newUser._id }` on success or `{ error: "message" }` on failure.
   * **`authenticate` action**:
     * Takes `username` and `password` as input.
     * Performs input validation.
     * Finds the user by `username`. If not found, returns an "Invalid username or password" error (this is a security measure to avoid revealing whether a username exists).
     * **Placeholder Comparison**: Calls `comparePasswordHash` to compare the provided password with the stored hash.
     * Returns `{ user: user._id }` on successful authentication or `{ error: "message" }` if credentials are invalid.
   * **Placeholder Hashing Functions**: `hashPassword` and `comparePasswordHash` are included as simple examples. They are clearly marked as insecure and intended for demonstration only.
   * **Example Usage (`runExample`)**: This function demonstrates how to initialize the concept, call its actions, and observe the results. It's commented out by default but can be run directly to test the implementation.

To use this implementation:

1. **Set up your `.env` file**:
   ```env
   DB_NAME=my_concept_app_db
   DB_URL=mongodb://localhost:27017
   ```
2. **Create the file structure**:
   ```
   your_project/
   ├── src/
   │   ├── Authentication/
   │   │   └── AuthenticationConcept.ts
   │   └── utils/
   │       ├── database.ts
   │       └── types.ts
   └── .env
   ```
3. **Run the example (optional)**:
   ```bash
   deno run --allow-env --allow-net src/Authentication/AuthenticationConcept.ts
   ```
   Make sure you have a MongoDB server running locally or adjust `DB_URL`.
4. **Integrate into your application**: In your main application file, you would get the `Db` object and then instantiate `AuthenticationConcept`:
   ```typescript
   import { getDb } from "@utils/database.ts";
   import AuthenticationConcept from "@concepts/Authentication/AuthenticationConcept.ts";

   async function main() {
     const [db, client] = await getDb();
     const authService = new AuthenticationConcept(db);

     // Now you can call authService.register() or authService.authenticate()
     const result = await authService.register({ username: "testuser", password: "testpassword" });
     console.log(result);

     client.close();
   }

   await main();
   ```

This implementation adheres to the concept design principles and provides a solid foundation for user authentication. Remember to replace the placeholder hashing functions with a secure library in a production environment.
