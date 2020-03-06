import axios from "axios";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("getUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("works", async () => {
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
