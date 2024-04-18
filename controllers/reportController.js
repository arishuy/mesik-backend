import reportService from "../services/reportService.js";

const createReport = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { title, description } = req.body;
    const photo = req.file;
    const report = await reportService.createReport({
      user_id,
      title,
      description,
      photo,
    });
    res.json({ report });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const { report_id } = req.params;
    const report = await reportService.fetchReportById(report_id);

    res.json({ report });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await reportService.fetchReports(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const { report_id } = req.params;
    await reportService.deleteReportById(report_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export default {
  createReport,
  getReports,
  getReportById,
  deleteReport,
};
