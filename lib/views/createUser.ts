import { v4 as uuidv4 } from "uuid";

import { PostViewFn } from "../types";
import createBearerToken from "../createBearerToken";
import { MockUser, MockUserCredentialType } from "../database";

const createUser: PostViewFn = (instance, request, body) => {
  const { user } = request;
  if (!user) {
    return [403, "Access denied"];
  }

  const { username, email } = body;
  if (!username && !email) {
    return [400, "Bad request"];
  }

  const createdUser = instance.database.createUser({
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

  return [200, { id: createdUser.profile.id }];
};

export default createUser;
