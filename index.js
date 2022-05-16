"use strict";
const fs = require("fs");
const bencode = require("bencode");
const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;

/* Reading the torrent file and parsing the announce url. */
const torrent = bencode.decode(fs.readFileSync("big-buck-bunny.torrent"));
const url = urlParse(torrent.announce.toString("utf8"));

/* Sending a message to the tracker. */
const socket = dgram.createSocket("udp4");
const msg = Buffer.from("hello?", "utf8");
socket.send(msg, 0, msg.length, url.port, url.host, () => {
  console.log("sent");
});
socket.on("message", (msg) => {
  console.log("message is", msg);
});
