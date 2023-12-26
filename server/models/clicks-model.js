import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  searchId: { type: String },
  date: { type: String },
  type: { type: String },
  clickCount: { type: Number },
});

// create a model
const Click = mongoose.model("Click", clickSchema); //singular + lower case start

// Click.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

export default Click;
