import axios from "axios";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("listCertificates", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("works without token", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/certs"
    );

    const response = await axios.get(url);

    expect(response.data.keys).toHaveLength(1);
    expect(response.data.keys[0].kty).toBe("RSA");
    expect(response.data.keys[0].use).toBe("sig");
    expect(response.data.keys[0].kid).toBeTruthy();
    expect(response.data.keys[0].n).toBeTruthy();
  });

  it("works with token", async () => {
    const kmock = getMockInstance();

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.profile.id);

    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/certs"
    );

    const response = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.data.keys).toHaveLength(1);
    expect(response.data.keys[0].kty).toBe("RSA");
    expect(response.data.keys[0].use).toBe("sig");
    expect(response.data.keys[0].kid).toBeTruthy();
    expect(response.data.keys[0].n).toBeTruthy();
  });
});
