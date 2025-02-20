import { Request, Response } from "express";
import ScrapService from "../../services/ScrapService";
import autoBind from "auto-bind";

class AnimeController {
  _scrapService: ScrapService;

  constructor(scrapService: ScrapService) {
    this._scrapService = scrapService;

    autoBind(this);
  }

  async getDetailAnime(req: Request, res: Response) {
    try {
      const { targetUrl } = req.query;
      const result = await this._scrapService.fetchDetailAnime(
        targetUrl as string
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getUrlToDetail(req: Request, res: Response) {
    try {
      const { listEpisodeUrl, episode } = req.query;
      const result = await this._scrapService.fetchUrlEpisode(
        listEpisodeUrl as string,
        parseInt(episode as string)
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server Error");
    }
  }
}

export = AnimeController;
