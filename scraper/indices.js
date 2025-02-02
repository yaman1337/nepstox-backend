import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const url = "https://www.sharesansar.com/market";

// getIndices(url).then(data => console.log(data))

export default async function getIndices(url) {
  try {
    const res = await fetch(url);
    const htmlString = await res.text();

    const { document } = new JSDOM(htmlString).window;

    const tableElement = document.querySelector("table");

    const headers = Array.from(
      tableElement.querySelectorAll("thead >  tr > th")
    ).map((item) => item.textContent);

    const values = Array.from(
      tableElement.querySelectorAll("tbody > tr > td")
    ).map((item) => item.textContent.trim());

    const date = document.querySelector(
      "body > div:nth-child(4) > div > section.main-content > div:nth-child(3) > div > div:nth-child(3) > div.col-md-5 > div > div.col-md-12 > p > span"
    ).textContent;

    const finalData = {};

    const tempArr = [];

    let j = 0;

    for (let i = 0; i < values.length; i += 4) {
      const tempObj = {};
      tempObj[headers[j]] = values[i];
      tempObj[headers[j + 1]] = values[i + 1];
      tempObj[headers[j + 2]] = values[i + 2];
      tempObj[headers[j + 3]] = values[i + 3];

      tempArr.push(tempObj);
    }

    finalData["date_of"] = date;
    finalData["data"] = tempArr;

    return finalData;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching indices.");
  }
}

export async function getLiveData() {
  try {
    const url = "https://sarallagani.xyz/api/market_data/home_live";
    const headers = {
      Permission: "2021D@T@f@RSt6&%2-D@T@",
    };
    const options = {
      headers,
    };

    const res = await fetch(url, options);

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching indices.");
  }
}
