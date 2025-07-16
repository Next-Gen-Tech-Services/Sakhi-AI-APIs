const mongoose = require("mongoose");
const { MONGO_URI } = require("./server.config");
const log = require("./logger.config");

// DATABASE CONNECTION VARIABLE
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    log.info("connected to database succesfully");
  })
  .catch((err) => log.error(err));
