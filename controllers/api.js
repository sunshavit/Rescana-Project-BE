const joi = require("joi");
const sortByPriority = require("../utils/index");
const { configSchema, inputSchema } = require("../models/index");

exports.validate = async (req, res, next) => {
  try {
    const { config, input } = req.body;
    if (!config || !input)
      throw { message: "Please provide both configs and data", status: 400 };
    const validConfig = await configSchema.validateAsync(config);
    const validInput = await inputSchema.validateAsync(input);
    next();
  } catch (error) {
    next(error);
  }
};

exports.sort = async (req, res, next) => {
  try {
    const { config, input } = req.body;
    const result = await sortByPriority(config, input);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.error = async (err, req, res, next) => {
  res.status(err.status || 500).json(err.message);
};
