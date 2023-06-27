import fetch from "node-fetch";

/**
 *
 * @param {*} symbol Indices symbol like NEPSE, FLOAT, BANKING, etc. Company Symbols like NMB , NABIL, etc.
 * @param {*} start
 * @param {*} end
 * @description Fetch the graph data of Nepse.
 */
export default async function getCompanyGraph(
  resolution = "1",
  symbol,
  start,
  end
) {
  // https://nepsealpha.com/trading/1/history?symbol=UNLB&resolution=1&from=1687705970&to=1687743704&pass=ok&force=26140&currencyCode=NRS
  try {
    console.log({ symbol, start, end });
    let url = `https://nepsealpha.com/trading/1/history?symbol=${symbol.toUpperCase()}&resolution=${resolution}&from=${start}&to=${end}&pass=ok&force=26140&currencyCode=NRS`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
