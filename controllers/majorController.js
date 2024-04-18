import majorService from "../services/majorService.js";

const createMajor = async (req, res, next) => {
  try {
    const { name, descriptions } = req.body;
    const major = await majorService.createMajor({ name, descriptions });
    res.json({ major });
  } catch (error) {
    next(error);
  }
};

const getAllMajors = async (req, res, next) => {
  try {
    const majors = await majorService.fetchAllMajors();
    res.json({ majors });
  } catch (error) {
    next(error);
  }
};

const getMajorById = async (req, res, next) => {
  try {
    const { major_id } = req.params;
    const major = await majorService.fetchMajorById(major_id);
    res.json({ major });
  } catch (error) {
    next(error);
  }
};

const updateMajor = async (req, res, next) => {
  try {
    const { major_id } = req.params;
    const { name, descriptions } = req.body;
    const major = await majorService.updateMajor({
      major_id,
      name,
      descriptions,
    });
    res.json({ major });
  } catch (error) {
    next(error);
  }
};

const deleteMajor = async (req, res, next) => {
  try {
    const { major_id } = req.params;
    await majorService.deleteMajorById(major_id);
    res.json({ message: "deleted" });
  } catch (error) {
    next(error);
  }
};

export default {
  createMajor,
  getAllMajors,
  getMajorById,
  updateMajor,
  deleteMajor,
};
