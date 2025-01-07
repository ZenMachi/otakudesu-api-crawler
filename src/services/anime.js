const cheerio = require("cheerio");
const { createLocaleDateTime } = require("../utils/utils");

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

  console.info(`Ongoing Anime Scrapped at ${createLocaleDateTime()}`);

  return finalResult;
};

const fetchUrlEpisode = async (url, episode) => {
  // const exampleUrl = "https://otakudesu.cloud/anime/ao-hako-sub-indo/";
  // const exampleEpisode = 2;

  const $ = await cheerio.fromURL(url);

  const resultList = $(".episodelist ul li")
    .map((i, item) => {
      const titleEpisode = $("a", item).text();
      const url = $("a", item).attr("href");
      return {
        title: titleEpisode,
        url,
      };
    })
    .get();

  const resultFiltered = resultList.filter(
    (item) =>
      item.title.includes(`Episode ${episode}`) && item.url.includes("episode")
  );
  const resultSorted = resultFiltered.sort((min, max) => {
    return (min.title > max.title) - (min.title < max.title);
  });
  console.log(`Detail url Scrapped ${createLocaleDateTime()}`);

  return resultSorted[0];
};

const fetchDetailAnime = async (url) => {
  // const exampleUrl = "https://otakudesu.cloud/episode/anh-episode-12-sub-indo/";
  const finalResult = {};

  const $ = await cheerio.fromURL(url);

  const titleEpisode = $(".posttl").text();

  const episodeList = $("#selectcog option")
    .map((i, item) => {
      const episodeStr = $(item).text();
      const episode = episodeStr.split(" ")[1];
      const url = $(item).attr("value");

      return {
        episode: parseInt(episode),
        url,
      };
    })
    .get();
  const filteredEpisodes = episodeList.filter((item) => !item.url.includes(0));
  const sortedEpisodes = filteredEpisodes.sort().reverse();

  const qualityList = $(".download ul li")
    .map((i, item) => {
      const formatQuality = $("strong", item).text();
      const size = $("i", item).text();
      const links = $("a", item).map((i, link) => {
        const providerName = $(link).text();
        const url = $(link).attr("href");

        return {
          provider: providerName.trim(),
          url,
        };
      }).get();

      return {
        format: formatQuality,
        size,
        links,
      };
    })
    .get();

  const sortedDownload = qualityList.reduce((acc, item) => {
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
  finalResult.download = sortedDownload;

  console.info(`Detail Episode Scrapped at ${createLocaleDateTime()}`);

  return finalResult;
};

module.exports = {
  fetchUrlEpisode,
  fetchDetailAnime,
  fetchOngoingAnime,
};
