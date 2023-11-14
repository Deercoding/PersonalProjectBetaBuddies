import express from "express";
import path from "path";
import url from "url";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Chat from "./models/chat-model.js";
import chatRouter from "./routes/chat-api.js";

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", chatRouter);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

mongoose
  .connect(process.env.mongodbconnect)
  .then(() => {
    console.log("Connect to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Connection Failed.");
  });

//socket io
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket-connect");

  socket.on("talk", async (msg, userIdentify) => {
    const userId = userIdentify.userId;
    const roomId = userIdentify.roomId;

    const saveMessage = new Chat({
      sendTime: new Date(),
      userId: userId,
      roomId: roomId,
      content: msg,
    });
    await saveMessage.save();

    // const room = io.sockets.adapter.rooms.get("admin");
    // const roomUsers = await io.in("admin").fetchSockets();
    socket.join(roomId);
    io.emit("talk", { message: msg, roomId: roomId, userId: userId });
  });
});

server.listen(4000, () => {
  console.log(`Socket is running on port 4000`);
});
