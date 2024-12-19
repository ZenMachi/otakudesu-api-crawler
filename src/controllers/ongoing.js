const { fetchOngoingAnime } = require("../services/anime");

const getOngoing = async (req, res) => {
  try {
    const page = req.params.page;
    const result = await fetchOngoingAnime(page);
    res.json(result);
  } catch (err) {
    console.error(err)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getOngoing,
};
