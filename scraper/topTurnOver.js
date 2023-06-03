import fetch, { Headers } from "node-fetch";
import getTextFromHtml from "../utils/getTextFromHtml.js";

// getTopTurnOver().then((data) => console.log(data));

export default async function getTopTurnOver() {
  try {
    var myHeaders = new Headers();
    myHeaders.append("X-Requested-With", "XMLHttpRequest");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      "https://www.sharesansar.com/top-turnovers?draw=2&columns%5B0%5D%5Bdata%5D=DT_Row_Index&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=symbol&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=companyname&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=false&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=traded_amount&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=false&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=close&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=false&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false",
      requestOptions
    );

    const rawData = await res.json();

    for (let i = 0; i < rawData.data.length; i++) {
      let formattedCompanyname = getTextFromHtml(rawData.data[i].companyname);
      let formattedSymbol = getTextFromHtml(rawData.data[i].symbol);
      rawData.data[i].companyname = formattedCompanyname;
      rawData.data[i].symbol = formattedSymbol;
    }
    return rawData;
  } catch (error) {
    console.log(error);
  }
}
