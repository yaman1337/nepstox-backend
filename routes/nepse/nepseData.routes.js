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
  topTransaction,
  marketSummary,
  indices,
  subIndices,
  floorSheet,
  companyNews,
  forex,
  companyWiseFloorSheet,
  graphData,
  marketStatus,
  companyGraph,
  nepseStatus,
  latestNews,
  topGainerNew,
  newTopLoser,
  newTopTurnOver,
  newLiveData,
} from "../../controllers/nepse/nepseData.controller.js";
import { checkCache } from "../../utils/getCache.js";

const nepseDataRouter = Router();

nepseDataRouter
  .get("/companies", checkCache("companies"), companies)
  .get("/company-details/:symbol", companyDetails)
  .get("/live-trading", checkCache("liveTrading"), liveTradingData)
  .get("/today-share-price", todaySharePrice)
  .get("/top-broker", checkCache("topBroker"), topBroker)
  .get("/top-gainer", checkCache("topGainer"), topGainer)
  .get("/top-gainer/new", checkCache("newTopGainer"), topGainerNew)
  .get("/top-loser", checkCache("topLoser"), topLoser)
  .get("/top-loser/new", checkCache("newTopLoser"), newTopLoser)
  .get("/top-share", checkCache("topShare"), topShare)
  .get("/top-turnover", checkCache("topTurnOver"), topTurnOver)
  .get("/top-turnover/new", checkCache("newTopTurnOver"), newTopTurnOver)
  .get("/top-transaction", checkCache("topTransaction"), topTransaction)
  .get("/market-summary", checkCache("marketSummary"), marketSummary)
  .get("/indices", checkCache("indices"), indices)
  .get("/subindices", checkCache("subIndices"), subIndices)
  .get("/floorsheet", checkCache("floorSheet"), floorSheet)
  .get(
    "/floorsheet/:symbol",
    checkCache("companyWiseFloorSheet"),
    companyWiseFloorSheet
  )
  .get("/news/:symbol/:start/:news", companyNews)
  .get("/forex", checkCache("forex"), forex)
  .get("/graph/:symbol/:start/:end/:resolution", graphData)
  .get("/graph/company/:symbol/:start/:end/:resolution", companyGraph)
  .get("/market-status", checkCache("marketStatus"), marketStatus)
  .get("/status", nepseStatus)
  .get("/latest-news", latestNews)
  .get("/live/new", newLiveData);
export default nepseDataRouter;
