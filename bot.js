const Binance = require("binance-api-node").default;
const binance = Binance();
const _ = require("lodash");
const talib = require("./talib");

class Bot {
  constructor(id, ticker, interval) {
    this.id = id;
    this.ticker = ticker;
    this.interval = interval;
    this.cache = [];
    this.bullishSignals = {};
    this.bearishSignals = {};
    console.log(`Bot for ${this.ticker} generated`);

    this.generateCache();
    this.checkSignals();
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

  checkSignals() {
    let self = this;
    setInterval(function () {
      //BULLISH SIGNALS
      self.bullishSignals.aboveSMA50 = talib.aboveMA(
        self.candleData("close"),
        50
      );
      self.bullishSignals.aboveSMA100 = talib.aboveMA(
        self.candleData("close"),
        100
      );
      self.bullishSignals.aboveSMA200 = talib.aboveMA(
        self.candleData("close"),
        200
      );

      self.bullishSignals.emaCross_9_27 = talib.bullishEMACross(
        self.candleData("close"),
        9,
        27
      );
      //BEARISH SIGNALS
      self.bearishSignals.aboveEMA50 = talib.aboveEMA(
        self.candleData("close"),
        50
      );
      self.bearishSignals.aboveEMA100 = talib.aboveEMA(
        self.candleData("close"),
        100
      );
      self.bearishSignals.aboveEMA200 = talib.aboveEMA(
        self.candleData("close"),
        200
      );
      self.bearishSignals.emaCross_9_27 = talib.bearishEMACross(
        self.candleData("close"),
        9,
        27
      );
    }, 1000);
  }

  lastCandle() {
    return _.last(this.cache);
  }

  candleData(key) {
    return _.map(this.cache, key);
  }
}

module.exports = Bot;
