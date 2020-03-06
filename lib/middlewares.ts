import jwt from "jsonwebtoken";
import { JWK } from "node-jose";

import { MiddlewareFn } from "./types";

type DecodedJWTToken = {
  header: {
    kid: string;
  };
  payload: {
    sub: string;
  };
};

/**
 * Middleware that verifies that a valid token is specified
 * in the headers and is associaed with a valid user.
 *
 * Next middlewares or views can access `request.user` to
 * access the user associated with the specified token.
 */
const decodeTokenAndAttachUser: MiddlewareFn = async (instance, request) => {
  const rawToken = (request.headers.authorization || "").split(" ")[1];
  if (!rawToken) {
    return;
  }

  let decodedToken: DecodedJWTToken | null = null;
  try {
    decodedToken = jwt.decode(rawToken, { complete: true }) as DecodedJWTToken;
  } catch (error) {
    return;
  }

  const rawKey = instance.store.get(decodedToken.header.kid);
  if (!rawKey) {
    return;
  }

  const key = await JWK.asKey(rawKey);

  try {
    jwt.verify(rawToken, key.toPEM(false), { algorithms: ["RS256"] });
  } catch (error) {
    return;
  }

  request.user = instance.database.findUserByID(decodedToken.payload.sub);
};

export { decodeTokenAndAttachUser };
