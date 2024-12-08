const puppeteer = require("puppeteer");

const getOngoing = async (pageNumber) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });

  const url = `https://otakudesu.cloud/ongoing-anime/page/${pageNumber}/`;

  const page = await browser.newPage();
  await page.goto(url);

  const finalItems = [];

  const results = await page.evaluate(() => {
    const items = document.querySelectorAll(".detpost");

    const animeItems = Array.from(items).map((item) => {
      const title = item.querySelector(".jdlflm").innerText;
      const episode = item.querySelector(".epz").innerText.trim();
      const imgUrl = item.querySelector(".thumbz img").getAttribute("src");

      return {
        title: title,
        episode: episode,
        imgUrl: imgUrl,
      };
    });

    return animeItems;
  });

  finalItems.push(...results);
  console.log("logItems", finalItems);
  return finalItems;
};

getOngoing(4);
