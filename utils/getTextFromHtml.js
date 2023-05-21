import { JSDOM } from "jsdom";

export default function getTextFromHtml(rawStr) {
  const { document } = new JSDOM(rawStr).window;
  return document.querySelector("a").textContent;
}
