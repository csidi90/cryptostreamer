const Binance = require("binance-api-node").default;
const binance = Binance();

const cors = require("cors");
const dotenv = require("dotenv").config();
const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const _ = require("lodash");

const Bot = require("./bot");

let bots = [];

server.use(cors());
server.use(bodyParser.json());
server.set("json spaces", 2);

server.get("/", async function (req, res) {
  res.status(200).json(bots);
});

server.get("/tickers", async function (req, res) {
  let data = await binance.futuresAllBookTickers();

  if (data != undefined) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ message: "failed to fetch tickers" });
  }
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

server.get("/history/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });

  if (bot != null && bot != undefined) {
    res.status(200).json(bot.history);
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

server.get("/start/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200);
    bot.start();
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.get("/stop/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200);
    bot.stop();
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.get("/signals/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200).json({
      bullish: bot.bullishSignals,
      bearish: bot.bearishSignals,
    });
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.get("/conditions/:id", async function (req, res) {
  let bot = _.find(bots, function (o) {
    return o.id == req.params.id;
  });
  if (bot != null && bot != undefined) {
    res.status(200).json({
      buyConditions: bot.buyConditions,
      sellConditions: bot.sellConditions,
    });
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.post("/create", function (req, res) {
  let data = req.body;
  console.log(data);

  if (data.id != null) {
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

server.post("/delete", function (req, res) {
  let data = req.body;

  if (data.id != null) {
    bots = bots.filter((bot) => bot.id !== data.id);
    res.status(200).json({
      message: "bot successfully deleted",
    });
  } else {
    res.status(500).json({
      message: "could not delete bot",
    });
  }
});

server.post("/buyconditions", function (req, res) {
  let data = req.body;

  console.log(data);
  let bot = _.find(bots, function (o) {
    return o.id == data.id;
  });
  if (bot != null && bot != undefined) {
    bot.buyConditions.push(data.condition);
    res.status(200);
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.post("/sellconditions", function (req, res) {
  let data = req.body;
  let bot = _.find(bots, function (o) {
    return o.id == data.id;
  });
  if (bot != null && bot != undefined) {
    bot.sellConditions.push(data.condition);
    res.status(200);
  } else {
    res.status(500).json({ message: "bot with given ID not found" });
  }
});

server.listen(PORT, async () => {
  console.log(`server started on port ${PORT}`);
});
