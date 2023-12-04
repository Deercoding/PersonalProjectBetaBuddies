import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createClient } from "redis";

let redisClient = createClient({
  url: process.env.REDISSETUP,
});

redisClient.on("error", (error) => {
  console.error("Redis on error:", error);
  redisClient.disconnect();
});

console.log("Redis try to connect");
await redisClient.connect();

export { redisClient };
