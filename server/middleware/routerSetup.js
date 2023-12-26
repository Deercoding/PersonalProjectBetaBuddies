import express from "express";
import url from "url";
import path from "path";

export function routerSetup() {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  return router;
}

export function dirnameSetup() {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
}
