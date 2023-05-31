import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import getTodaySharePrice from "./todaySharePrice.js";
import urls from "../utils/urls.js";

// companyDetails("aclbsl");

export default async function getCompanyDetails(symbol) {
  try {
    const res = await fetch("https://www.sharesansar.com/company/" + symbol);
    const data = await res.text();

    let companyInfo;
    let todaySharePrice;
    let latestDividend = {};
    let pivotAnalysis = {};
    let movingAnalysis = [];

    const { document } = new JSDOM(data).window;

    // scrape company info
    let companyName = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(1) > div > h1"
    ).textContent;

    let sector = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-5.col-sm-5.col-xs-12 > div > div.col-md-12 > h4:nth-child(2) > span"
    ).textContent;

    let registrar = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-5.col-sm-5.col-xs-12 > div > div.col-md-12 > h4:nth-child(3) > span"
    ).textContent;

    companyInfo = {
      companyName,
      sector,
      registrar,
      symbol: symbol.toUpperCase(),
    };

    // scrape today share price
    let allTodaySharePrice = await getTodaySharePrice(urls.todaySharePriceUrl);
    todaySharePrice = allTodaySharePrice.filter(
      (item) => item["Symbol"].toLowerCase() === symbol.toLowerCase()
    );

    // scrapte latestDividend
    const latestDividendTable = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(3) > div.col-md-5.col-sm-5.col-xs-12 > div > div.col-md-12 > div:nth-child(2) > table"
    );

    Array.from(latestDividendTable.querySelectorAll("tbody > tr")).map(
      (item) => {
        let tempArr = item.textContent.trim().split("\n");
        let tempHeader = tempArr[0].trim();
        let tempVal = tempArr[1].trim();
        latestDividend[tempHeader] = tempVal;
      }
    );

    // scrape pivot analysis
    const pivotAnalysisTable = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(3) > div.col-md-7.col-sm-7.col-xs-12 > div > div:nth-child(1) > div > table"
    );

    Array.from(pivotAnalysisTable.querySelectorAll("tbody > tr")).map(
      (item) => {
        let tempArr = item.textContent.trim().split("\n");
        let tempHeader = tempArr[0].trim();
        let tempVal = tempArr[1].trim();
        pivotAnalysis[tempHeader] = tempVal;
      }
    );

    // scrape moving analysis
    const movingAnalysisTable = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(3) > div.col-md-7.col-sm-7.col-xs-12 > div > div:nth-child(2) > div > table"
    );

    Array.from(movingAnalysisTable.querySelectorAll("tbody > tr")).map(
      (item) => {
        let tempArr = item.textContent.trim().split("\n");
        let tempHeader = tempArr[0].trim();
        let tempVal = tempArr[1].trim();
        let tempObj = {};
        tempObj[tempHeader] = tempVal;
        movingAnalysis.push(tempObj);
      }
    );

    let finalData = {};
    finalData["companyInfo"] = companyInfo;
    finalData["todaySharePrice"] = todaySharePrice;
    finalData["latestDividend"] = latestDividend;
    finalData["pivotAnalysis"] = pivotAnalysis;
    finalData["movingAnalysis"] = movingAnalysis;

    return finalData;
  } catch (error) {
    console.log(error);
  }
}
