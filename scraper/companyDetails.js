import fetch from "node-fetch";
import { JSDOM } from "jsdom";

// companyDetails("nmb")

export default async function companyDetails(symbol) {
  try {
    const res = await fetch("https://www.sharesansar.com/company/" + symbol);
    const data = await res.text();

    const { document } = new JSDOM(data).window;

    let companyName = document.querySelector(
      "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(1) > div > h1"
    ).textContent;

    return companyName;
  } catch (error) {
    console.log(error);
  }
}
