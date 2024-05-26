import { Section } from "../models/index.js";

const createSection = async ({ name, items }) => {
  const section = await Section.create({
    name: name,
    item: items,
  });

  return section;
};

const fetchSectionById = async (section_id) => {
  const section = await Section.findById(section_id);
  return section;
};

const fetchSections = async (page = 1, limit = 10) => {
  const pagination = await Section.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "sections",
      },
    }
  );
  return pagination;
};

const deleteSectionById = async (section_id) => {
  await Section.deleteOne({ _id: section_id });
};

const updateSectionById = async (section_id, { name, items }) => {
  const section = await Section.findByIdAndUpdate(
    section_id,
    { name, items },
    { new: true }
  );
  return section;
};

export default {
  createSection,
  fetchSections,
  fetchSectionById,
  deleteSectionById,
  updateSectionById,
};
