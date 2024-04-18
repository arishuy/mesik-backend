import statisticsService from "../services/statisticsService.js";

const getStatisticsForAdmin = async (req, res, next) => {
  try {
    const statistics = await statisticsService.getStatisticsForAdmin();
    res.json({ statistics });
  } catch (error) {
    next(error);
  }
};

const getStatisticsForExpert = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const stats = await statisticsService.getStatisticsForExpert(user_id);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const getTotalIncome = async (req, res, next) => {
  try {
    const { start_date, end_date, by } = req.query;
    const stats = await statisticsService.getIncomeForExpert({
      start_date,
      end_date,
      by,
    });
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const getExpertIncome = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { start_date, end_date, by } = req.query;
    const stats = await statisticsService.getIncomeForExpert({
      expert_id: user_id,
      start_date,
      end_date,
      by,
    });
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

export default {
  getStatisticsForAdmin,
  getStatisticsForExpert,
  getTotalIncome,
  getExpertIncome,
};
