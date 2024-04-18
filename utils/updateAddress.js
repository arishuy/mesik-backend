import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/index.js";

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

await mongoose.connect(CONNECTION_URL);

await User.updateMany(
  {},
  {
    address: {
      city: {
        name: "Tỉnh Hà Giang",
        code: 2,
      },
      district: {
        name: "Huyện Mèo Vạc",
        code: 27,
      },
      ward: {
        name: "Xã Sủng Máng",
        code: 790,
      },
      other_detail: "",
    },
  }
);

console.log("Done");
