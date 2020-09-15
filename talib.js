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

const bullishSMACross = function (closePrices, shortPeriod, longPeriod) {
  let result_short = talib.MA(closePrices, shortPeriod);
  let result_long = talib.MA(closePrices, longPeriod);
  let short_value = _.last(result_short);
  let prev_short_value = result_short[result_short.length - 2];
  let long_value = _.last(result_long);
  let prev_long_value = result_long[result_long.length - 2];

  return shortValue > longValue && prev_short_value <= prev_long_value;
};
const bearishSMACross = function (closePrices, shortPeriod, longPeriod) {
  let result_short = talib.MA(closePrices, shortPeriod);
  let result_long = talib.MA(closePrices, longPeriod);
  let short_value = _.last(result_short);
  let prev_short_value = result_short[result_short.length - 2];
  let long_value = _.last(result_long);
  let prev_long_value = result_long[result_long.length - 2];

  return shortValue < longValue && prev_short_value >= prev_long_value;
};

const bullishEMACross = function (closePrices, shortPeriod, longPeriod) {
  let result_short = talib.EMA(closePrices, shortPeriod, talib.MATypes.EMA);
  let result_long = talib.EMA(closePrices, longPeriod, talib.MATypes.EMA);
  let short_value = _.last(result_short);
  let prev_short_value = result_short[result_short.length - 2];
  let long_value = _.last(result_long);
  let prev_long_value = result_long[result_long.length - 2];

  return shortValue > longValue && prev_short_value <= prev_long_value;
};
const bearishEMACross = function (closePrices, shortPeriod, longPeriod) {
  let result_short = talib.EMA(closePrices, shortPeriod, talib.MATypes.EMA);
  let result_long = talib.EMA(closePrices, longPeriod, talib.MATypes.EMA);
  let short_value = _.last(result_short);
  let prev_short_value = result_short[result_short.length - 2];
  let long_value = _.last(result_long);
  let prev_long_value = result_long[result_long.length - 2];

  return shortValue < longValue && prev_short_value >= prev_long_value;
};

module.exports = {
  aboveMA,
  aboveEMA,
  belowMA,
  belowEMA,
  bullishSMACross,
  bearishSMACross,
  bullishSMACross,
  bearishSMACross,
  bullishEMACross,
  bearishEMACross,
};
