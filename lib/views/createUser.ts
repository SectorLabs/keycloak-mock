import { v4 as uuidv4 } from "uuid";

import { PostViewFn } from "../types";
import createBearerToken from "../createBearerToken";
import { MockUser, MockUserCredentialType } from "../database";
import { DuplicateUserError } from "../error";

const createUser: PostViewFn = (instance, request, body) => {
  const { user } = request;
  if (!user) {
    return [403, "Access denied"];
  }

  const { username, email } = body;
  if (!username && !email) {
    return [400, "Bad request"];
  }

  let createdUser: MockUser | null = null;
  try {
    createdUser = instance.database.createUser({
      username: body.username,
      email: body.email,
      enabled: body.enabled,
      totp: body.totp,
      emailVerified: body.emailVerified,
      firstName: body.firstName,
      lastName: body.lastName,
      attributes: body.attributes,
      credentials: body.credentials,
    });
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      return [409, { errorMessage: error.message }];
    }

    throw error;
  }

  const resourcePath = `/admin/realms/${instance.params.realm}/users/${createdUser.profile.id}`;
  const resourceURL = instance.createURL(resourcePath);

  return [
    200,
    { id: createdUser.profile.id },
    {
      location: resourceURL,
    },
  ];
};

export default createUser;
