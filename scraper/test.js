import fetch from "node-fetch";
import getCompanies from "./getCompanies.js";
import companyDetails from "./companyDetails.js";

(async () => {
  let companies = await getCompanies(
    "https://www.sharesansar.com/today-share-price"
  );
  let i = 0;

  test();

  async function test() {
   await companyDetails(companies[i].symbol.toLowerCase());
    i += 1;
    test();
  }
})();
