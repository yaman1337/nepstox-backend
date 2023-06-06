import { client } from "../redis/redis.js";
import HttpResponse from "./HttpResponse.js";

const checkCache = (key) => {
  return async (req, res, next) => {
    const data = await client.get(key);
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
