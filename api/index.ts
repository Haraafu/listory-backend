import { createServer } from "http";
import { parse } from "url";
import app from "../src/app";

export default function handler(req: any, res: any) {
  const server = createServer(app);
  server.emit("request", req, res);
}