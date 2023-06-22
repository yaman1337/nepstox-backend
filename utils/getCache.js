import { client } from "../redis/redis.js";
import HttpResponse from "./HttpResponse.js";

const checkCache = (key, marketStatus = false) => {
  return async (req, res, next) => {
    const data = await client.get(key);
    if (marketStatus) {
      const marketStatusData = await client.get("marketStatus");
      if (marketStatusData) {
        const response = new HttpResponse({
          message: "data fetched from cache.",
          data: JSON.parse(data),
          marketStatus: JSON.parse(marketStatusData),
        });
        return res.send(response);
      }
    }
    if (data) {
      const response = new HttpResponse({
        message: "data fetched from cache.",
        data: JSON.parse(data),
      });
      return res.send(response);
    }
    next();
  };
};

export { checkCache };
