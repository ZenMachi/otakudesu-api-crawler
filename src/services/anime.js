const puppeteer = require("puppeteer");
const { createLocaleDateTime } = require("../utils/utils");

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
      const strEpisode = item.querySelector(".epz").innerText.trim();
      const episode = parseInt(strEpisode.split(" ")[1]);
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
  console.log(`Ongoing Anime Scrapped at ${createLocaleDateTime()}`);
  return object;
};

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
    (item) =>
      item.title.includes(`Episode ${episode}`) && item.url.includes("episode")
  );
  const resultSorted = resultFiltered.sort((min, max) => {
    return (min.title > max.title) - (min.title < max.title);
  });
  console.log(`Detail url Scrapped ${createLocaleDateTime()}`);
  await browser.close();
  return resultSorted[0];
};

const fetchDetailAnime = async (url) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const finalResult = {};

  const page = await browser.newPage();
  await page.goto(url);

  const titleEpisode = await page.evaluate(() => {
    const title = document.querySelector(".posttl").innerText;
    return title;
  });

  const episodelist = await page.evaluate(() => {
    const episodes = document.querySelectorAll("#selectcog option");
    const arrayEpisodes = Array.from(episodes).map((item) => {
      const episode = item.innerText;
      const episodeCount = episode.split(" ")[1];
      const url = item.getAttribute("value");
      return {
        episode: parseInt(episodeCount),
        url: url,
      };
    });
    return arrayEpisodes;
  });

  const qualityList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll(".download ul li");
    const arrayList = Array.from(nodeList).map((item) => {
      const formatQuality = item.querySelector("strong").innerText;
      const size = item.querySelector("i").innerText;
      const nodeListLink = item.querySelectorAll("a");
      const links = Array.from(nodeListLink).map((link) => {
        const providerName = link.innerText;
        const url = link.getAttribute("href");
        return {
          provider: providerName.trim(),
          url,
        };
      });
      return {
        format: formatQuality,
        size,
        links,
      };
    });
    return arrayList;
  });

  const filteredEpisodes = episodelist.filter((item) => !item.url.includes(0));
  const sortedEpisodes = filteredEpisodes.sort().reverse();

  const formatGroup = qualityList.reduce((acc, item) => {
    const [type, resolution] = item.format.toUpperCase().split(" ");
    const entry = acc.find((e) => e.format === type);

    const details = {
      resolution,
      size: parseFloat(item.size.split(" ")[0]),
      links: item.links,
    };

    if (entry) {
      entry.details.push(details);
    } else {
      acc.push({
        format: type,
        details: [details],
      });
    }

    return acc;
  }, []);

  finalResult.title_episode = titleEpisode;
  finalResult.episodes = sortedEpisodes;
  finalResult.download = formatGroup;

  await browser.close();
  console.log(`Detail Episode Scrapped at ${createLocaleDateTime()}`);
  return finalResult;
};

module.exports = {
  fetchUrlEpisode,
  fetchDetailAnime,
  fetchOngoingAnime,
};
