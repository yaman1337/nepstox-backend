import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import swaggerDoc from "./docs/swagger.js";

dotenv.config();

const { PORT } = process.env;

const server = http.createServer(app);
server.listen(PORT);

swaggerDoc(app);

server.on("error", (e) => {
  console.error(e);
  process.exit(0);
});

server.on("listening", (e) => {
  console.log("Listening on port: " + PORT);
  console.log("Visit: " + "http://localhost:" + PORT)
});
