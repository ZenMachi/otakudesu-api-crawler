const controller = require("../controllers/ongoing")
const router = require("express").Router()

module.exports = () => {
    router.get("/:page", controller.getOngoing)
}