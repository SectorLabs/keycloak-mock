import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("getUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 403 without token", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      `/admin/realms/${kmock.params.realm}/users/${uuidv4()}`
    );

    const response = await axios.get(url, { validateStatus: () => true });
    expect(response.status).toBe(403);
  });

  it("works with token", async () => {
    const kmock = getMockInstance();

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.profile.id);

    const url = kmock.createURL(
      `/admin/realms/${kmock.params.realm}/users/${user.profile.id}`
    );

    const response = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.data.id).toBe(user.profile.id);
    expect(response.data.createdTimestamp).toBeTruthy();

    // hack out createdTimestamp because it keeps changing
    const responseData = { ...response.data, id: 1, createdTimestamp: 1 };
    expect(responseData).toMatchSnapshot();
  });
});
