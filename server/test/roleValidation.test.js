import { roleValidation } from "../controller/roleValidation";
import jwt from "jsonwebtoken";
import { checkRole } from "../models/user-model.js";

// Mocking the external dependencies
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("../models/user-model.js", () => ({
  checkRole: jest.fn(),
}));

describe("roleValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return "Client Error (No token)" if no authorization token is provided', async () => {
    const headers = {};
    const response = await roleValidation(headers);
    expect(response).toBe("Client Error (No token)");
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(checkRole).not.toHaveBeenCalled();
  });

  it('should return "Client Error (Wrong token)" if the token is invalid', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const headers = { authorization: "Bearer invalidtoken" };
    const response = await roleValidation(headers);
    expect(response).toBe("Client Error (Wrong token)");
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(checkRole).not.toHaveBeenCalled();
  });

  it('should return "user" if the role is not admin', async () => {
    jwt.verify.mockReturnValue({ userId: "123" });
    checkRole.mockResolvedValue([{ role: "user" }]);
    const headers = { authorization: "Bearer validtoken" };
    const response = await roleValidation(headers);
    expect(response).toBe("user");
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(checkRole).toHaveBeenCalledTimes(1);
  });

  it('should return "admin" if the role is admin', async () => {
    jwt.verify.mockReturnValue({ userId: "123" });
    checkRole.mockResolvedValue([{ role: "admin" }]);
    const headers = { authorization: "Bearer validtoken" };
    const response = await roleValidation(headers);
    expect(response).toBe("admin");
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(checkRole).toHaveBeenCalledTimes(1);
  });
});
