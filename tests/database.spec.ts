import MockDatabase from "../lib/database";
import { DuplicateUserError } from "../lib/error";

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

  it("does not allow creating users with the same id", () => {
    const database = new MockDatabase();

    database.createUser({ id: "test" });
    expect(() => database.createUser({ id: "test" })).toThrow(
      DuplicateUserError
    );
  });

  it("does not allow creating users with the same username", () => {
    const database = new MockDatabase();

    database.createUser({ username: "test" });
    expect(() => database.createUser({ username: "test" })).toThrow(
      DuplicateUserError
    );
  });

  it("does not allow creating users with the same email", () => {
    const database = new MockDatabase();

    database.createUser({ username: "test1", email: "test@test.com" });
    expect(() =>
      database.createUser({ username: "test2", email: "test@test.com" })
    ).toThrow(DuplicateUserError);
  });
});
