import {
  getCompanies,
  getCompanyDetails,
  getLiveTradingData,
  getTodaySharePrice,
  getTopBroker,
  getTopGainer,
  getTopLoser,
  getTopShare,
  getTopTransaction,
  getTopTurnOver,
  getMarketSummary,
  getIndices,
  getSubIndices,
  getFloorSheet,
  getCompanyNews,
} from "../../scraper/index.js";

import asyncHandler from "../../utils/asyncHandler.js";
import urls from "../../utils/urls.js";
import HttpResponse from "../../utils/HttpResponse.js";

/**
 * @openapi
 * /nepse/companies:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get nepse listed companies
 *    responses:
 *      200:
 *        summary: array
 */
const companies = asyncHandler(async (req, res) => {
  const data = await getCompanies(urls.getCompaniesUrl);
  const response = new HttpResponse({
    message: "Companies data fetched",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/company-details/{symbol}:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get details of company by its symbol parameter.
 *    parameters:
 *      - in: path
 *        name: symbol
 *        schema:
 *          type: string
 *        description: Symbol of company
 *    responses:
 *      200:
 *        summary: array
 */
const companyDetails = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const data = await getCompanyDetails(symbol);
  const response = new HttpResponse({
    message: "Company details fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/news/{symbol}/{start}/{length}:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get details of company by its symbol parameter.
 *    parameters:
 *      - in: path
 *        name: symbol
 *        schema:
 *          type: string
 *        description: Symbol of company
 *      - in: path
 *        name: start
 *        schema:
 *          type: number
 *        description: Start position of document
 *      - in: path
 *        name: length
 *        schema:
 *          type: number
 *        description: length of document
 *    responses:
 *      200:
 *        summary: array
 */
const companyNews = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const start = req.params.start || 0;
  const length = req.params.length || 10;
  const data = await getCompanyNews({ symbol, start, length });
  const response = new HttpResponse({
    message: "Company news fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/live-trading:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get live trading data.
 *    responses:
 *      200:
 *        summary: array
 */
const liveTradingData = asyncHandler(async (req, res) => {
  const data = await getLiveTradingData(urls.liveTradingUrl);
  const response = new HttpResponse({
    message: "Live trading data fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/today-share-price:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get today's share price.
 *    responses:
 *      200:
 *        summary: array
 */
const todaySharePrice = asyncHandler(async (req, res) => {
  const data = await getTodaySharePrice(urls.todaySharePriceUrl);
  const response = new HttpResponse({
    message: "Today share price fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-broker:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top brokers
 *    responses:
 *      200:
 *        summary: array
 */
const topBroker = asyncHandler(async (req, res) => {
  const data = await getTopBroker(urls.topBrokerUrl);
  const response = new HttpResponse({ message: "Top brokers fetched.", data });
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-gainer:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top gainers
 *    responses:
 *      200:
 *        summary: array
 */
const topGainer = asyncHandler(async (req, res) => {
  const data = await getTopGainer(urls.topGainerUrl);
  const response = new HttpResponse({ message: "Top gainer fetched.", data });
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-loser:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top losers.
 *    responses:
 *      200:
 *        summary: array
 */
const topLoser = asyncHandler(async (req, res) => {
  const data = await getTopLoser(urls.topLoserUrl);
  const response = new HttpResponse({ message: "Top loser fetched.", data });
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-share:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top share
 *    responses:
 *      200:
 *        summary: array
 */
const topShare = asyncHandler(async (req, res) => {
  const data = await getTopShare(urls.topShareUrl);
  const response = new HttpResponse({ message: "Top shares fetched.", data });
  res.send(data);
});

/**
 * @openapi
 * /nepse/top-turnover:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top turn overs.
 *    responses:
 *      200:
 *        summary: array
 */
const topTurnOver = asyncHandler(async (req, res) => {
  const data = await getTopTurnOver();
  const response = new HttpResponse({
    message: "Top turnovers fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-transaction:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top transactions.
 *    responses:
 *      200:
 *        summary: array
 */
const topTransaction = asyncHandler(async (req, res) => {
  const data = await getTopTransaction(urls.topTransactionUrl);
  const response = new HttpResponse({
    message: "Top transactions fetched",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/market-summary:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get the market Summary.
 *    responses:
 *      200:
 *        summary: array
 */
const marketSummary = asyncHandler(async (req, res) => {
  const data = await getMarketSummary(urls.marketSummaryUrl);
  const response = new HttpResponse({
    message: "Market Summary fetched",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/indices:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get the current indices.
 *    responses:
 *      200:
 *        summary: array
 */
const indices = asyncHandler(async (req, res) => {
  const data = await getIndices(urls.indicesUrl);
  const response = new HttpResponse({
    message: "Indices fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/subindices:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get the current sub indices.
 *    responses:
 *      200:
 *        summary: array
 */
const subIndices = asyncHandler(async (req, res) => {
  const data = await getSubIndices(urls.indicesUrl);
  const response = new HttpResponse({
    message: "Sub indices fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/floorsheet:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get the floorsheet data.
 *    responses:
 *      200:
 *        summary: array
 */
const floorSheet = asyncHandler(async (req, res) => {
  const data = await getFloorSheet(urls.floorSheetUrl);
  const response = new HttpResponse({
    message: "Floorsheet fetched.",
    data,
  });
  res.send(response);
});

export {
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
};
