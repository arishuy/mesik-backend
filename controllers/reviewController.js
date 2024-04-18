import reviewService from "../services/reviewService.js";

const createReview = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { job_request_id, rating, comment } = req.body;
    const review = await reviewService.createReview({
      user_id,
      job_request_id,
      rating,
      comment,
    });
    res.json({ review });
  } catch (error) {
    next(error);
  }
};

export default {
  createReview,
};
