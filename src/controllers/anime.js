const { fetchDetailAnime, fetchUrlEpisode } = require("../services/anime");

const getDetailAnime = async (req, res) => {
  try {
    const targetUrl = req.query.target_url;
    const result = await fetchDetailAnime(targetUrl);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getUrlToDetail = async (req, res) => {
  try {
    const episodeUrl = req.query.episode_list_url;
    const episode = req.query.episode;

    const result = await fetchUrlEpisode(episodeUrl, episode);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server Error");
  }
};

module.exports = {
  getDetailAnime,
  getUrlToDetail,
};
