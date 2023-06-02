import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import getCompanies from "./getCompanies.js";
import urls from "../utils/urls.js";
import { FormData, Request } from "node-fetch";
import getTextFromHtml from "../utils/getTextFromHtml.js";

// getCompanyNews("nmb").then((data) => console.log(data));

export default async function getCompanyNews({
  symbol,
  start = 0,
  length = 10,
}) {
  try {
    const companies = await getCompanies(urls.getCompaniesUrl);

    let companyId;

    for (let i = 0; i < companies.length; i++) {
      if (companies[i].symbol.toLowerCase() === symbol.toLowerCase()) {
        companyId = companies[i].id;
      }
    }

    const data = {
      draw: 1,
      "columns[0][data]": "published_date",
      "columns[0][name]": "",
      "columns[0][searchable]": true,
      "columns[0][orderable]": false,
      "columns[0][search][value]": "",
      "columns[0][search][regex]": false,
      "columns[1][data]": "title",
      "columns[1][name]": "",
      "columns[1][searchable]": true,
      "columns[1][orderable]": false,
      "columns[1][search][value]": "",
      "columns[1][search][regex]": false,
      start: start,
      length: length,
      "search[value]": "",
      "search[regex]": false,
      company: companyId,
    };

    const form = new FormData();

    // Append each key-value pair to the form
    Object.keys(data).forEach((key) => {
      form.append(key, data[key]);
    });

    // Create an empty cookie jar object
    let cookieJar = "";

    // Function to save cookies from a response
    function saveCookiesFromResponse(response) {
      const cookies = response.headers.get("Set-Cookie");
      if (cookies) {
        let tempArr = cookies.split("path=/;");
        cookieJar =
          tempArr[0].split("path=/,")[0].split("expires")[0].trim() +
          tempArr[0].split("path=/,")[1].trim();
      }
    }

    // Function to add cookies to a request
    function addCookiesToRequest(url, options = {}) {
      options["headers"]["Cookie"] = cookieJar;

      return new Request(url, { ...options });
    }

    const htmlRes = await fetch(
      "https://www.sharesansar.com/company/" + symbol
    );

    saveCookiesFromResponse(htmlRes);

    const { document } = new JSDOM(await htmlRes.text()).window;
    const csrf_token = document
      .querySelector("head > meta:nth-child(32)")
      .getAttribute("content");

    const options = {
      method: "POST",
      body: form,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        // "Content-type": "multipart/form-data;",
        "X-Csrf-Token": csrf_token,
      },
    };

    const nextRequest = addCookiesToRequest(
      "https://www.sharesansar.com/company-news",
      options
    );

    // Make the Fetch API POST request
    const res = await fetch(nextRequest);

    const finalData = await res.json();

    for (let i = 0; i < finalData.data.length; i++) {
      let formattedTitle = getTextFromHtml(finalData.data[i].title);
      finalData.data[i].title = formattedTitle;
    }

    return finalData;
  } catch (error) {
    console.log(error);
  }
}
