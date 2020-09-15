const talib = require("talib-binding");
const _ = require("lodash");

const aboveMA = function (closePrices, period) {
  let result = talib.MA(closePrices, period);
  let value = _.last(result);
  let lastPrice = _.last(closePrices);
  return lastPrice > value;
};

const belowMA = function (closePrices, period) {
  let result = talib.MA(closePrices, period);
  let value = _.last(result);
  let lastPrice = _.last(closePrices);
  return lastPrice < value;
};

module.exports = {
  aboveMA,
  belowMA,
};
