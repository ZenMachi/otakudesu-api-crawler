const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const { fetchDetailAnime } = require("./services/handler");

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ssgoogle", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const url = "http://digidb.io/digimon-list/";

    const page = await browser.newPage();
    await page.goto(url);

    // Targeting the DOM Nodes that contain the Digimon names
    const digimonNames = await page.$$eval(
      "#digiList tbody tr td:nth-child(2) a",
      function (digimons) {
        // Mapping each Digimon name to an array
        return digimons.map(function (digimon) {
          return digimon.innerText;
        });
      }
    );

    console.log(digimonNames);

    const image = await page.screenshot({
      fullPage: true,
      path: "./screenshots/screenshot.png",
    });

    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (e) {
    console.log(e);
  }
});

app.get("/otakudesu", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const url = "https://otakudesu.cloud/ongoing-anime/";

    const page = await browser.newPage();
    await page.goto(url);

    // Targeting the DOM Nodes that contain the Digimon names
    const selector =
      "#venkonten .vezone .venser .venutama .rseries .rapi .venz ul li";
    const digimonNames = await page.$$eval(selector, (results) =>
      results.map((result) => ({
        title: result.querySelector(".jdlflm").innerText,
        episode: result.querySelector(".epz").innerText.trim(),
        image: result.querySelector(".thumbz img").getAttribute("src"),
      }))
    );

    console.log(digimonNames);

    const image = await page.screenshot({
      fullPage: true,
      path: "screenshot2.png",
    });

    await browser.close();
    // res.set("Content-Type", "image/png");
    res.send(digimonNames);
  } catch (e) {
    console.log(e);
  }
});
app.get("/otakudesu2", async (req, res) => {
  try {
    const detail = await fetchDetailAnime();
    res.json(detail);
  } catch (e) {
    console.log(e);
  }
});

let server = app.listen(PORT, () => {
  console.log(`Running on port: ${server.address().port}`);
});
