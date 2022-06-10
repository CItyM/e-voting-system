const BigInteger = require("bigi");
const BN = require("bn.js");
const { randomBytes } = require("crypto");
const { getCurveByName, Point } = require("ecurve");
const { utils } = require("web3");

const ecparams = getCurveByName("secp256k1");
const G = ecparams.G;
const n = ecparams.n;

const bnFromBigInteger = (bigInteger) => {
  const s = bigInteger.toString();
  return new BN(s);
};

const bigIntegerFromHex = (hex) => {
  return BigInteger.fromHex(evenHex(hex));
};

const bigIntegerFromBN = (bn) => {
  const hex = bn.toString(16);
  return bigIntegerFromHex(hex);
};

const bigIntegerFromHash = (hash) => {
  const hex = hash.substring(2);
  return bigIntegerFromHex(hex);
};

const pointFromHex = (x, y) => {
  x = bigIntegerFromHex(x);
  y = bigIntegerFromHex(y);
  return Point.fromAffine(ecparams, x, y);
};

const pointFromBN = (x, y) => {
  x = bigIntegerFromBN(x);
  y = bigIntegerFromBN(y);
  return Point.fromAffine(ecparams, x, y);
};

const newKeyPair = () => {
  let d = random(32);
  const Q = G.multiply(d);
  d = d.toString(16);
  const QX = Q.affineX.toString(16);
  const QY = Q.affineY.toString(16);
  return { d, QX, QY };
};

const newRequestParameters = () => {
  let k = random(32);
  const signerR = G.multiply(k);
  let signerRX = signerR.affineX.mod(n);
  let signerRY = signerR.affineY.mod(n);
  k = k.toString(16);
  signerRX = bnFromBigInteger(signerRX);
  signerRY = bnFromBigInteger(signerRY);
  return { k, signerRX, signerRY };
};

const blindMessage = (message, signerRX, signerRY) => {
  const signerR = pointFromBN(signerRX, signerRY);
  let a = random(32);
  let b = random(32);
  const R = signerR.multiply(a).add(G.multiply(b));
  let RX = R.affineX.mod(n);
  let RY = R.affineY.mod(n);
  let hm = bigIntegerFromHash(utils.sha3(message));
  let blindedMessage = a.modInverse(n).multiply(RX).multiply(hm).mod(n);
  a = a.toString(16);
  b = b.toString(16);
  RX = RX.toString(16);
  RY = RY.toString(16);
  hm = hm.toString(16);
  blindedMessage = bnFromBigInteger(blindedMessage);
  return { a, b, RX, RY, hm, blindedMessage };
};

const signBlindedMessage = (blindedMessage, d, k) => {
  blindedMessage = bigIntegerFromBN(blindedMessage);
  d = bigIntegerFromHex(d);
  k = bigIntegerFromHex(k);
  let signedBlindedMessage = d.multiply(blindedMessage).add(k).mod(n);
  signedBlindedMessage = bnFromBigInteger(signedBlindedMessage);
  return signedBlindedMessage;
};

const unblindSignedBlindedMessage = (signedBlindedMessage, a, b) => {
  signedBlindedMessage = bigIntegerFromBN(signedBlindedMessage);
  a = bigIntegerFromHex(a);
  b = bigIntegerFromHex(b);
  let unblindedSignedMessage = a.multiply(signedBlindedMessage).add(b).mod(n);
  unblindedSignedMessage = bnFromBigInteger(unblindedSignedMessage);
  return unblindedSignedMessage;
};

const verify = (hm, unblindedSignedMessage, RX, RY, QX, QY) => {
  hm = bigIntegerFromBN(hm);
  unblindedSignedMessage = bigIntegerFromBN(unblindedSignedMessage);
  const left = G.multiply(unblindedSignedMessage);
  const R = pointFromBN(RX, RY);
  const Q = pointFromHex(QX, QY);
  RX = bigIntegerFromBN(RX);
  const right = R.add(Q.multiply(RX.multiply(hm)));
  if (left.equals(right)) {
    return true;
  }
  return false;
};

module.exports = {
  bigIntegerFromBN,
  bigIntegerFromHash,
  bnFromBigInteger,
  verify,
  blindMessage,
  pointFromBN,
  pointFromHex,
  newKeyPair,
  newRequestParameters,
  signBlindedMessage,
  unblindSignedBlindedMessage,
};

const random = (bytes) => {
  let k;
  do {
    k = BigInteger.fromByteArrayUnsigned(randomBytes(bytes));
  } while (k.toString() == "0" && k.gcd(n).toString() != "1");
  return k;
};

const evenHex = (hexString) => {
  if (hexString.length % 2 != 0) {
    hexString = "0" + hexString;
  }
  return hexString;
};
