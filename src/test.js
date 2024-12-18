const {
  fetchUrlEpisode,
  fetchDetailAnime,
  fetchOngoingAnime,
} = require("./services/handler");

const getOneAnimeLink = async () => {
  const getOngoing = await fetchOngoingAnime(1);
  const getOneOngoing = getOngoing.results[0];
  const titleOngoing = getOneOngoing.title;
  const episodeOngoing = getOneOngoing.episode;
  const detailUrlOngoing = getOneOngoing.detail_url;

  const episodeUrl = await fetchUrlEpisode(detailUrlOngoing, episodeOngoing);

  const detailResult = await fetchDetailAnime(titleOngoing, episodeUrl.url);

  console.log("Download", detailResult.download);
  console.log("Episodes", detailResult.episodes);
};

getOneAnimeLink();

// getDetailEpisode("Episode 2");
// fetchOngoingAnime(1).then(async (result) => {
//   const itemPop = result.results.pop();
//   const url = itemPop.detail_url;
//   const episode = itemPop.episode;

//   const urlResult = await fetchUrlEpisode(url, episode);
//   console.log("Title", urlResult.title);
//   console.log("URL", urlResult.url);
// });

// fetchDetailAnime();

// getOngoingAnime(1);
