import axios from "axios";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("createToken", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 403 without correct clientId", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/token"
    );

    const response = await axios.post(
      url,
      {
        username: "test@sectorlabs.com",
        password: "thisIsATest!",
        client_id: "doesNotExist",
      },
      { validateStatus: () => true }
    );
    expect(response.status).toBe(403);
  });

  it("rejects with 403 without username", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/token"
    );

    const response = await axios.post(
      url,
      {
        username: "test@sectorlabs.com",
        client_id: "test",
      },
      { validateStatus: () => true }
    );
    expect(response.status).toBe(403);
  });

  it("rejects with 403 with non existing user", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/token"
    );

    const response = await axios.post(
      url,
      {
        username: "test@sectorlabs.com",
        password: "thisIsATest!",
        client_id: "test",
      },
      { validateStatus: () => true }
    );
    expect(response.status).toBe(403);
  });

  it("rejects with 403 with wrong password", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/token"
    );

    const response = await axios.post(
      url,
      {
        username: "henk@gmail.com",
        password: "thisIsATest!",
        client_id: "test",
      },
      { validateStatus: () => true }
    );
    expect(response.status).toBe(403);
  });

  it("responds with 200 with clientId, username, password", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/protocol/openid-connect/token"
    );

    const response = await axios.post(
      url,
      {
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "test",
      },
      { validateStatus: () => true }
    );
    expect(response.status).toBe(200);

    expect(response.data).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        token_type: "bearer",
      })
    );
  });
});
