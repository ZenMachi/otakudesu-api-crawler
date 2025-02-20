import express, { Application } from "express";
import morgan from "morgan";
const app: Application = express();

import { ongoingRoutes } from "../api/ongoing/routes";
import { animeRoutes } from "../api/anime/routes";
import ScrapService from "../services/ScrapService";
const PORT = process.env.PORT || 3000;

const init = async () => {
  const scrapService = new ScrapService();

  console.log("Hello World");
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api/ongoing", ongoingRoutes(scrapService));
  app.use("/api/anime", animeRoutes(scrapService));

  const server = app.listen(PORT, () => {
    const address = server.address();
    if (address && typeof address !== "string") {
      console.log(`Running on port: ${address.port}`);
    } else {
      console.log("Server is running");
    }
  });
};

init();
