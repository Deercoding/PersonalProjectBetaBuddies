import mongoose from "mongoose";

const roomCounterSchema = new mongoose.Schema({
  unique_id: { type: String },
  roomId: { type: String },
});

const RoomCounter = mongoose.model("RoomCounter", roomCounterSchema);

const boulderingChatSchema = new mongoose.Schema({
  sendTime: { type: Date },
  roomId: { type: String },
  userId: { type: String },
  content: { type: String },
  tagSearched: { type: Boolean },
  roomNumericId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomCounter",
  },
});

// create a model
const BoulderingChat = mongoose.model("BoulderingChat", boulderingChatSchema); //singular + lower case start

// BoulderingChat.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

// RoomCounter.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

export { BoulderingChat, RoomCounter };
