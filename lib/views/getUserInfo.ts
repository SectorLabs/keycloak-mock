import jwt from "jsonwebtoken";
import { JWK } from "node-jose";

import { MockInstance } from "../instance";

import { ViewFn } from "./types";

const getUserInfo: ViewFn = async (instance, request) => {
  const token = (request.headers.authorization || "").split(" ")[1];
  if (!token) {
    return [401, "Authorization required"];
  }

  // @ts-ignore
  let decodedToken = null;
  try {
    decodedToken = jwt.decode(token, { complete: true });
  } catch (error) {
    return [403, "Access denied - cannot decode"];
  }

  // @ts-ignore
  const rawKey = instance.store.get(decodedToken.header.kid);
  if (!rawKey) {
    return [403, "Access denied - non-existent key"];
  }

  const key = await JWK.asKey(rawKey);

  try {
    jwt.verify(token, key.toPEM(false), { algorithms: ["RS256"] });
  } catch (error) {
    return [403, "Access denied - invalid signature"];
  }

  // @ts-ignore
  const user = instance.database.findUserByID(decodedToken.payload.sub);
  if (!user) {
    return [403, "Access denied - non-existent user"];
  }

  return [200, user];
};

export default getUserInfo;
