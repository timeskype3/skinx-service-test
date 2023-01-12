import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PATH, MONGO_PORT,
  MONGO_DB_NAME,
} = process.env;

const MONGO_URI = "mongodb://" +
  MONGO_USERNAME + ":" +
  MONGO_PASSWORD + "@" +
  MONGO_PATH + ":" +
  MONGO_PORT + "/" +
  MONGO_DB_NAME;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error: Error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};