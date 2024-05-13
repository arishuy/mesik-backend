import { PremiumPackage } from "../models/index.js";

const createPremiumPackage = async ({
  name,
  description,
  price,
  durationMonths,
}) => {
  const premiumPackage = await PremiumPackage.create({
    name: name,
    description: description,
    price: price,
    durationMonths: durationMonths,
  });

  return premiumPackage;
};

const fetchPremiumPackageById = async (premiumPackage_id) => {
  const premiumPackage = await PremiumPackage.findById(premiumPackage_id);
  return premiumPackage;
};

const fetchPremiumPackages = async (page = 1, limit = 10) => {
  const pagination = await PremiumPackage.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "premiumPackages",
      },
    }
  );
  return pagination;
};

const deletePremiumPackageById = async (premiumPackage_id) => {
  await PremiumPackage.deleteOne({ _id: premiumPackage_id });
};

const updatePremiumPackageById = async (
  premiumPackage_id,
  { name, description, price, durationMonths }
) => {
  const premiumPackage = await PremiumPackage.findByIdAndUpdate(
    premiumPackage_id,
    { name, description, price, durationMonths },
    { new: true }
  );
  return premiumPackage;
};

export default {
  createPremiumPackage,
  fetchPremiumPackages,
  fetchPremiumPackageById,
  deletePremiumPackageById,
  updatePremiumPackageById,
};
