import jwt from "jsonwebtoken";
import { JWK } from "node-jose";

import createBearerToken, {
  CreateTokenOptions,
} from "../lib/createBearerToken";

describe("createBearerToken", () => {
  it("clears users", async () => {
    const keyStore = JWK.createKeyStore();
    const key = await keyStore.generate("RSA", 2048, { use: "sig" });

    const user = {
      profile: {
        id: "",
        createdTimestamp: 0,
        username: "test",
        enabled: true,
        totp: false,
        emailVerified: true,
        firstName: "Test",
        lastName: "User",
        email: "test@user.com",
        attributes: {},
      },
      credentials: [],
    };

    const createTokenOptions: CreateTokenOptions = {
      user,
      expiresIn: 3600,
      key,
      realm: "master",
      clientID: "client",
      authServerURL: "https://example.com",
      audience: "test",
    };

    const token = createBearerToken(createTokenOptions);
    const decodedToken = jwt.decode(token, { complete: true }) as any;

    expect(decodedToken.header.alg).toBe("RS256");
    expect(decodedToken.header.typ).toBe("JWT");
    expect(decodedToken.payload.typ).toBe("Bearer");
    expect(decodedToken.payload.azp).toBe(createTokenOptions.clientID);
    expect(decodedToken.payload.aud).toBe(createTokenOptions.audience);
    expect(decodedToken.payload.iss).toBe(
      `${createTokenOptions.authServerURL}/realms/${createTokenOptions.realm}`
    );
  });
});
