import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { JWK } from "node-jose";

import { MockUserProfile } from "./database";

export interface CreateTokenOptions {
  user: MockUserProfile;
  expiresIn: number;
  key: JWK.Key;
  realm: string;
  clientID: string;
  authServerURL: string;
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
      sub: options.user.sub,
      azp: options.clientID,
      session_state: uuidv4(),
      gender: options.user.gender,
      preferred_username: options.user.preferred_username,
      given_name: options.user.given_name,
      family_name: options.user.family_name,
      email_verified: options.user.email_verified,
      name: options.user.name,
      email: options.user.email,
    },
    options.key.toPEM(true),
    {
      algorithm: "RS256",
      header: {
        typ: "JWT",
        kid: options.key.kid,
      },
    }
  );
};

export default createBearerToken;
