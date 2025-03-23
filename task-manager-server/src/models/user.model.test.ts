import { Sequelize } from "sequelize-typescript";
import User from "./user.model";

describe("User Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [User],
      logging: false,
    });

    return sequelize.sync({ force: true });
  });

  afterAll(() => {
    return sequelize.close();
  });

  it("should create a user", async () => {
    const user = await User.create({
      username: "testuser",
      password: "password",
      role: "user",
    });

    expect(user.username).toBe("testuser");
    expect(user.password).toBe("password");
    expect(user.role).toBe("user");
  });

  it("should validate username uniqueness", async () => {
    await User.create({
      username: "uniqueuser",
      password: "password",
      role: "user",
    });

    await expect(
      User.create({
        username: "uniqueuser",
        password: "anotherpassword",
        role: "admin",
      }),
    ).rejects.toThrow();
  });

  it("should validate role enum", async () => {
    await expect(
      User.create({
        username: "testuser4",
        password: "password",
        role: null,
      }),
    ).rejects.toThrow();
  });
});
