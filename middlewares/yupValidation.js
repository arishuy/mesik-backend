const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
