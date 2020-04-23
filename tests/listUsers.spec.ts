import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("listUsers", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 403 without token", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(`/admin/realms/${kmock.params.realm}/users`);

    const response = await axios.get(url, { validateStatus: () => true });
    expect(response.status).toBe(403);
  });

  it("works with token", async () => {
    const kmock = getMockInstance();

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.profile.id);

    const url = kmock.createURL(`/admin/realms/${kmock.params.realm}/users`);

    const response = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    });

    // hack out createdTimestamp because it keeps changing
    const responseData = response.data.map((user: any) => ({
      ...user,
      id: 1,
      createdTimestamp: 1,
    }));
    expect(responseData).toMatchSnapshot();
  });

  it("filters by username", async () => {
    const kmock = getMockInstance();

    const token = kmock.createBearerToken(kmock.database.users[0].profile.id);
    const mockUser = kmock.database.createUser({ username: "whoop" });

    const url = kmock.createURL(
      `/admin/realms/${kmock.params.realm}/users?username=whoop`
    );

    const response = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.data).toHaveLength(1);
    expect(response.data[0].id).toBe(mockUser.profile.id);

    expect(kmock.database.allUsers()).toHaveLength(2);
  });
});
