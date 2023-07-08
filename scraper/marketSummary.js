import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const url = "https://www.sharesansar.com/market-summary";

// getMarketSummary(url).then((data) => console.log(data));

export default async function getMarketSummary(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const data = await res.text();

    const { document } = new JSDOM(data).window;

    const rawData = Array.from(
      document.querySelectorAll("tbody > tr > td")
    ).map((item) => {
      return item.textContent;
    });

    let finalData = {};

    for (let i = 0; i < rawData.length; i += 2) {
      finalData[rawData[i]] = rawData[i + 1];
    }

    return finalData;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching market summary.")
  }
}
