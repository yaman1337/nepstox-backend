import fetch from "node-fetch";
import asyncHandler from "../../utils/asyncHandler.js";
import HttpResponse from "../../utils/HttpResponse.js";

const getIPOCompanies = asyncHandler(async (req, res) => {
  const url =
    "https://globalimecapital.com/api/share-allotment-check/getCompanies";

  const fetchRes = await fetch(url);
  const data = await fetchRes.json();

  const response = new HttpResponse({
    message: "IPO companies fetched.",
    data,
  });

  res.send(response);
});

const BulkIPOChecker = asyncHandler(async (req, res) => {
  const url = "https://globalimecapital.com/api/share-allotment-check";
  const { data, company_id } = req.body;

  if (!data || !company_id)
    return res.send(
      new HttpResponse({
        message: "Invalid parameters.",
        statusCode: 400,
        success: false,
        data: null,
      })
    );

  const arrayOfPromises = [];

  data.forEach((item) => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ boid: item.boid, company_id }),
    };
    arrayOfPromises.push(fetch(url, options));
  });

  const arrayOfResponsePromise = await Promise.all(arrayOfPromises);
  const arrayOfData = await Promise.all(
    arrayOfResponsePromise.map((item) => item.json())
  );

  const finalData = arrayOfData.map((item, idx) => {
    return { ...item, username: data[idx].username };
  });

  res.send(
    new HttpResponse({ message: "Bulk result success.", data: finalData })
  );
});

export { getIPOCompanies, BulkIPOChecker };
