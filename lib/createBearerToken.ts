import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { JWK } from "node-jose";

import { MockUser } from "./database";

export interface CreateTokenOptions {
  user: MockUser;
  expiresIn: number;
  key: JWK.Key;
  realm: string;
  clientID: string;
  authServerURL: string;
  audience?: string | string[];
}

const createBearerToken = (options: CreateTokenOptions): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + options.expiresIn;

  return jwt.sign(
    {
      iss: `${options.authServerURL}/realms/${options.realm}`,
      iat: expiresAt,
      exp: expiresAt,
      nbf: 0,
      typ: "Bearer",
      sub: options.user.profile.id,
      azp: options.clientID,
      session_state: uuidv4(),
    },
    options.key.toPEM(true),
    {
      algorithm: "RS256",
      header: {
        typ: "JWT",
        kid: options.key.kid,
      },
      ...(options.audience && { audience: options.audience }),
    }
  );
};

export default createBearerToken;
