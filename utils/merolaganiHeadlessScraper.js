import puppeteer from "puppeteer";

async function scrapeWebsite(url) {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the website to load and render content
    await page.waitForSelector(
      "#ctl00_ContentPlaceHolder1_tblSummary > tbody > tr:nth-child(1) > th:nth-child(1)"
    );

    // Now you can run your scraping logic using page.evaluate()
    const scrapedData = await page.evaluate(() => {
      const headers = Array.from(
        document.querySelectorAll(
          "#ctl00_ContentPlaceHolder1_tblSummary > tbody > tr:nth-child(1) > th"
        )
      ).map((item) => item.textContent.trim());

      // grab all table rows
      const allData = Array.from(
        document.querySelectorAll(
          "#ctl00_ContentPlaceHolder1_tblSummary > tbody > tr"
        )
      );

      // remove the first element as it is the headers
      allData.shift();

      let finalObj = [];

      for (let i = 0; i < allData.length; i++) {
        let tableTD = Array.from(allData[i].querySelectorAll("td")).map(
          (item) => item.textContent.trim()
        );

        let tempObj = {};
        tempObj[headers[0]] = tableTD[0];
        tempObj[headers[1]] = tableTD[1];
        tempObj[headers[2]] = tableTD[2];
        tempObj[headers[3]] = tableTD[3];
        tempObj[headers[4]] = tableTD[4];
        tempObj[headers[5]] = tableTD[5];
        tempObj[headers[6]] = tableTD[6];
        tempObj[headers[7]] = tableTD[7];

        finalObj.push(tempObj);
      }

      return finalObj;
    });

    await browser.close();
    return scrapedData;
  } catch (err) {
    console.error("Error while scraping:", err);
    throw new Error(err.message);
  }
}

export default scrapeWebsite;
