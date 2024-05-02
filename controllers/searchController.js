import searchService from "../services/searchService.js";

const searchByAll = async (req, res, next) => {
  try {
    const { keyword } = req.body;
    const result = await searchService.searchByAll(keyword);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const get5Keywords = async (req, res, next) => {
  try {
    const result = await searchService.get5Keywords();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  searchByAll,
  get5Keywords,
};
