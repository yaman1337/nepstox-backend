import fetch from "node-fetch";
import { JSDOM } from "jsdom";

// getMarketStatus().then((status) => console.log(status));

let status = {
  open: "Market Open",
  close: "Market Close",
};

export default async function getMarketStatus() {
  try {
    const res = await fetch("https://www.sharesansar.com/live-trading");

    const htmlData = await res.text();

    const { document } = new JSDOM(htmlData).window;

    let currentStatus = document
      .querySelector("#menu > li:nth-child(1)")
      .textContent.trim();

    let open;

    if (status.open === currentStatus) {
      open = true;
    } else {
      open = false;
    }

    return { marketOpen: open };
  } catch (error) {
    console.log(error);
  }
}
