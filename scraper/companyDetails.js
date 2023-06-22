import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import getTodaySharePrice from "./todaySharePrice.js";
import urls from "../utils/urls.js";

// companyDetails("aclbsl");

// newCompanyDetail("cfl");

//  scraped from old source
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

// scraped from new source
export async function newCompanyDetail(symbol) {
  try {
    symbol = symbol.toLowerCase();

    const url = `https://merolagani.com/CompanyDetail.aspx?symbol=${symbol}`;
    let status = 429;
    let res;

    while (status != 200) {
      res = await fetch(url);
      status = res.status;
    }

    const htmlData = await res.text();
    const { document } = new JSDOM(htmlData).window;

    const tableElement = document.querySelector("#accordion");

    const dividendTable = document.querySelector(
      "#dividend-panel > td > table"
    );

    const bonusTable = document.querySelector("#bonus-panel > td > table");

    const rightShareTable = document.querySelector("#right-panel > td > table");

    const headers = Array.from(tableElement.querySelectorAll("tr > th")).map(
      (item) => item.textContent.trim()
    );

    const values = Array.from(tableElement.querySelectorAll("tr > td")).map(
      (item) => {
        let hasMultiple = item.textContent.trim().includes("\n");
        if (!hasMultiple) {
          return item.textContent.trim();
        }

        let newString = "";

        let tempArr = item.textContent.trim().split("\n");

        newString = tempArr[0].trim() + " " + tempArr[2].trim();
        return newString;
      }
    );

    headers.splice(13, 12);
    values.splice(13, values.length - 15);

    let finalObj = {};

    finalObj["Company Name"] = document
      .querySelector("#ctl00_ContentPlaceHolder1_CompanyDetail1_companyName")
      .textContent.trim();

    headers.forEach((item, idx) => {
      finalObj[item] = values[idx];
    });

    const secondaryTableHeaders = ["id", "Value", "Fiscal Year"];

    const valuesArray = [dividendTable, bonusTable, rightShareTable].map(
      (item) => {
        const eachArr = Array.from(
          item.querySelectorAll("tbody > tr > td")
        ).map((item) => {
          return item.textContent.trim();
        });

        return eachArr;
      }
    );

    const dividend = [];
    const bonus = [];
    const rightShare = [];

    const finalSecondaryDataArray = [dividend, bonus, rightShare];

    let j = 0;
    for (let _ = 0; _ < valuesArray.length; _++) {
      for (let i = 0; i < valuesArray[_].length; i += 3) {
        let tempObj = {};
        tempObj[secondaryTableHeaders[j]] = valuesArray[_][i];
        tempObj[secondaryTableHeaders[j + 1]] = valuesArray[_][i + 1];
        tempObj[secondaryTableHeaders[j + 2]] = valuesArray[_][i + 2];
        finalSecondaryDataArray[_].push(tempObj);
      }
    }

    finalObj["Dividend"] = dividend;
    finalObj["Bonus"] = bonus;
    finalObj["Right Share"] = rightShare;

    return finalObj;
  } catch (error) {
    console.log(error);
  }
}
