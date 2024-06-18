import { Region } from "../models/index.js";

const createRegion = async ({ name, description }) => {
  const region = await Region.create({
    name: name,
    description: description,
  });

  return region;
};

const fetchRegionById = async (region_id) => {
  const region = await Region.findById(region_id);
  return region;
};

const fetchRegions = async (page = 1, limit = 10) => {
  const pagination = await Region.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "regions",
      },
    }
  );
  return pagination;
};

const deleteRegionById = async (region_id) => {
  const region = await Region.findById(region_id);
  if (!region) {
    throw new Error("Region not found");
  }
  await region.delete();
  // await Region.deleteOne({ _id: region_id });
};

const updateRegionById = async (region_id, { name, description }) => {
  const region = await Region.findByIdAndUpdate(
    region_id,
    { name, description },
    { new: true }
  );
  return region;
};

export default {
  createRegion,
  fetchRegions,
  fetchRegionById,
  deleteRegionById,
  updateRegionById,
};
