const controller = require("../controllers/anime");
const router = require("express").Router();

router.get("/get-url/", controller.getUrlToDetail);
router.get("/detail/", controller.getDetailAnime);

module.exports = router;
