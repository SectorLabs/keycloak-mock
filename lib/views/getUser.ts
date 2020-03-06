import jwt from "jsonwebtoken";
import { JWK } from "node-jose";
import head from "lodash/head";
import last from "lodash/last";

import { MockInstance } from "../instance";

import { ViewFn } from "./types";

const getUser: ViewFn = async (instance, request) => {
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

  const requestSub = last(request.path.split("/"));
  // @ts-ignore
  if (requestSub !== decodedToken.payload.sub) {
    return [403, "Access denied - not you"];
  }

  // @ts-ignore
  const user = instance.database.findUserByID(decodedToken.payload.sub);
  if (!user) {
    return [403, "Access denied - non-existent user"];
  }

  return [
    200,
    {
      id: user.sub,
      firstName: user.given_name,
      lastName: user.family_name,
      username: user.preferred_username,
      email: user.email,
      enabled: true,
      totp: false,
      emailVerified: user.email_verified,
      createdTimestamp: user.created_at,
      attributes: user.attributes,
      disableableCredentialTypes: ["password"],
      requiredActions: [],
      federatedIdentities: [],
      notBefore: 0,
      access: {
        manageGroupMembership: true,
        view: true,
        mapRoles: true,
        impersonate: false,
        manage: true,
      },
    },
  ];
};

export default getUser;
