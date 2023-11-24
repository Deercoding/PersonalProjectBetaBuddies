import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tagListSchema = new mongoose.Schema({
  addTime: { type: Date },
  userId: { type: String },
  tag: { type: String },
  usedCount: { type: Number },
});

// create a model
const TagList = mongoose.model("TagList", tagListSchema); //singular + lower case start

// add first list
// const data = fs.readFileSync(
//   path.join(__dirname, "../utils/boulderingTerms.txt"),
//   "utf-8"
// );
// const objects = data.split("\n").map((line) => line.trim());
// TagList.insertMany(
//   objects.map((obj) => ({
//     addTime: new Date(),
//     userId: "defualt",
//     tag: obj,
//     usedCount: 0,
//   }))
// )
//   .then(function () {
//     console.log("Data inserted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

// const saveTag = new TagList({
//   addTime: new Date(),
//   userId: "defualt",
//   tag: "起攀",
//   usedCount: 0,
// });
// saveTag.save().then();

// TagList.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

export default TagList;
