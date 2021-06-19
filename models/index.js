const joi = require('joi');

const configSchema = joi.array().items(
  joi.object({
    domain: joi
      .alternatives()
      .try(
        joi.string().domain().error(new Error('Please provide a valid domain')),
        joi
          .string()
          .ip({ version: ['ipv4'] })
          .error(new Error('Please provide a valid IPv4 address'))
      )
      .error(new Error('Please provide a valid IPv4 address or domain')),
    priority: joi
      .number()
      .min(1)
      .required()
      .error(new Error('Please provide a number as priority')),
  })
);

const inputSchema = joi
  .array()
  .min(1)
  .items(
    joi
      .alternatives()
      .try(
        joi.string().domain().error(new Error('Please provide a valid domain')),
        joi
          .string()
          .ip({ version: ['ipv4'] })
          .error(new Error('Please provide a valid IPv4 address'))
      )
      .required()
      .error(new Error('Please provide a valid IPv4 address or domain'))
  );

module.exports = { configSchema, inputSchema };
