import ApiError from "./ApiError";

describe("ApiError", () => {
  it("should create an error with status and message", () => {
    const error = new ApiError(404, "Not Found");

    expect(error.status).toBe("404");
    expect(error.message).toBe("Not Found");
    expect(error.name).toBe("404");
  });

  it("should create an error with just status if no message is provided", () => {
    const error = new ApiError(500);

    expect(error.status).toBe("500");
    expect(error.message).toBe("500");
    expect(error.name).toBe("500");
  });

  it("should implement toString method correctly", () => {
    const error = new ApiError(400, "Bad Request");

    expect(error.toString()).toBe("Bad Request");
  });

  it("should extend the Error class", () => {
    const error = new ApiError(403, "Forbidden");

    expect(error instanceof Error).toBe(true);
  });
});
