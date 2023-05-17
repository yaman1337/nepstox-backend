import { Router } from "express";
import {
  companies,
  companyDetails,
  liveTradingData,
  todaySharePrice,
  topBroker,
  topGainer,
  topLoser,
  topShare,
  topTurnOver,
  topTransaction
} from "../../controllers/nepse/nepseData.controller.js";

const nepseDataRouter = Router();

nepseDataRouter
  .get("/companies", companies)
  .get("/company-details/:symbol", companyDetails)
  .get("/live-trading", liveTradingData)
  .get("/today-share-price", todaySharePrice)
  .get("/top-broker", topBroker)
  .get("/top-gainer", topGainer)
  .get("/top-loser", topLoser)
  .get("/top-share", topShare)
  .get("/top-turnover", topTurnOver)
  .get("/top-transaction", topTransaction)

export default nepseDataRouter;
