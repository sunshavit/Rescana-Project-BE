const dns = require('dns').promises;

const ipRegex =
  /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/;

const domainRegex =
  /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

const isDomainOrIp = data => {
  const domain = data?.match(domainRegex);
  const ip = data?.match(ipRegex);
  if (ip) return ip[0];
  else if (domain) return domain[0];
  throw new Error('Invalid Input');
};

const isSubDomain = domain => {
  const splittedDomain = domain?.split('.');
  if (splittedDomain?.length > 2 && splittedDomain[0] !== 'www')
    return splittedDomain[1] + '.' + splittedDomain[2];
  return domain;
};

const getPriority = (config, value) => {
  value = isSubDomain(value);
  const item = config?.filter(
    item => item?.domain?.replace('www.', '') === value
  );
  return item[0]?.priority || -1;
};

const sortByPriority = async (config, data) => {
  try {
    data.sort((curr, next) => {
      curr = isDomainOrIp(curr);
      next = isDomainOrIp(next);
      return getPriority(config, next) - getPriority(config, curr);
    });
    const result = await Promise.allSettled(
      data.map(async value => await dns.lookup(value, 4))
    );
    return result.map(item => item.value.address);
  } catch (error) {
    console.error(error?.message);
  }
};

module.exports = sortByPriority;
