import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const url = "https://www.sharesansar.com/market";

// getIndices(url).then(data => console.log(data))

export default async function getSubIndices(url) {
  try {
    const res = await fetch(url);
    const htmlString = await res.text();

    const { document } = new JSDOM(htmlString).window;

    const tableElement = document.querySelector("body > div:nth-child(4) > div > section.main-content > div:nth-child(3) > div > div:nth-child(5) > div.col-md-5 > div > div.col-md-12 > div.table-responsive > table")

    const headers = Array.from(
      tableElement.querySelectorAll("thead >  tr > th")
    ).map((item) => item.textContent);

    const values = Array.from(
      tableElement.querySelectorAll("tbody > tr > td")
    ).map((item) => item.textContent.trim());

    const date = document.querySelector("body > div:nth-child(4) > div > section.main-content > div:nth-child(3) > div > div:nth-child(5) > div.col-md-5 > div > div.col-md-12 > p > span").textContent

    const finalData = {};

    const tempArr = [];

    let j = 0;

    for (let i = 0; i < values.length; i += 5) {
      const tempObj = {};
      tempObj[headers[j]] = values[i];
      tempObj[headers[j + 1]] = values[i + 1];
      tempObj[headers[j + 2]] = values[i + 2];
      tempObj[headers[j + 3]] = values[i + 3];
      tempObj[headers[j + 4]] = values[i + 4];

      tempArr.push(tempObj);
    }

    finalData["date_of"] = date;
    finalData["data"] = tempArr;

    return finalData;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching subindides.")
  }
}
