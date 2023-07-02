import {
  getIPOCompanies,
  BulkIPOChecker,
} from "../../controllers/ipo_checker/ipoChecker.controller.js";
import { Router } from "express";

const ipoRouter = Router();

ipoRouter
  .get("/companies", getIPOCompanies)
  .post("/bulk-check", BulkIPOChecker);

export default ipoRouter;
