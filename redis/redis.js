import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err) => {
  console.log("Error " + err);
});

client.connect();

export { client };
