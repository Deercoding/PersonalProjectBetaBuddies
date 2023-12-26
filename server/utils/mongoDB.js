import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const mongoDBConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongodbconnect);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`MongoDB connection error`);
  }
};

export default mongoDBConnect;
