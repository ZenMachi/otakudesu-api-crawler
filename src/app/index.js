const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = process.env.PORT || 3000;

const ongoingRoutes = require("../routes/ongoing");
const animeRoutes = require("../routes/anime");

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/ongoing", ongoingRoutes);
app.use("/api/anime", animeRoutes);

const server = app.listen(PORT, () => {
  console.log(`Running on port: ${server.address().port}`);
});
