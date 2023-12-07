import express from "express";
import path from "path";
import url from "url";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { BoulderingChat, RoomCounter } from "./models/chat-model.js";
import chatRouter from "./routes/chat-api.js";
import wallUpdateRouter from "./routes/wallupload-api.js";
import roomRouter from "./routes/wallroom-api.js";
import betaRouter from "./routes/beta-api.js";
import searchRouter from "./routes/search-api.js";
import signRouter from "./routes/sign-api.js";
import gameRouter from "./routes/game-api.js";
import adRouter from "./routes/ad-api.js";
import scheduleRouter from "./routes/schedule.js";
import roleRouter from "./routes/rolevalid-api.js";

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(cors()); //temporary for local developement

app.use("/api/chat", chatRouter);
app.use("/api/wallupload", wallUpdateRouter);
app.use("/api/wallchatroom", roomRouter);
app.use("/api/beta", betaRouter);
app.use("/api/search", searchRouter);
app.use("/api/sign", signRouter);
app.use("/api/game", gameRouter);
app.use("/api/ad", adRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/role", roleRouter);

app.use(express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
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
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("socketio", io);
io.on("connection", (socket) => {
  console.log("Socket-connect");

  socket.on("talk", async (msg, userIdentify) => {
    console.log(userIdentify);
    const userName = userIdentify.userName;
    const roomNumericId = userIdentify.roomNumericId;
    const roomName = userIdentify.roomName;

    const roomExist = await RoomCounter.find({ _id: roomNumericId });

    const saveMessage = new BoulderingChat({
      sendTime: new Date(),
      userName: userName,
      roomId: roomName,
      content: msg,
      tagSearched: 0,
      roomNumericId: roomExist[0]._id,
    });
    await saveMessage.save();

    // const room = io.sockets.adapter.rooms.get("admin");
    // const roomUsers = await io.in("admin").fetchSockets();
    socket.join(roomNumericId);
    io.emit("talk", {
      message: msg,
      roomNumericId: roomNumericId,
      userName: userName,
    });
  });
});

server.listen(4000, () => {
  console.log(`Socket is running on port 4000`);
});
