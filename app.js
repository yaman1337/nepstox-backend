import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nepseDataRouter from "./routes/nepse/nepseData.routes.js";

const app = express();

app.use(cors());

app.use("/nepse", nepseDataRouter);

app.get("/", (req, res) => {
  res.send("Visit <a href='http://localhost:9000/docs'>http://localhost:9000/docs</a> for documentation.");
});

export default app;
