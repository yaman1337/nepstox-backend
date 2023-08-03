import {
  getCompanies,
  getCompanyDetails,
  newCompanyDetail,
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
  getForeignExchange,
  getCompanyWiseFloorSheet,
  getGraphData,
  getCompanyGraph,
  getMarketStatus,
  getLatestNews,
  newTopGainer,
  getNewTopLoser,
  getNewTopTurnOver
} from "../../scraper/index.js";

import asyncHandler from "../../utils/asyncHandler.js";
import urls from "../../utils/urls.js";
import HttpResponse from "../../utils/HttpResponse.js";
import { client } from "../../redis/redis.js";
import { getTimeStampOfDate } from "../../utils/time.js";

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

  // cache data
  client.setEx("companies", 3600, JSON.stringify(data));

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
  const data = await newCompanyDetail(symbol);
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
 * /nepse/latest-news:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest news.
 *    parameters:
 *      - in: query
 *        name: payload
 *        schema:
 *          type: string
 *        description: Payload of next news page.
 *    responses:
 *      200:
 *        summary: array
 */
const latestNews = asyncHandler(async (req, res) => {
  console.log(req.query.payload)
  let payload = req.query.payload;
  let data;

  if (!payload) {
    data = await getLatestNews();
  } else {
    data = await getLatestNews(payload);
  }

  const response = new HttpResponse({
    message: "Latest news fetched.",
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
  const marketStatus = {
    advanced: data.filter((item) => Number(item["Point Change"]) > 0).length,
    declined: data.filter((item) => Number(item["Point Change"]) < 0).length,
    unchanged: data.filter((item) => Number(item["Point Change"]) === 0).length,
  };
  const response = new HttpResponse({
    message: "Live trading data fetched.",
    data,
  });

  // cache data
  client.setEx("marketStatus", 3600, JSON.stringify(marketStatus));
  client.setEx("liveTrading", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("topBroker", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("topGainer", 3600, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-gainer/new:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top gainers
 *    responses:
 *      200:
 *        summary: array
 */
const topGainerNew = asyncHandler(async (req, res) => {
  const data = await newTopGainer();
  const response = new HttpResponse({ message: "Top gainer fetched.", data });

  // cache data
  client.setEx("newTopGainer", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("topLoser", 3600, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-loser/new:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top losers.
 *    responses:
 *      200:
 *        summary: array
 */
const newTopLoser = asyncHandler(async (req, res) => {
  const data = await getNewTopLoser();
  const response = new HttpResponse({ message: "Top loser fetched.", data });

  // cache data
  client.setEx("newTopLoser", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("topShare", 3600, JSON.stringify(data));
  res.send(response);
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

  // cache data
  client.setEx("topTurnOver", 3600, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/top-turnover/new:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get latest top turn overs.
 *    responses:
 *      200:
 *        summary: array
 */
const newTopTurnOver = asyncHandler(async (req, res) => {
  const data = await getNewTopTurnOver();
  const response = new HttpResponse({
    message: "Top turnovers fetched.",
    data,
  });

  // cache data
  client.setEx("newTopTurnOver", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("topTransaction", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("marketSummary", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("indices", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("subIndices", 3600, JSON.stringify(data));
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

  // cache data
  client.setEx("floorSheet", 3600, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/floorsheet/{symbol}:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Company wise floorsheet.
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

const companyWiseFloorSheet = asyncHandler(async (req, res) => {
  let symbol = req.params.symbol;

  const data = await getCompanyWiseFloorSheet(symbol);
  const response = new HttpResponse({
    message: "Floorsheet fetched.",
    data,
  });

  // cache data
  client.setEx("companyWiseFloorSheet", 200, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/forex:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get foreign exchange data.
 *    responses:
 *      200:
 *        summary: array
 */
const forex = asyncHandler(async (req, res) => {
  const data = await getForeignExchange();
  const response = new HttpResponse({
    message: "Floorsheet fetched.",
    data,
  });

  // cache data
  client.setEx("forex", 3600, JSON.stringify(data));
  res.send(response);
});

/**
 * @openapi
 * /nepse/graph/{symbol}/{start}/{end}/{resolution}:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get graph data between two intervals.
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
 *        description: Start timestamp
 *      - in: path
 *        name: end
 *        schema:
 *          type: number
 *        description: End timestamp
 *      - in: path
 *        name: resolution
 *        schema:
 *           type: string
 *        description: Resolution of graph
 *    responses:
 *      200:
 *        summary: array
 */
const graphData = asyncHandler(async (req, res) => {
  const { symbol, resolution } = req.params;
  const start = req.params.start;
  const end = req.params.end;

  const data = await getGraphData(resolution, symbol, start, end);
  const response = new HttpResponse({
    message: "Graph fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/graph/company/{symbol}/{start}/{end}/{resolution}/{interval}:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get graph of a company between two intervals.
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
 *        description: Start timestamp
 *      - in: path
 *        name: end
 *        schema:
 *          type: number
 *        description: End timestamp
 *      - in: path
 *        name: resolution
 *        schema:
 *           type: string
 *        description: Resolution of graph
 *      - in: path
 *        name: interval
 *        schema:
 *           type: string
 *        description: Interval of graph
 *    responses:
 *      200:
 *        summary: array
 */
const companyGraph = asyncHandler(async (req, res) => {
  const { symbol, resolution, interval } = req.params;
  const start = req.params.start;
  const end = req.params.end;

  let data = await getCompanyGraph(resolution, symbol, start, end);
  if (interval === "1D") {
    const initialTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      10
    );
    const finalTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      15
    );

    const graphFormatData = data.t.map((item, index) => ({
      x: Number(item),
      y: Number(data?.c[index]),
    }));
    const intervalData = graphFormatData.filter(
      (item) => item.x >= initialTimeStamp && item.x <= finalTimeStamp
    );
    const response = new HttpResponse({
      message: "Graph fetched.",
      data: intervalData,
    });
    res.send(response);
    return;
  } else if (interval === "1W") {
    const initialTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 7
      }`,
      10
    );
    const finalTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      15
    );

    const graphFormatData = data.t.map((item, index) => ({
      x: Number(item),
      y: Number(data?.c[index]),
    }));
    const intervalData = graphFormatData.filter(
      (item) => item.x >= initialTimeStamp && item.x <= finalTimeStamp
    );
    const response = new HttpResponse({
      message: "Graph fetched.",
      data: intervalData,
    });
    res.send(response);
    return;
  } else if (interval === "1M") {
    const initialTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${
        new Date().getDate() - 1
      }`,
      10
    );
    const finalTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      15
    );

    const graphFormatData = data.t.map((item, index) => ({
      x: Number(item),
      y: Number(data?.c[index]),
    }));
    const intervalData = graphFormatData.filter(
      (item) => item.x >= initialTimeStamp && item.x <= finalTimeStamp
    );
    const response = new HttpResponse({
      message: "Graph fetched.",
      data: intervalData,
    });
    res.send(response);
    return;
  } else if (interval === "1Y") {
    const initialTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear() - 1}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      10
    );
    const finalTimeStamp = getTimeStampOfDate(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 1
      }`,
      15
    );

    const graphFormatData = data.t.map((item, index) => ({
      x: Number(item),
      y: Number(data?.c[index]),
    }));
    const intervalData = graphFormatData.filter(
      (item) => item.x >= initialTimeStamp && item.x <= finalTimeStamp
    );
    const response = new HttpResponse({
      message: "Graph fetched.",
      data: intervalData,
    });
    res.send(response);
    return;
  }
  const response = new HttpResponse({
    message: "Graph fetched.",
    data,
  });
  res.send(response);
});

/**
 * @openapi
 * /nepse/market-status:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get advance/decline/unchanged status of market.
 *    responses:
 *      200:
 *        summary: array
 */

const marketStatus = asyncHandler(async (req, res) => {
  const data = await getLiveTradingData(urls.liveTradingUrl);
  const marketStatus = {
    advanced: data.filter((item) => Number(item["Point Change"]) > 0).length,
    declined: data.filter((item) => Number(item["Point Change"]) < 0).length,
    unchanged: data.filter((item) => Number(item["Point Change"]) === 0).length,
  };
  const response = new HttpResponse({
    message: "market status fetched.",
    data: marketStatus,
  });

  // cache data
  client.setEx("marketStatus", 3600, JSON.stringify(marketStatus));
  res.send(response);
});

/**
 * @openapi
 * /nepse/status:
 *  get:
 *    tags:
 *      - Nepse Data
 *    summary: Get nepse market status.
 *    responses:
 *      200:
 *        summary: object
 */
const nepseStatus = asyncHandler(async (req, res) => {
  const data = await getMarketStatus();
  const response = new HttpResponse({
    message: "Nepse status.",
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
  forex,
  companyWiseFloorSheet,
  graphData,
  marketStatus,
  companyGraph,
  nepseStatus,
  latestNews,
  topGainerNew,
  newTopLoser,
  newTopTurnOver
};
