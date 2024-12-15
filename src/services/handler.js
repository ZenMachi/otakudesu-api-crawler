const puppeteer = require("puppeteer");

const fetchUrlEpisode = async (url, episode) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(url);

  const resultList = await page.evaluate(() => {
    const list = document.querySelectorAll(".episodelist ul li");
    const convertedList = Array.from(list).map((item) => {
      const titleEpisode = item.querySelector("a").innerText;
      const linkNext = item.querySelector("a").getAttribute("href");
      return {
        title: titleEpisode,
        url: linkNext,
      };
    });
    return convertedList;
  });

  const resultFiltered = resultList.filter(
    (item) => item.title.includes(episode) && item.url.includes("episode")
  );
  const resultSorted = resultFiltered.sort((min, max) => {
    return (min.title > max.title) - (min.title < max.title);
  });
  console.log("Result: ", resultSorted);
  await browser.close();
  return resultSorted[0];
};

const fetchDetailAnime = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const url = "https://otakudesu.cloud/episode/mfghst-episode-12-sub-indo/";
  const finalResult = {};

  const page = await browser.newPage();
  await page.goto(url);

  const title = "MF Ghost"

  const episodelist = await page.evaluate(() => {
    const episodes = document.querySelectorAll("#selectcog option");
    const arrayEpisodes = Array.from(episodes).map((item) => {
      const episode = item.innerText;
      const url = item.getAttribute("value");
      return {
        episode: episode.toString(),
        url: url,
      };
    });
    return arrayEpisodes;
  });
  const filteredEpisodes = episodelist.filter((item) => !item.url.includes(0));
  const sortedEpisodes = filteredEpisodes.sort().reverse()

  finalResult.title = title
  finalResult.episodes = sortedEpisodes;

  await browser.close();
  console.log("Detail Anime: ", finalResult);
  return finalResult;
};
module.exports = {
  fetchUrlEpisode,
  fetchDetailAnime,
};
