const Binance = require("binance-api-node").default;
const binance = Binance();

const dotenv = require("dotenv").config();
const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const _ = require("lodash");

const Bot = require("./bot");

let bots = [];

server.use(bodyParser.json());
server.set("json spaces", 2);

server.get("/", async function (req, res) {
  res.status(200).json(bots);
});

server.get("/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });

  if (bot != null && bot != undefined) {
    res.status(200).json(bot);
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.get("/:id/last", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200).json(bot.lastCandle());
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.get("/signals/:id/last", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200).json(bot.signals);
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.post("/create", function (req, res) {
  let data = req.body;

  if (data.id && data.symbol && data.interval) {
    bots.push(new Bot(data.id, data.ticker, data.interval));
    res.status(200).json({
      message: "bot successfully created",
    });
  } else {
    res.status(500).json({
      message: "could not create bot",
    });
  }
});

server.listen(PORT, async () => {
  console.log(`server started on port ${PORT}`);

  //testing
  bots.push(new Bot(1, "BTCUSDT", "5m"));
  bots.push(new Bot(2, "ETHUSDT", "5m"));
});
