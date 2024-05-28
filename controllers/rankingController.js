import rankingService from "../services/rankingService.js";

const compareRanking = async (req, res, next) => {
  try {
    const result = await rankingService.compareRanking();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const vietnamRankings = async (req, res, next) => {
  try {
    const result = await rankingService.vietnamRankings();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const otherRegionRankings = async (req, res, next) => {
  try {
    const result = await rankingService.otherRegionRankings();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  compareRanking,
  vietnamRankings,
  otherRegionRankings,
};
