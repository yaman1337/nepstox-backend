import fetch from "node-fetch";
import { JSDOM } from "jsdom";

getLatestNews();

export default async function getLatestNews(payload = undefined) {
  try {
    let url;
    if (payload == undefined) {
      url = `https://www.sharesansar.com/category/latest`;
    } else {
      url = `https://www.sharesansar.com/category/latest?cursor=${payload}`;
    }

    const res = await fetch(url);

    const htmlData = await res.text();

    const { document } = new JSDOM(htmlData).window;

    const nextPayload = document
      .querySelector(
        "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div > div.col-md-12 > div.newslist > ul > li:nth-child(2) > a"
      )
      .getAttribute("href")
      .split("=")[1];

    const newsDiv = document.querySelectorAll(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div > div.col-md-12 > div.newslist > div"
    );

    let allNews = [];
    let finalObj = {};

    newsDiv.forEach((div) => {
      let tempObj = {};

      tempObj["imageUrl"] = div
        .querySelector("div > a > img")
        .getAttribute("src");
      tempObj["title"] = div.querySelector("div > a > h4").textContent;
      tempObj["date"] = div.querySelector("div > p > span").textContent;
      tempObj["url"] = div.querySelector("div > a").getAttribute("href");

      allNews.push(tempObj);
    });

    finalObj["data"] = allNews;
    finalObj["nextPayload"] = nextPayload;

    return finalObj;
  } catch (error) {
    console.log(error);
  }
}
