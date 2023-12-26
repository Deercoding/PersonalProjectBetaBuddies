import mongoose from "mongoose";

const tagRoomSchema = new mongoose.Schema({
  roomNumericId: { type: String },
  tag: { type: String },
  tagCount: { type: Number },
});

// create a model
const TagRoom = mongoose.model("TagRoom", tagRoomSchema); //singular + lower case start

// TagRoom.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

export default TagRoom;
