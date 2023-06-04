import fetch from "node-fetch";
import { JSDOM } from "jsdom";

// getForeignExchange().then(data => console.log(data))

export default async function getForeignExchange() {
  try {
    const res = await fetch("https://www.nrb.org.np/forex/");
    const htmlData = await res.text();

    const { document } = new JSDOM(htmlData).window;

    let finalData = [];

    let tableElement = document.querySelector(
      "#content > div > div > div > div.col-lg-10.col-md-12.mb-2 > div.card-bt.card-bt--nrb.mt-3.mb-3 > div:nth-child(5) > div.card-layout > div > table"
    );

    let headers = Array.from(
      tableElement.querySelectorAll("thead > tr > th")
    ).map((item) => item.textContent.trim());

    const forexData = Array.from(
      tableElement.querySelectorAll("tbody > tr > td")
    ).map((item) => item.textContent.trim());

    const indianForexData = Array.from(
      document.querySelectorAll(
        "#content > div > div > div > div.col-lg-10.col-md-12.mb-2 > div.card-bt.card-bt--nrb.mt-3.mb-3 > div:nth-child(4) > div.card-layout > div > table > tbody > tr > td"
      )
    ).map((item) => item.textContent.trim());

    // append indian forex data at begining of final data array
    let obj = {};
    obj[headers[0]] = indianForexData[0];
    obj[headers[1]] = indianForexData[1];
    obj[headers[2]] = indianForexData[2];
    obj[headers[3]] = indianForexData[3];
    finalData.push(obj);

    let j = 0;
    for (let i = 0; i < forexData.length; i += 4) {
      let tempObj = {};
      tempObj[headers[j]] = forexData[i];
      tempObj[headers[j + 1]] = forexData[i + 1];
      tempObj[headers[j + 2]] = forexData[i + 2];
      tempObj[headers[j + 3]] = forexData[i + 3];

      finalData.push(tempObj);
    }

    return finalData;
  } catch (error) {
    console.log(error);
  }
}
