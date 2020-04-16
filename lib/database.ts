import { v4 as uuidv4 } from "uuid";
import isNil from "lodash/isNil";

export type MockUserProfileAttributes = {
  [key: string]: [string];
};

export enum MockUserCredentialType {
  PASSWORD = "password",
}

export interface MockUserCredential {
  type: MockUserCredentialType;
  value: string;
}

export interface CreateMockUserOptions {
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
  credentials?: MockUserCredential[];
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

export interface MockUser {
  profile: MockUserProfile;
  credentials: MockUserCredential[];
}

class MockDatabase {
  users: MockUser[];

  constructor() {
    this.users = [];
  }

  /**
   * Finds an existing user by ID.
   */
  findUserByID(id: string): MockUser | null {
    const user = this.users.find((storedUser) => storedUser.profile.id === id);
    return user || null;
  }

  /**
   * Finds an existing user by username.
   */
  findUserByUsername(username: string): MockUser | null {
    const user = this.users.find(
      (storedUser) => storedUser.profile.username === username
    );
    return user || null;
  }

  /**
   * Attempts to match against a user with the specified
   * username and password.
   */
  matchForPasswordGrant(username: string, password: string): MockUser | null {
    const user = this.findUserByUsername(username);
    if (!user) {
      return null;
    }

    const credential = user.credentials.find(
      ({ type }) => type === MockUserCredentialType.PASSWORD
    );
    if (!credential) {
      return null;
    }

    if (credential.value !== password) {
      return null;
    }

    return user;
  }

  /**
   * Deletes all existing users.
   */
  clear(): void {
    this.users = [];
  }

  /**
   * Creates a new user and returns the profile of the newly created user.
   */
  createUser(options?: CreateMockUserOptions): MockUser {
    const finalizedOptions = options || {};

    const email = finalizedOptions.email || "henk.jansen@gmail.com";

    const profile: MockUserProfile = {
      id: finalizedOptions.id || uuidv4(),
      createdTimestamp:
        finalizedOptions.createdTimestamp || new Date().getTime(),
      username: finalizedOptions.username || email,
      enabled: isNil(finalizedOptions.enabled)
        ? true
        : finalizedOptions.enabled,
      totp: isNil(finalizedOptions.totp) ? true : finalizedOptions.totp,
      emailVerified: isNil(finalizedOptions.emailVerified)
        ? true
        : finalizedOptions.emailVerified,
      firstName: finalizedOptions.firstName || "Henk",
      lastName: finalizedOptions.lastName || "Jansen",
      email,
      attributes: {
        ...(finalizedOptions.attributes || {}),
      },
    };

    const user: MockUser = {
      profile,
      credentials: finalizedOptions.credentials || [],
    };

    this.users.push(user);

    return user;
  }
}

export default MockDatabase;
