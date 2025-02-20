import { Router } from "express";
import ScrapService from "../../services/ScrapService";
import cache from "../../middleware/route_cache";
import AnimeController from "./controller";

const router = Router();
const animeRoutes = (scrapService: ScrapService) => {
  const controller = new AnimeController(scrapService);

  router.route("/get-url/").get(cache(3600), controller.getUrlToDetail);
  router.route("/detail/").get(cache(3600), controller.getDetailAnime);

  return router;
};

export { animeRoutes };
