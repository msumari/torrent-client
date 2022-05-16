"use strict";

const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;
const crypto = require("crypto");

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

const buildConnReq = () => {
  /* Creating a buffer of 16 bytes. */
  const buf = Buffer.alloc(16);

  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  /* Writing a 32-bit unsigned integer to the buffer. */
  buf.writeUInt32BE(0, 8);

  /* Generating 4 random bytes and copying them into the buffer at index 12. */
  crypto.randomBytes(4).copy(buf, 12);

  return buf;
};

const parseConnResp = (resp) => {
  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    connectionId: resp.slice(8),
  };
};

const buildAnnounceReq = (connId) => {};

const parseAnnounceResp = (resp) => {};
