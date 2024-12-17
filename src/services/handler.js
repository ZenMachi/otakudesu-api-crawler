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
  const url = "https://otakudesu.cloud/episode/msmrtyr-episode-12-sub-indo/";
  const finalResult = {};

  const page = await browser.newPage();
  await page.goto(url);

  const title = "Maou-sama, Retry! R";

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

  finalResult.title = title;
  finalResult.episodes = sortedEpisodes;
  finalResult.download = formatGroup;

  await browser.close();
  console.log(finalResult);
  return finalResult;
};

module.exports = {
  fetchUrlEpisode,
  fetchDetailAnime,
};
