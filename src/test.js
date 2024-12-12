const puppeteer = require("puppeteer");
const { fetchUrlEpisode } = require("./services/handler");

const fetchOngoingAnime = async (pageNumber) => {
  const finalItems = [];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const url = `https://otakudesu.cloud/ongoing-anime/page/${pageNumber}/`;

  const page = await browser.newPage();
  await page.goto(url);

  const urlNow = await page.url();
  const pageNow = await page.evaluate(() => {
    const currentPage = document.querySelector(
      "span.page-numbers.current"
    ).innerText;
    return parseInt(currentPage);
  });
  const maxPage = await page.evaluate(() => {
    const max = document.querySelectorAll(
      ".page-numbers:not(.next):not(.prev)"
    ).length;
    return parseInt(max);
  });
  const isNext = await page.evaluate(() =>
    document.querySelector(".next") !== null ? true : false
  );
  const isPrev = await page.evaluate(() =>
    document.querySelector(".prev") !== null ? true : false
  );

  const results = await page.evaluate(() => {
    const items = document.querySelectorAll(".detpost");

    const animeItems = Array.from(items).map((item) => {
      const title = item.querySelector(".jdlflm").innerText;
      const episode = item.querySelector(".epz").innerText.trim();
      const imgUrl = item.querySelector(".thumbz img").getAttribute("src");
      const detailUrl = item.querySelector(".thumb a").getAttribute("href");

      return {
        title: title,
        episode: episode,
        img_url: imgUrl,
        detail_url: detailUrl,
      };
    });

    return animeItems;
  });

  finalItems.push(...results);

  // await page.waitFor(2000);

  const object = {
    url_now: urlNow,
    page: pageNow,
    max_page: maxPage,
    prev: isPrev,
    next: isNext,
    results: finalItems,
  };
  await browser.close();
  console.log("Result : ", object);
  return object;
};

// getDetailEpisode("Episode 2");
fetchOngoingAnime(1).then(async (result) => {
  const itemPop = result.results.pop();
  const url = itemPop.detail_url;
  const episode = itemPop.episode;

  const urlResult = await fetchUrlEpisode(url, episode);
  console.log("Title", urlResult.title);
  console.log("URL", urlResult.url);
});

// getOngoingAnime(1);
