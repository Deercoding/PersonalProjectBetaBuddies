import express from "express";
import path from "path";
import url from "url";
import { Server } from "socket.io";
import mongoDBConnect from "./utils/mongoDB.js";
import cors from "cors";
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
import dashboardRouter from "./routes/dashboard.js";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

const app = express();
dotenv.config();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
mongoDBConnect();

app.use(cors({ origin: ["http://localhost:3000", "https://localhost:9200/"] }));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
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
app.use("/api/dashboard", dashboardRouter);

app.use(express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const server = app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000", "https://localhost:9200/"] },
});
app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("talk", async (msg, userIdentify) => {
    const { userName, roomNumericId, roomName } = userIdentify;
    let roomNumericIdExist;
    const roomExist = await RoomCounter.find({ _id: roomNumericId });

    if (roomExist.length > 0) {
      roomNumericIdExist = roomExist[0]._id;
    }
    const saveMessage = new BoulderingChat({
      sendTime: new Date(),
      userName: userName,
      roomId: roomName,
      content: msg,
      tagSearched: 0,
      roomNumericId: roomNumericIdExist,
    });
    await saveMessage.save();

    socket.join(roomNumericId);
    io.emit("talk", {
      message: msg,
      roomNumericId: roomNumericId,
      userName: userName,
    });
  });
});
