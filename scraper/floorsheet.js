import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const url = "https://merolagani.com/Floorsheet.aspx";

export default async function getFloorSheet(url) {
  try {
    const res = await fetch(url);
    const htmlData = await res.text();

    const { document } = new JSDOM(htmlData).window;

    const tableElement = document.querySelector(
      "#ctl00_ContentPlaceHolder1_divData > div.table-responsive > table"
    );

    let headers = Array.from(
      tableElement.querySelectorAll("thead > tr > th")
    ).map((item) => item.textContent.trim());

    headers[0] = "id";

    const values = Array.from(
      tableElement.querySelectorAll("tbody > tr > td")
    ).map((item) => item.textContent.trim());

    const date = document.querySelector(
      "#ctl00_ContentPlaceHolder1_marketDate"
    ).value;
    const totalQuantity = document.querySelector(
      "#ctl00_ContentPlaceHolder1_totalQty"
    ).value;

    const averageRate = document.querySelector(
      "#ctl00_ContentPlaceHolder1_averageRate"
    ).value;

    let finalData = {};
    let tempArr = [];

    let j = 0;
    for (let i = 0; i < values.length; i += 8) {
      let tempObj = {};
      tempObj[headers[j]] = values[i];
      tempObj[headers[j + 1]] = values[i + 1];
      tempObj[headers[j + 2]] = values[i + 2];
      tempObj[headers[j + 3]] = values[i + 3];
      tempObj[headers[j + 4]] = values[i + 4];
      tempObj[headers[j + 5]] = values[i + 5];
      tempObj[headers[j + 6]] = values[i + 6];
      tempObj[headers[j + 7]] = values[i + 7];
      tempArr.push(tempObj);
    }

    finalData["date"] = date;
    finalData["totalQuantity"] = totalQuantity;
    finalData["averageRate"] = averageRate;
    finalData["totalRecords"] = tempArr.length;
    finalData["data"] = tempArr;

    return finalData;
  } catch (error) {
    console.log(error);
  }
}
