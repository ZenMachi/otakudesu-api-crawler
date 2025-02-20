import { Request, Response } from "express";
import ScrapService from "../../services/ScrapService";

class OngoingController {
  _scrapService: ScrapService;

  constructor(scrapService: ScrapService) {
    this._scrapService = scrapService;
  }

  async getOngoingAnime(req: Request, res: Response) {
    try {
      const page = req.params.page;
      const result = await this._scrapService.fetchOngoingAnime(parseInt(page));
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
}

export = OngoingController;
