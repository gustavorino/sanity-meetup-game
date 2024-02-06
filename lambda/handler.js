const puppeteer = require("puppeteer");
const { getChrome } = require("./chrome-script");
const fs = require("fs");

module.exports.screenshot = async (event) => {
  return {
    headers: { "Content-Type": "image/png" },
    statusCode: 200,
    body: fs.readFileSync("./screenshot_full.jpg").toString("base64"),
    isBase64Encoded: true,
  };

  let url = "http://localhost:5173/card/";
  if (event?.queryStringParameters?.url) {
    url = event.queryStringParameters.url;
  }
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });
  const page = await browser.newPage({});
  page.setViewport({ width: 2.5 * 400, height: 3.5 * 400 });

  await page.goto(url, { waitUntil: "networkidle2" });

  const content = await page.screenshot({
    path: "screenshot_full.jpg",
    fullPage: false,
  });

  return {
    headers: { "Content-Type": "image/png" },
    statusCode: 200,
    body: content.toString("base64"),
    isBase64Encoded: true,
  };
};
