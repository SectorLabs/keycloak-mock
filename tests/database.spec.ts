import MockDatabase from "../lib/database";

describe("MockDatabase", () => {
  it("clears users", () => {
    const database = new MockDatabase();
    database.createUser({
      username: "test",
    });

    expect(database.users).toHaveLength(1);
    database.clear();
    expect(database.users).toHaveLength(0);
  });
  it("does not clear service users", () => {
    const database = new MockDatabase();
    database.createServiceUser("clientID", "clientSecret");

    expect(database.findServiceUser()).toBeTruthy();

    database.clear();

    expect(database.findServiceUser()).toBeTruthy();
  });
});
