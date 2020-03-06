import axios from "axios";

import * as KeycloakMock from "../lib";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("getUserInfo", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("works", async () => {
    const kmock = getMockInstance();

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.sub);

    const url = kmock.createURL("/realms/myrealm/protocol/openid-connect/userinfo");

    const response = await axios.get(url, { headers: { authorization: `Bearer ${token}` } });

    // hack out created_at because it keeps changing
    const responseData = { ...response.data, created_at: 1 };
    expect(responseData).toMatchSnapshot();
  });
});
