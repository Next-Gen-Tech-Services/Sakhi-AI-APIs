const moment = require("moment");

/**
 * @const HISTORY_INPUT_PARAMS: [Creating params for getting the history data of a stock]
 * @attribute 1: [for 1 day data]
 * @attribute 2: [for 1 week data]
 * @attribute 3: [for 1 month data]
 * @attribute 4: [for 6 months data]
 * @attribute 5: [for 1 year data]
 */

const HISTORY_INPUT_PARAMS = {
  1: {
    dateFormat: 1,
    resolution: 5,
    range_from: moment().format("YYYY-MM-DD"),
    range_to: moment().add(1, "days").format("YYYY-MM-DD"),
  },
  2: {
    dateFormat: 1,
    resolution: 30,
    range_from: moment().subtract(7, "days").format("YYYY-MM-DD"),
    range_to: moment().format("YYYY-MM-DD"),
  },
  3: {
    dateFormat: 1,
    resolution: 120,
    range_from: moment().subtract(30, "days").format("YYYY-MM-DD"),
    range_to: moment().format("YYYY-MM-DD"),
  },
  4: {
    dateFormat: 1,
    resolution: "1D",
    range_from: moment().subtract(182, "days").format("YYYY-MM-DD"),
    range_to: moment().format("YYYY-MM-DD"),
  },
  5: {
    dateFormat: 1,
    resolution: "1D",
    range_from: moment().subtract(364, "days").format("YYYY-MM-DD"),
    range_to: moment().format("YYYY-MM-DD"),
  },
};

module.exports = HISTORY_INPUT_PARAMS;
