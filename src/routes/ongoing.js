const controller = require("../controllers/ongoing");
const router = require("express").Router();
const cache = require("../middleware/route_cache");

router.get("/:page", cache(3600), controller.getOngoing);

module.exports = router;
