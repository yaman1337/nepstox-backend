import fetch from "node-fetch"
import  { JSDOM } from "jsdom"

const url = "https://www.sharesansar.com/today-share-price"
    

export default async function getCompanies(url) {
    try {
       const res = await fetch(url)
       const data = await res.text()
       const { document } =  new JSDOM(data).window;
       
      const parsedData =  document.querySelector("body > div:nth-child(3) > div > script:nth-child(1)").textContent.split("=")
        return JSON.parse(parsedData[1].split(";")[0])
    } catch (error) {
        console.log(error)
    }
}
