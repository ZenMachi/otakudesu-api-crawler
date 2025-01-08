const controller = require("../controllers/anime");
const router = require("express").Router();
const cache = require("../middleware/route_cache");

router.get("/get-url/", cache(3600), controller.getUrlToDetail);
router.get("/detail/", cache(3600), controller.getDetailAnime);

module.exports = router;
