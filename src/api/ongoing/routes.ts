import { Router } from "express";
import cache from "../../middleware/route_cache";
import ScrapService from "../../services/ScrapService";
import OngoingController from "./controller";
const router = Router();

const ongoingRoutes = (scrapService: ScrapService) => {
  const controller = new OngoingController(scrapService);
  router.get("/:page", cache(3600), controller.getOngoingAnime);

  return router;
};

export { ongoingRoutes };
