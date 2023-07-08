import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default async function getBrokerDetails() {
  try {
    const res = await fetch("https://merolagani.com/BrokerList.aspx");
    const htmlData = await res.text();

    const { document } = new JSDOM(htmlData).window;

    const tableElement = document.querySelector(
      "#ctl00_ContentPlaceHolder1_divData > div > table"
    );

    const borderCodeArray = Array.from(
      tableElement.querySelectorAll("tbody > tr > td:nth-child(1)")
    ).map((item) => item.textContent.trim());

    const phoneNumberArray = Array.from(
      tableElement.querySelectorAll("tbody > tr > td:nth-child(3)")
    ).map((item) =>
      item.textContent.trim().split(",").length >= 2
        ? item.textContent.trim().split(",")[0]
        : item.textContent.trim()
    );

    let finalData = {};

    for (let i = 0; i < borderCodeArray.length; i++) {
      finalData[borderCodeArray[i]] = phoneNumberArray[i];
    }

    return finalData;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching broker details.")
  }
}
