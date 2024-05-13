import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const premiumPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên của gói dịch vụ
    description: { type: String, required: true }, // Mô tả gói dịch vụ
    price: { type: Number, required: true }, // Giá của gói dịch vụ
    durationMonths: { type: Number, required: true }, // Thời gian hiệu lực của gói dịch vụ (tính bằng tháng)
  },
  {
    timestamps: true,
  }
);

premiumPackageSchema.plugin(mongoosePaginate);
const PremiumPackage = mongoose.model("PremiumPackage", premiumPackageSchema);
export default PremiumPackage;
