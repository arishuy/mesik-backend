import regionService from "../services/regionService.js";

const createRegion = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const region = await regionService.createRegion({
      name,
      description,
    });
    res.json({ region });
  } catch (error) {
    next(error);
  }
};

const getRegionById = async (req, res, next) => {
  try {
    const { region_id } = req.params;
    const region = await regionService.fetchRegionById(region_id);

    res.json({ region });
  } catch (error) {
    next(error);
  }
};

const getRegions = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await regionService.fetchRegions(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteRegion = async (req, res, next) => {
  try {
    const { region_id } = req.params;
    await regionService.deleteRegionById(region_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const updateRegionById = async (req, res, next) => {
  try {
    const { region_id } = req.params;
    const { name, description } = req.body;
    const region = await regionService.updateRegionById(region_id, {
      name,
      description,
    });

    res.json({ region });
  } catch (error) {
    next(error);
  }
};

export default {
  createRegion,
  getRegions,
  getRegionById,
  deleteRegion,
  updateRegionById,
};
