function validatorMiddleware(schema) {
  return (req, res, next) => {
    if (!schema) return next();

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details?.map((detail) => detail.message) || [],
      });
    }

    return next();
  };
}

module.exports = validatorMiddleware;
