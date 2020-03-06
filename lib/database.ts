import { v4 as uuidv4 } from "uuid";

export interface CreateMockUserProfileOptions {
  sub?: string;
  name: string;
  email: string;
  attributes?: {};
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
  created_at: number;
  attributes: {};
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
    const sub = options ? options.sub : uuidv4();
    const name = options ? options.name : "Henk Jansen";
    const email = options ? options.email : "henk@gmail.com";
    const attributes = options ? options.attributes : {};

    const [givenName, familyName] = name.split(" ");

    const profile: MockUserProfile = {
      sub: sub || uuidv4(),
      email,
      name,
      email_verified: true,
      gender: "male",
      given_name: givenName,
      family_name: familyName,
      preferred_username: email,
      created_at: new Date().getTime(),
      attributes: attributes || {},
    };

    this.users.push(profile);

    return profile;
  }
}

export default MockDatabase;
