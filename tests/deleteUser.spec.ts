import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("deleteUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 403 without token", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      `/admin/realms/${kmock.params.realm}/users/${uuidv4()}`
    );

    const response = await axios.delete(url, { validateStatus: () => true });
    expect(response.status).toBe(403);
  });

  it("works with token", async () => {
    const kmock = getMockInstance();

    const token = kmock.createBearerToken(kmock.database.users[0].profile.id);
    const toDeleteUser = kmock.database.createUser({ username: "whoops" });

    const url = kmock.createURL(
      `/admin/realms/${kmock.params.realm}/users/${toDeleteUser.profile.id}`
    );

    const response = await axios.delete(url, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);

    const users = kmock.database.filterUsers(
      (user) => user.profile.username === "whoops"
    );
    expect(users).toHaveLength(0);
  });
});
