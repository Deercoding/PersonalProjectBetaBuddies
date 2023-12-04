import { Client } from "@elastic/elasticsearch";
import fs from "fs";

import dotenv from "dotenv";
import path from "path";
import url from "url";

dotenv.config({ path: "./.env" });
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(path.join(__dirname, "./http_ca.crt")),
    rejectUnauthorized: true,
  },
});

export default client;
