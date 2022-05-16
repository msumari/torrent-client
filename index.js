"use strict";
const fs = require("fs");
const bencode = require("bencode");
const tracker = require("./tracker");

/* Reading the torrent file and parsing the announce url. */
const torrent = bencode.decode(fs.readFileSync("big-buck-bunny.torrent"));

tracker.getPeers(torrent, (peers) => {
  console.log("list of peers:", peers);
});
