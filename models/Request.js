import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Thêm các trường khác tùy vào yêu cầu của ứng dụng
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reason: String,
    descriptions: String,
    display_name: String,
  },
  {
    timestamps: true,
  }
);
requestSchema.plugin(mongoosePaginate);
const Request = mongoose.model("Request", requestSchema);

export default Request;
