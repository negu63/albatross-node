import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import Loaders from "./loaders";

async function startServer() {
  const app = express();

  await Loaders({ expressApp: app });

  app
    .listen(config.port, "0.0.0.0", () => {
      Logger.info(`Server listening on port: 3000`);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
