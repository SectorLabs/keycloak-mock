import { v4 as uuidv4 } from "uuid";
import isNil from "lodash/isNil";

export type MockUserProfileAttributes = {
  [key: string]: [string];
};

export enum MockUserCredentialType {
  PASSWORD = "password",
  CLIENT_SECRET = "client_secret",
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
  attributes?: MockUserProfileAttributes;
  credentials?: { type?: MockUserCredentialType; value: string }[];
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
  attributes: MockUserProfileAttributes;
}

export interface MockUser {
  profile: MockUserProfile;
  credentials: { type: MockUserCredentialType; value: string }[];
}

class MockDatabase {
  static SERVICE_USER_EMAIL: string = "service@keycloak-mock.com";

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
   * Attempts to match against a service account user.
   */
  matchForClientGrant(
    clientID: string,
    clientSecret: string
  ): MockUser | null {
    const user = this.findUserByUsername(clientID);
    if (!user) {
      return null;
    }

    const credential = user.credentials.find(
      ({ type }) => type === MockUserCredentialType.CLIENT_SECRET
    );
    if (!credential) {
      return null;
    }

    if (credential.value !== clientSecret) {
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

    const credentials = finalizedOptions.credentials || [];

    const user: MockUser = {
      profile,
      credentials: credentials.map(({ type, value }) => ({
        type: type || MockUserCredentialType.PASSWORD,
        value,
      })),
    };

    this.users.push(user);

    return user;
  }

  /**
   * Creates a service account that can authenticate using
   * client credentials.
   */
  createServiceUser(clientID: string, clientSecret: string): MockUser {
    return this.createUser({
      username: clientID,
      email: MockDatabase.SERVICE_USER_EMAIL,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: MockUserCredentialType.CLIENT_SECRET,
          value: clientSecret,
        },
      ],
    });
  }
}

export default MockDatabase;
