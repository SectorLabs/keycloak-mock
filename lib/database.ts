import { v4 as uuidv4 } from "uuid";
import isNil from "lodash/isNil";

import { DuplicateUserError } from "./error";

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
   * Gets all users (except service users).
   */
  allUsers(): MockUser[] {
    return this.users.filter(
      (storedUser) =>
        storedUser.profile.email !== MockDatabase.SERVICE_USER_EMAIL
    );
  }

  /**
   * Gets all users (except service users).
   */
  filterUsers(filterFunc: (user: MockUser) => boolean): MockUser[] {
    return this.allUsers().filter(filterFunc);
  }

  /**
   * Finds the service account user if any exists.
   */
  findServiceUser(): MockUser | null {
    const user = this.users.find(
      (storedUser) =>
        storedUser.profile.email === MockDatabase.SERVICE_USER_EMAIL
    );
    return user || null;
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
   * Finds an existing user by username.
   */
  findUserByEmail(email: string): MockUser | null {
    const user = this.users.find(
      (storedUser) => storedUser.profile.email === email
    );
    return user || null;
  }

  /**
   * Deletes a user by ID.
   */
  deleteUserByID(id: string): void {
    this.users = this.users.filter(
      (storedUser) => storedUser.profile.id !== id
    );
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
    this.users = this.users.filter(
      (user) => user.profile.email === MockDatabase.SERVICE_USER_EMAIL
    );
  }

  /**
   * Creates a new user and returns the profile of the newly created user.
   */
  createUser(options?: CreateMockUserOptions): MockUser {
    const finalizedOptions = options || {};

    const id = finalizedOptions.id || uuidv4();
    const email = finalizedOptions.email || "henk.jansen@gmail.com";
    const username = finalizedOptions.username || email;

    if (this.findUserByID(id)) {
      throw new DuplicateUserError(`A user with id ${id} already exists`);
    }

    if (this.findUserByUsername(username)) {
      throw new DuplicateUserError(
        `A user with username ${username} already exists`
      );
    }

    if (this.findUserByEmail(email)) {
      throw new DuplicateUserError(
        `A user with email ${email} already exists`
      );
    }

    const profile: MockUserProfile = {
      id,
      createdTimestamp:
        finalizedOptions.createdTimestamp || new Date().getTime(),
      username,
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
    if (this.findServiceUser()) {
      throw new Error("There can only be one service account.");
    }

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
