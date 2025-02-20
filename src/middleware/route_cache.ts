import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache();

export = (duration: number) =>
  (req: Request, res: Response, next: NextFunction) => {
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
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        cache.set(key, body, duration);
        console.info(`Saving cache for ${key}`);
        return originalJson(body);
      };
      next();
    }
  };
