import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nepseDataRouter from "./routes/nepse/nepseData.routes.js";
// import { client } from "./redis/redis.js";
import ipoRouter from "./routes/ipo/ipo.routes.js";
const app = express();

app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

app.use("/nepse", nepseDataRouter);
app.use("/ipo", ipoRouter);

app.get("/", (req, res) => {
  res.send("<h1>Visit <a href='/docs'>/docs</a> for documentation.</h1>");
});

export default app;
