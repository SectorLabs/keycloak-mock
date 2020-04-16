import { v4 as uuidv4 } from "uuid";

import { PostViewFn } from "../types";
import createBearerToken from "../createBearerToken";
import { MockUser, MockUserCredentialType } from "../database";

const createToken: PostViewFn = (instance, request, requestBody) => {
  if (typeof requestBody !== "object") {
    return [400, "Bad request"];
  }

  const grantRequest = (requestBody as unknown) as Record<string, any>;
  const { grant_type: grantType, client_id: clientID, scope } = grantRequest;

  if (instance.params.clientID !== clientID) {
    return [400, "Bad request"];
  }

  let user: MockUser | null = null;

  if (!grantType || grantType === "password") {
    const { username, password } = grantRequest;
    if (!username || !password) {
      return [400, "Bad request"];
    }

    user = instance.database.matchForPasswordGrant(username, password);
  } else if (grantType === "client_credentials") {
    const { client_secret: clientSecret } = grantRequest;
    if (!clientSecret) {
      return [400, "Bad request"];
    }

    user = instance.database.matchForClientGrant(clientID, clientSecret);
  } else {
    return [400, "Bad request"];
  }

  if (!user) {
    return [403, "Access denied"];
  }

  const expiresIn = 3600;
  const accessToken = instance.createBearerToken(user.profile.id, expiresIn);
  const refreshToken = instance.createBearerToken(user.profile.id, expiresIn);

  return [
    200,
    {
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_expires_in: expiresIn,
      refresh_token: refreshToken,
      token_type: "bearer",
      "not-before-policy": 0,
      session_state: uuidv4(),
      scope: scope || "email profile",
    },
  ];
};

export default createToken;
