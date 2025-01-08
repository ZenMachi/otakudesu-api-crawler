const NodeCache = require("node-cache");

const cache = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  // Check if request is GET
  // if not, call next

  if (req.method !== "GET") {
    console.error("Cannot cache non-GET nethods");
    return next();
  }

  // Check if key exist in cache
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  // if it exist, send cache result,
  if (cachedResponse) {
    console.info(`Found cache for ${key}`);
    res.json(cachedResponse);
  } else {
    // if not, replace .json with method to set response to cache
    console.info(`Cache not found ${key}`);
    res.originalJson = res.json;
    res.json = (body) => {
      res.originalJson(body);
      cache.set(key, body, duration);
      console.info(`Saving cache for ${key}`);
    };
    next();
  }
};
