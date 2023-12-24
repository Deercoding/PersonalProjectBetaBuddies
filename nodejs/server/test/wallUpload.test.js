import path from "path";
import fs from "fs";
import { uploadObject } from "../utils/awsS3.js";
import crypto from "node:crypto";
import { redisClient } from "../utils/cache.js";
import { wallUpload } from "../controller/wallupload.js";

// Mocking the external dependencies
jest.mock("../utils/cache.js", () => ({
  redisClient: {
    isReady: jest.fn(),
    hGet: jest.fn(),
  },
}));

jest.mock("crypto", () => ({
  createHash: jest.fn(),
  update: jest.fn(),
  digest: jest.fn(),
}));

jest.mock("../utils/awsS3.js", () => ({
  uploadObject: jest.fn(),
}));

describe("wallUploadValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return "請上傳圖片再送出" if no files provided', async () => {
    const files = [];
    const response = await wallUpload(files);
    expect(response).toBe("請上傳圖片再送出");
  });

  it('should return "Reply old image with color detection" if find image in redis', async () => {
    const files = [""];
    const response = await wallUpload(files);
    redisClient.isReady.mockImplementation(() => true);
    redisClient.hGet.mockImplementation(() => "[{`hashed image`}]");
    // this is returning error
    expect(response).toBe("Reply old image with color detection");
  });
});
