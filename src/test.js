const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { createLocaleDateTime } = require("./utils/utils");

const fetchOngoingAnime = async (pageNumber) => {
  const finalResult = {};

  const url = `https://otakudesu.cloud/ongoing-anime/page/${pageNumber}/`;
  const $ = await cheerio.fromURL(url);

  const currentPage = $("span.page-numbers.current").text();
  const intCurrentPage = parseInt(currentPage);
  const maxPage = $(".page-numbers:not(.next):not(.prev)").length;
  const intMaxPage = parseInt(maxPage);

  const isNext = $(".next").length === 1 ? true : false;
  const isPrev = $(".prev").length === 1 ? true : false;

  const results = $(".detpost")
    .map((i, item) => {
      const title = $(".jdlflm", item).text();
      const strEpisode = $(".epz", item).text().trim();
      const episode = parseInt(strEpisode.split(" ")[1]);
      const imgUrl = $(".thumbz img[src]", item).attr("src");
      const detailUrl = $(".thumb a", item).attr("href");

      return {
        title: title,
        episode: episode,
        img_url: imgUrl,
        detail_url: detailUrl,
      };
    })
    .get();

  finalResult.page = intCurrentPage;
  finalResult.max_page = intMaxPage;
  finalResult.prev = isPrev;
  finalResult.next = isNext;
  finalResult.results = results;

  console.log(finalResult);
  console.info(`Ongoing Anime Scrapped at ${createLocaleDateTime()}`);
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

const testCheerio = async (pageNumber) => {};

fetchOngoingAnime(1);
