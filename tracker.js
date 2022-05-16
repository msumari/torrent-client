"use strict";

const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce.toString("utf8");

  /* Sending a connection request to the tracker. */
  udpSend(socket, buildConnReq(), url);

  socket.on("message", (response) => {
    if (respType(response) === "connect") {
      /* Parsing the response from the tracker. */
      const connResp = parseConnResp(response);
      /* Building the announce request. */
      const announceReq = buildAnnounceReq(connResp.connectionId);

      /* Sending the announce request to the tracker. */
      udpSend(socket, announceReq, url);
    } else if (respType(response) === "announce") {
      /* Parsing the response from the tracker and then calling the callback function with the peers. */
      const announceResp = parseAnnounceResp(response);
      callback(announceResp.peers);
    }
  });
};

const udpSend = (socket, message, rawUrl, callback = () => {}) => {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
};

const respType = (resp) => {};

const buildConnReq = () => {};

const parseConnResp = (resp) => {};

const buildAnnounceReq = (connId) => {};

const parseAnnounceResp = (resp) => {};
