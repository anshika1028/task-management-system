import { Sequelize } from "sequelize-typescript";
import Task from "./task.model";
import User from "./user.model";

describe("Task Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [Task, User], // Make sure to include all models
      logging: false,
    });

    return sequelize.sync({ force: true }); // This will clear the database and recreate tables
  });

  afterAll(() => {
    return sequelize.close();
  });

  it("should create a task", async () => {
    const user = await User.create({
      username: "testuser",
      password: "password",
      role: "user",
    });

    const task = await Task.create({
      priority: "high",
      due_date: "2024-03-25",
      title: "Test Task",
      description: "Test description",
      completed: false,
      user_id: user.id,
    });

    expect(task.priority).toBe("high");
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("Test description");
    expect(task.completed).toBe(false);
    expect(task.user_id).toBe(user.id);
  });

  it("should be able to associate a task with a user", async () => {
    const user = await User.create({
      username: "testuser2",
      password: "password",
      role: "user",
    });

    const task = await Task.create({
      priority: "medium",
      due_date: "2024-03-26",
      title: "Another Test Task",
      description: "Another test description",
      completed: true,
      user_id: user.id,
    });

    const retrievedTask = await Task.findByPk(task.id, { include: [User] });
    expect(retrievedTask).not.toBeNull();
    expect(retrievedTask?.user).toBeDefined();
    expect(retrievedTask?.user.username).toBe("testuser2");
  });

  it("should validate priority enum", async () => {
    const user = await User.create({
      username: "testuser3",
      password: "password",
      role: "user",
    });

    await expect(
      Task.create({
        priority: null,
        due_date: "2024-03-27",
        title: "Invalid Task",
        description: "Invalid description",
        completed: false,
        user_id: user.id,
      })
    ).rejects.toThrow();
  });
});
