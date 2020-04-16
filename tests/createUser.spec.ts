import axios from "axios";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("createUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  const createInstanceAndURL = () => {
    const kmock = getMockInstance();
    const url = kmock.createURL("/admin/realms/myrealm/users");

    const serviceUser = kmock.database.findUserByUsername(
      kmock.params.clientID
    );
    if (!serviceUser) {
      throw new Error("Cannot find service user");
    }

    const token = kmock.createBearerToken(serviceUser.profile.id);

    return { kmock, url, token };
  };

  it("rejects with 403 without token", async () => {
    const { kmock, url } = createInstanceAndURL();

    const response = await axios.post(url, {}, { validateStatus: () => true });
    expect(response.status).toBe(403);
  });

  it("returns 400 without a username and email", async () => {
    const { kmock, url, token } = createInstanceAndURL();

    const { status } = await axios.post(
      url,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
        validateStatus: () => true,
      }
    );

    expect(status).toBe(400);
  });

  it("returns 200 and creates a user", async () => {
    const { kmock, url, token } = createInstanceAndURL();

    const { status, data } = await axios.post(
      url,
      {
        username: "myuser",
        email: "myuser@test.com",
        enabled: true,
        totp: 123,
        emailVerified: true,
        firstName: "my",
        lastName: "user",
        attributes: {
          test: ["a"],
        },
        credentials: [
          {
            value: "test",
          },
        ],
      },
      {
        headers: { authorization: `Bearer ${token}` },
        validateStatus: () => true,
      }
    );

    expect(status).toBe(200);
    expect(data.id).toBeTruthy();

    expect(kmock.database.findUserByID(data.id)).toBeTruthy();
  });
});
