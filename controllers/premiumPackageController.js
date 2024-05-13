import premiumPackageService from "../services/premiumPackageService.js";

const createPremiumPackage = async (req, res, next) => {
  try {
    const { name, description, price, durationMonths } = req.body;
    const premiumPackage = await premiumPackageService.createPremiumPackage({
      name,
      description,
      price,
      durationMonths,
    });
    res.json({ premiumPackage });
  } catch (error) {
    next(error);
  }
};

const getPremiumPackageById = async (req, res, next) => {
  try {
    const { premiumPackage_id } = req.params;
    const premiumPackage = await premiumPackageService.fetchPremiumPackageById(
      premiumPackage_id
    );

    res.json({ premiumPackage });
  } catch (error) {
    next(error);
  }
};

const getPremiumPackages = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await premiumPackageService.fetchPremiumPackages(
      page,
      limit
    );

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deletePremiumPackage = async (req, res, next) => {
  try {
    const { premiumPackage_id } = req.params;
    await premiumPackageService.deletePremiumPackageById(premiumPackage_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const updatePremiumPackageById = async (req, res, next) => {
  try {
    const { premiumPackage_id } = req.params;
    const { name, description, price, durationMonths } = req.body;
    const premiumPackage = await premiumPackageService.updatePremiumPackageById(
      premiumPackage_id,
      {
        name,
        description,
        price,
        durationMonths,
      }
    );

    res.json({ premiumPackage });
  } catch (error) {
    next(error);
  }
};

export default {
  createPremiumPackage,
  getPremiumPackages,
  getPremiumPackageById,
  deletePremiumPackage,
  updatePremiumPackageById,
};
