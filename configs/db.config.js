const mongoose = require("mongoose");
const { MONGO_URI, DATABASE_NAME } = require("./server.config");
const log = require("./logger.config");

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI, {
    dbName: DATABASE_NAME,
  })
  .then(() => {
    log.info(`✅ Connected to Azure Cosmos DB: ${DATABASE_NAME}`);
  })
  .catch((err) => {
    log.error("❌ MongoDB Connection Error: ", err);
  });
