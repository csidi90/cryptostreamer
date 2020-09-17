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
    this.running = false;
    this.buyConditions = [];
    this.sellConditions = [];
    this.history = [];
    console.log(`Bot for ${this.ticker} ID: ${this.id} generated`);

    //API AND SECRED TO ADD
  }

  shouldBuy() {
    if (this.buyConditions.length > 0) {
      let self = this;
      let conditionCount = self.buyConditions.length;
      let matchCount = 0;

      for (let i of self.buyConditions) {
        if (self.bullishSignals[i] == true) {
          matchCount++;
        }
      }

      if (matchCount == conditionCount) {
        console.log(" buy true");
        self.history.push({
          Date: new Date(),
          TYPE: "BUY",
        });
      }
      if (self.history.length > 10) {
        self.history.shift();
      }
    }
  }
  shouldSell() {
    if (this.sellConditions.length > 0) {
      let self = this;
      let conditionCount = self.sellConditions.length;
      let matchCount = 0;

      for (let i of self.sellConditions) {
        if (self.bearishSignals[i] == true) {
          matchCount++;
        }
      }

      if (matchCount == conditionCount) {
        console.log(" sell true");
        self.history.push({
          Date: new Date(),
          TYPE: "SELL",
        });
      }
      if (self.history.length > 10) {
        self.history.shift();
      }
    }
  }

  start() {
    this.running = true;
    this.generateCache();
    this.checkSignals();

    console.log(
      `starting bot ID: ${this.id} buy conditions: ${this.buyConditions} - sell conditions: ${this.sellConditions}`
    );
  }

  stop() {
    this.running = false;
  }

  async openOrders() {
    return await binance.futuresOpenOrders();
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
    if (this.running) {
      let self = this;
      setInterval(function () {
        self.checkBullishSignals();
        self.checkBearishSignals();
        self.shouldBuy();
        self.shouldSell();
      }, 1000);
    }
  }

  checkBullishSignals() {
    //BULLISH SIGNALS

    this.bullishSignals.oversold = talib.isOversold(this.candleData("close"));

    this.bullishSignals.aboveSMA50 = talib.aboveMA(
      this.candleData("close"),
      50
    );
    this.bullishSignals.aboveSMA100 = talib.aboveMA(
      this.candleData("close"),
      100
    );
    this.bullishSignals.aboveSMA200 = talib.aboveMA(
      this.candleData("close"),
      200
    );

    this.bullishSignals.aboveEMA50 = talib.aboveEMA(
      this.candleData("close"),
      50
    );
    this.bullishSignals.aboveEMA100 = talib.aboveEMA(
      this.candleData("close"),
      100
    );
    this.bullishSignals.aboveEMA200 = talib.aboveEMA(
      this.candleData("close"),
      200
    );

    this.bullishSignals.emaCross_9_27 = talib.bullishEMACross(
      this.candleData("close"),
      9,
      27
    );
    this.bullishSignals.smaCross_50_100 = talib.bullishSMACross(
      this.candleData("close"),
      50,
      100
    );
    this.bullishSignals.smaCross_50_200 = talib.bullishSMACross(
      this.candleData("close"),
      50,
      200
    );
    this.bullishSignals.smaCross_100_200 = talib.bullishSMACross(
      this.candleData("close"),
      100,
      200
    );
    this.bullishSignals.emaCross_50_100 = talib.bullishEMACross(
      this.candleData("close"),
      50,
      100
    );
    this.bullishSignals.emaCross_50_200 = talib.bullishEMACross(
      this.candleData("close"),
      50,
      200
    );
    this.bullishSignals.emaCross_100_200 = talib.bullishEMACross(
      this.candleData("close"),
      100,
      200
    );
  }

  checkBearishSignals() {
    this.bearishSignals.overbought = talib.isOverbought(
      this.candleData("close")
    );

    //BULLISH SIGNALS
    this.bearishSignals.belowSMA50 = talib.belowMA(
      this.candleData("close"),
      50
    );
    this.bearishSignals.belowSMA100 = talib.belowMA(
      this.candleData("close"),
      100
    );
    this.bearishSignals.belowSMA200 = talib.belowMA(
      this.candleData("close"),
      200
    );

    this.bearishSignals.belowEMA50 = talib.belowEMA(
      this.candleData("close"),
      50
    );
    this.bearishSignals.belowEMA100 = talib.belowEMA(
      this.candleData("close"),
      100
    );
    this.bearishSignals.belowEMA200 = talib.belowEMA(
      this.candleData("close"),
      200
    );

    this.bearishSignals.emaCross_9_27 = talib.bearishEMACross(
      this.candleData("close"),
      9,
      27
    );
    this.bearishSignals.smaCross_50_100 = talib.bearishSMACross(
      this.candleData("close"),
      50,
      100
    );
    this.bearishSignals.smaCross_50_200 = talib.bearishSMACross(
      this.candleData("close"),
      50,
      200
    );
    this.bearishSignals.smaCross_100_200 = talib.bearishSMACross(
      this.candleData("close"),
      100,
      200
    );
    this.bearishSignals.emaCross_50_100 = talib.bearishEMACross(
      this.candleData("close"),
      50,
      100
    );
    this.bearishSignals.emaCross_50_200 = talib.bearishEMACross(
      this.candleData("close"),
      50,
      200
    );
    this.bearishSignals.emaCross_100_200 = talib.bearishEMACross(
      this.candleData("close"),
      100,
      200
    );
  }

  getBullishConditions() {
    return Object.keys(this.bullishSignals);
  }

  getBearishConditions() {
    return Object.keys(this.bearishSignals);
  }

  lastCandle() {
    return _.last(this.cache);
  }

  candleData(key) {
    return _.map(this.cache, key);
  }
}

module.exports = Bot;
