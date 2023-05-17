import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const url = "https://www.sharesansar.com/today-share-price";

export default async function getTodaySharePrice(url) {
  try {
    let result = [];
    const res = await fetch(url);
    const data = await res.text();

    const { document } = new JSDOM(data).window;

    const headerList = Array.from(
      document.querySelectorAll("#headFixed > thead > tr > th")
    ).map((i) => i.innerHTML.trim());

    const liveTradingDataList = Array.from(
      document.querySelectorAll("#headFixed > tbody > tr")
    ).map((item) =>
      item.textContent.split(/\s*\n\s*/).filter((value) => value !== "")
    );

    liveTradingDataList.map((item) => {
      let tempObj = {};
      item.map((data, i) => {
        tempObj[headerList[i]] = data;
      });

      result.push(tempObj);
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}
