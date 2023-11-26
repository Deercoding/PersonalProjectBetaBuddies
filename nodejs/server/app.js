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
import searchKeyWord from "./utils/elasticsearch.js";

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(cors()); //temporary for local developement

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/chat", chatRouter);
app.use("/api/wallupload", wallUpdateRouter);
app.use("/api/wallchatroom", roomRouter);
app.use("/search", searchKeyWord);
app.use("/api/beta", betaRouter);

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
app.use(cors());
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
    const userId = userIdentify.userId;
    const roomNumericId = userIdentify.roomNumericId;
    const roomName = userIdentify.roomName;

    const roomExist = await RoomCounter.find({ _id: roomNumericId });

    const saveMessage = new BoulderingChat({
      sendTime: new Date(),
      userId: userId,
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
      userId: userId,
    });
  });

  //add to test front end - remove before production
  io.emit("wallcolor", [
    "yellow_LM wall crop.jpg_1700748931781.jpg",
    "green_LM wall crop.jpg_1700748931781.jpg",
    "light_blue_LM wall crop.jpg_1700748931781.jpg",
    "dark_blue_AB wall crop new.jpg_1700748617487.jpg",
    "green_AB wall crop new.jpg_1700748617487.jpg",
  ]);
});

server.listen(4000, () => {
  console.log(`Socket is running on port 4000`);
});
