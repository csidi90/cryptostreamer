const Binance = require("binance-api-node").default;
const binance = Binance();
const talib = require("talib-binding");
const _ = require("lodash");
class Bot {
  constructor(id, ticker, interval) {
    this.id = id;
    this.ticker = ticker;
    this.interval = interval;
    this.cache = [];
    console.log(`Bot for ${this.ticker} generated`);

    this.generateCache();
  }

  async generateCache() {
    this.cache = await binance.candles({
      symbol: this.ticker,
      interval: this.interval,
    });

    binance.ws.candles(this.ticker, this.interval, (candle) => {
      let last = _.last(this.cache);

      if (last.openTime != candle.startTime) {
        this.cache.push({
          openTime: candle.startTime,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
          closeTime: candle.closeTime,
          quoteVolume: candle.quoteVolume,
          trades: candle.trades,
          baseAssetVolume: candle.buyVolume,
          quoteAssetVolume: candle.quoteVolume,
        });

        console.log("new candle added size: " + this.cache.length);
      } else {
        last.open = candle.open;
        last.high = candle.high;
        last.low = candle.low;
        last.close = candle.close;
        last.volume = candle.volume;
        last.closeTime = candle.closeTime;
        last.quoteVolume = candle.quoteVolume;
        last.trades = candle.trades;
        last.baseAssetVolume = candle.buyVolume;
        last.quoteAssetVolume = candle.quoteVolume;
      }
    });
  }

  lastCandle() {
    return _.last(this.cache);
  }
}

module.exports = Bot;