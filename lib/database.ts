import { v4 as uuidv4 } from "uuid";
import isNil from "lodash/isNil";

export type MockUserProfileAttributes = {
  [key: string]: [string];
};

export interface CreateMockUserProfileOptions {
  id?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  attributes?: MockUserProfileAttributes;
}

export interface MockUserProfile {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  attributes: MockUserProfileAttributes;
}

class MockDatabase {
  users: MockUserProfile[];

  constructor() {
    this.users = [];
  }

  findUserByID(id: string): MockUserProfile | null {
    return this.users.find((storedUser) => storedUser.id === id) || null;
  }

  findUserByEmail(email: string): MockUserProfile | null {
    return this.users.find((storedUser) => storedUser.email === email) || null;
  }

  clear(): void {
    this.users = [];
  }

  /**
   * Creates a new user and returns the profile of the newly created user.
   */
  createUser(options?: CreateMockUserProfileOptions): MockUserProfile {
    const finalizedOptions = options || {};

    const profile: MockUserProfile = {
      id: finalizedOptions.id || uuidv4(),
      createdTimestamp:
        finalizedOptions.createdTimestamp || new Date().getTime(),
      username: finalizedOptions.username || "henk.jansen@gmail.com",
      enabled: isNil(finalizedOptions.enabled)
        ? true
        : finalizedOptions.enabled,
      totp: isNil(finalizedOptions.totp) ? true : finalizedOptions.totp,
      emailVerified: isNil(finalizedOptions.emailVerified)
        ? true
        : finalizedOptions.emailVerified,
      firstName: finalizedOptions.firstName || "Henk",
      lastName: finalizedOptions.lastName || "Jansen",
      email: finalizedOptions.email || "henk.jansen@gmail.com",
      password: finalizedOptions.password,
      attributes: {
        ...(finalizedOptions.attributes || {}),
      },
    };

    this.users.push(profile);

    return profile;
  }
}

export default MockDatabase;
