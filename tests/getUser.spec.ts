import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("getUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 403 without token", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(`/admin/realms/myrealm/users/${uuidv4()}`);

    const response = await axios.get(url, { validateStatus: () => true });
    expect(response.status).toBe(403);
  });

  it("works with token", async () => {
    const kmock = getMockInstance();

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.sub);

    const url = kmock.createURL(`/admin/realms/myrealm/users/${user.sub}`);

    const response = await axios.get(url, { headers: { authorization: `Bearer ${token}` } });

    // hack out createdTimestamp because it keeps changing
    const responseData = { ...response.data, createdTimestamp: 1 };
    expect(responseData).toMatchSnapshot();
  });
});
