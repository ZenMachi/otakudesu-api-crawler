const controller = require("../controllers/ongoing");
const router = require("express").Router();

router.get("/:page", controller.getOngoing);

module.exports = router;
