import pushTokenService from "../services/pushTokenService.js";

const saveToken = (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { token } = req.body;
    pushTokenService.saveToken({ token, user_id });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export default {
  saveToken,
};
