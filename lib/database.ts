import { v4 as uuidv4 } from "uuid";

export interface CreateMockUserProfileOptions {
  name: string;
  email: string;
}

export interface MockUserProfile {
  sub: string;
  name: string;
  email: string;
  gender: "male" | "female";
  preferred_username: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
}

class MockDatabase {
  users: MockUserProfile[];

  constructor() {
    this.users = [];
  }

  findUserByID(sub: string): MockUserProfile | null {
    return this.users.find((storedUser) => storedUser.sub === sub) || null;
  }

  clear(): void {
    this.users = [];
  }

  /**
   * Creates a new user and returns the profile of the newly created user.
   */
  createUser(options?: CreateMockUserProfileOptions): MockUserProfile {
    const name = options ? options.name : "Henk Jansen";
    const email = options ? options.email : "henk@gmail.com";

    const [givenName, familyName] = name.split(" ");

    const profile: MockUserProfile = {
      sub: uuidv4(),
      email,
      name,
      email_verified: true,
      gender: "male",
      given_name: givenName,
      family_name: familyName,
      preferred_username: email,
    };

    this.users.push(profile);

    return profile;
  }
}

export default MockDatabase;
