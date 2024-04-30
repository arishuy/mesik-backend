import rankingService from "../services/rankingService.js";

const compareRanking = async (req, res, next) => {
  try {
    const result = await rankingService.compareRanking();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  compareRanking,
};
