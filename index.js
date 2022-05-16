"use strict";
const fs = require("fs");
const torrent = fs.readFileSync("big-buck-bunny.torrent");
console.log(torrent.toString("utf8"));
