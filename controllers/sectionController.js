import sectionService from "../services/sectionService.js";

const createSection = async (req, res, next) => {
  try {
    const { name, items } = req.body;
    const section = await sectionService.createSection({
      name,
      items,
    });
    res.json({ section });
  } catch (error) {
    next(error);
  }
};

const updateSection = async (req, res, next) => {
  try {
    const { section_id } = req.params;
    const { name } = req.body;
    const section = await sectionService.updateSection(section_id, { name });

    res.json({ section });
  } catch (error) {
    next(error);
  }
};

const getSectionById = async (req, res, next) => {
  try {
    const { section_id } = req.params;
    const section = await sectionService.fetchSectionById(section_id);

    res.json({ section });
  } catch (error) {
    next(error);
  }
};

const getSections = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const sections = await sectionService.fetchSections(page, limit);

    res.json({ sections });
  } catch (error) {
    next(error);
  }
};

const deleteSection = async (req, res, next) => {
  try {
    const { section_id } = req.params;
    await sectionService.deleteSectionById(section_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const updateSectionById = async (req, res, next) => {
  try {
    const { section_id } = req.params;
    const { name, items } = req.body;
    const section = await sectionService.updateSectionById(section_id, {
      name,
      items,
    });

    res.json({ section });
  } catch (error) {
    next(error);
  }
};

const fetch4Sections = async (req, res, next) => {
  try {
    const sections = await sectionService.fetch4Sections();

    res.json({ sections });
  } catch (error) {
    next(error);
  }
};

const getBannerSection = async (req, res, next) => {
  try {
    const sections = await sectionService.getBannerSection();

    res.json({ sections });
  } catch (error) {
    next(error);
  }
};

export default {
  createSection,
  updateSection,
  getSections,
  getSectionById,
  deleteSection,
  updateSectionById,
  fetch4Sections,
  getBannerSection,
};
