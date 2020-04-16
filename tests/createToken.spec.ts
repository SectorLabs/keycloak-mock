import qs from "qs";
import axios from "axios";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("createToken", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  const createInstanceAndURL = () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      `/realms/${kmock.params.realm}/protocol/openid-connect/token`
    );

    return { kmock, url };
  };

  it("returns 400 with an invalid grant_type", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {
        grant_type: "unknown",
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(400);
  });

  it("returns 400 with missing username and password", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {
        grant_type: "password",
        client_id: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(400);
  });

  it("returns 400 with invalid client_id", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {
        grant_type: "password",
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "hbfsdfdf",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(400);
  });

  it("returns 403 with non existing user", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {
        grant_type: "password",
        username: "bla@test.com",
        password: "testPassword!",
        client_id: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(403);
  });

  it("returns 403 with wrong password", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {
        grant_type: "password",
        username: "henk@gmail.com",
        password: "wrongPassword",
        client_id: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(403);
  });

  it("allows a regular user to login with a password", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status, data } = await axios.post(
      url,
      {
        grant_type: "password",
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "test",
        scope: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(200);
    expect(data.access_token).toBeTruthy();
    expect(data.refresh_token).toBeTruthy();
    expect(data.token_type).toBeTruthy();
    expect(data.session_state).toBeTruthy();

    expect({
      ...data,
      access_token: null,
      refresh_token: null,
      session_state: null,
    }).toMatchSnapshot();
  });

  it("assumes the grant_type is password if not specified", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status, data } = await axios.post(
      url,
      {
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "test",
        scope: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(200);
  });

  it("allows body to be encoded as application/x-www-form-urlencoded", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status, data } = await axios.post(
      url,
      qs.stringify({
        grant_type: "password",
        username: "henk@gmail.com",
        password: "testPassword!",
        client_id: "test",
        scope: "test",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: () => true,
      }
    );

    expect(status).toBe(200);
  });

  it("allows a client to login with a secret key", async () => {
    const { kmock, url } = createInstanceAndURL();

    const { status, data } = await axios.post(
      url,
      {
        grant_type: "client_credentials",
        client_secret: kmock.params.clientSecret,
        client_id: "test",
        scope: "test",
      },
      { validateStatus: () => true }
    );

    expect(status).toBe(200);
    expect(data.access_token).toBeTruthy();
    expect(data.refresh_token).toBeTruthy();
    expect(data.token_type).toBeTruthy();
    expect(data.session_state).toBeTruthy();

    expect({
      ...data,
      access_token: null,
      refresh_token: null,
      session_state: null,
    }).toMatchSnapshot();
  });
});
