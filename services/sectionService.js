import { populate } from "dotenv";
import { Section } from "../models/index.js";

const createSection = async ({ name, items }) => {
  const section = await Section.create({
    name: name,
    items: items,
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
      populate: {
        path: "items",
        select: "title songs photo_url",
        populate: {
          path: "songs",
          select: "title artist photo_url duration file isPremium lyric",
          populate: {
            path: "artist",
            select: "user display_name",
            populate: {
              path: "user",
              select: "first_name last_name photo_url",
            },
          },
        },
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
const fetch4Sections = async () => {
  const sections = await Section.find({})
    .limit(4)
    .sort({ createdAt: -1 })
    .populate({
      path: "items",
      select: "title songs photo_url",
      populate: {
        path: "songs",
        select: "title artist photo_url duration file isPremium lyric",
        populate: {
          path: "artist",
          select: "user display_name",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      },
    });
  return sections;
};
export default {
  createSection,
  fetchSections,
  fetchSectionById,
  deleteSectionById,
  updateSectionById,
  fetch4Sections,
};
