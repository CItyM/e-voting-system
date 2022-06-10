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

/**
 * @notice New key pair
 * Generates a new elliptic curve key pair for the signer to verify.
 * @returns {string, string, string} {d, QX, QY} Private key and
 * public key's X and Y
 */
const newKeyPair = () => {
  let d = random(32);
  const Q = G.multiply(d);
  d = d.toString(16);
  const QX = Q.affineX.toString(16);
  const QY = Q.affineY.toString(16);
  return { d, QX, QY };
};

/**
 * @notice New request parameters
 * Generates a new elliptic curve key pair for the signer to sign.
 * @returns {string, BN, BN} {k, signerRX, signerRY} Private key and
 * public key's X and Y
 */
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

/**
 * @notice Blind Message
 * @param {string} message Message to bind.
 * @param {BN} signerRX Signer's public key X value.
 * @param {BN} signerRY Signer's public key Y value.
 * @returns {string, string, string, string, string, BN }
 * {a, b, RX, RY, hm, blindedMessage }
 * Secret values a and b, public values RX and RY,
 * message hash and blinded message.
 */
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

/**
 * @notice Sing blinded message
 * @param {BN} blindedMessage Blinded message.
 * @param {string} d Signer's first secret key.
 * @param {string} k Signer's second secret key.
 * @returns {BN} Signed blinded message
 */
const signBlindedMessage = (blindedMessage, d, k) => {
  blindedMessage = bigIntegerFromBN(blindedMessage);
  d = bigIntegerFromHex(d);
  k = bigIntegerFromHex(k);
  let signedBlindedMessage = d.multiply(blindedMessage).add(k).mod(n);
  signedBlindedMessage = bnFromBigInteger(signedBlindedMessage);
  return signedBlindedMessage;
};

/**
 * @notice Unblind signed blinded message
 * @param {BN} signedBlindedMessage Signed blinded message.
 * @param {string} a User's first secret value.
 * @param {string} b User's second secret value.
 * @returns {BN} Unblinded signed message
 */
const unblindSignedBlindedMessage = (signedBlindedMessage, a, b) => {
  signedBlindedMessage = bigIntegerFromBN(signedBlindedMessage);
  a = bigIntegerFromHex(a);
  b = bigIntegerFromHex(b);
  let unblindedSignedMessage = a.multiply(signedBlindedMessage).add(b).mod(n);
  unblindedSignedMessage = bnFromBigInteger(unblindedSignedMessage);
  return unblindedSignedMessage;
};

/**
 * @notice Verify
 * @param {BN} hm Message hash.
 * @param {BN} unblindedSignedMessage Unblinded signed message.
 * @param {BN} RX User's public key X value.
 * @param {BN} RY User's public key Y value.
 * @param {string} QX Signer's verification public key X value.
 * @param {string} QY Signer's verification public key Y value.
 * @returns {bool}
 */
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
