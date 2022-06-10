const BN = require("bn.js");
const { newKeyPair, newRequestParameters } = require("./blind-secp256k1");

const { d, QX, QY } = newKeyPair();
const { k, signerRX, signerRY } = newRequestParameters();

module.exports = {
  choices: ["Choice 1", "Choice 2", "Choice 3"],
  emptyName: "",
  emptyChoices: [],
  name: "Vote Name",
  registrationTimeStart: new BN((Date.now() / 1000) | 0),
  registrationTimeEnd: new BN(((Date.now() / 1000) | 0) + 30),
  votingTimeStart: new BN(((Date.now() / 1000) | 0) + 40),
  votingTimeEnd: new BN(((Date.now() / 1000) | 0) + 70),
  zero: new BN(0),
  zeroKey: new BN(0),
  zeroTime: new BN(0),
  zeroUUID: new BN(0),
  d,
  QX,
  QY,
  k,
  signerRX,
  signerRY,
};
