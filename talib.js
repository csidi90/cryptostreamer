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

const aboveEMA = function (closePrices, period) {
  let result = talib.EMA(closePrices, period, talib.MATypes.EMA);
  let value = _.last(result);
  let lastPrice = _.last(closePrices);
  return lastPrice > value;
};

const belowEMA = function (closePrices, period) {
  let result = talib.EMA(closePrices, period, talib.MATypes.EMA);
  let value = _.last(result);
  let lastPrice = _.last(closePrices);
  return lastPrice < value;
};

module.exports = {
  aboveMA,
  aboveEMA,
  belowMA,
  belowEMA,
};
