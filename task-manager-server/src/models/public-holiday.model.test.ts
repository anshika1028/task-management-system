import { Sequelize } from "sequelize-typescript";
import PublicHoliday from "./public-holiday.model";

describe("PublicHoliday Model", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [PublicHoliday],
      logging: false,
    });

    return sequelize.sync({ force: true });
  });

  afterAll(() => {
    return sequelize.close();
  });

  it("should create a public holiday", async () => {
    const holiday = await PublicHoliday.create({
      holiday_name: "New Year's Day",
      date: "2024-01-01",
    });

    expect(holiday.holiday_name).toBe("New Year's Day");
    expect(holiday.date).toBe("2024-01-01");
  });

  it("should validate holiday_name uniqueness", async () => {
    await PublicHoliday.create({
      holiday_name: "Christmas",
      date: "2024-12-25",
    });

    await expect(
      PublicHoliday.create({
        holiday_name: "Christmas",
        date: "2024-12-26", // Different date
      })
    ).rejects.toThrow();
  });

  it("should validate date uniqueness", async () => {
    await PublicHoliday.create({
      holiday_name: "Independence Day",
      date: "2024-07-04",
    });

    await expect(
      PublicHoliday.create({
        holiday_name: "Another Holiday", // Different name
        date: "2024-07-04", // Same date
      })
    ).rejects.toThrow();
  });
});
