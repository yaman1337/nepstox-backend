import fetch from "node-fetch";

/**
 *
 * @param {*} symbol Indices symbol like NEPSE, FLOAT, BANKING, etc. Company Symbols like NMB , NABIL, etc.
 * @param {*} start
 * @param {*} end
 * @description Fetch the graph data of Nepse.
 */
export default async function getGraphData(
  symbol,
  start,
  end,
  resolution = "1D"
) {
  try {
    console.log({ symbol, start, end, resolution });

    // let url = `https://nepsealpha.com/trading/1/history?symbol=${symbol.toUpperCase()}&resolution=${resolution}&from=${start}&to=${end}&pass=ok`;

    let url = `https://merolagani.com/handlers/TechnicalChartHandler.ashx?type=get_advanced_chart&symbol=${symbol.toUpperCase()}&resolution=${resolution}&rangeStartDate=${start}&rangeEndDate=${end}&from=&isAdjust=1&currencyCode=NPR`;

    console.log(url);
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching graph data.");
  }
}
