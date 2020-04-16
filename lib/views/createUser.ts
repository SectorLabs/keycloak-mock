import { v4 as uuidv4 } from "uuid";

import { PostViewFn } from "../types";
import createBearerToken from "../createBearerToken";
import { MockUser, MockUserCredentialType } from "../database";

const createUser: PostViewFn = (instance, request, requestBody) => {
  const { user } = request;
  if (!user) {
    return [403, "Access denied"];
  }

  if (typeof requestBody !== "object") {
    return [400, "Bad request"];
  }

  const createUserOptions = (requestBody as unknown) as Record<string, any>;

  const { username, email } = createUserOptions;
  if (!username && !email) {
    return [400, "Bad request"];
  }

  const createdUser = instance.database.createUser({
    username: createUserOptions.username,
    email: createUserOptions.email,
    enabled: createUserOptions.enabled,
    totp: createUserOptions.totp,
    emailVerified: createUserOptions.emailVerified,
    firstName: createUserOptions.firstName,
    lastName: createUserOptions.lastName,
    attributes: createUserOptions.attributes,
    credentials: createUserOptions.credentials,
  });

  return [200, { id: createdUser.profile.id }];
};

export default createUser;
