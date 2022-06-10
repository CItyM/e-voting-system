const { v4 } = require("uuid");
const { sha3 } = require("web3-utils");
const {
  newRequestParameters,
  newKeyPair,
  blindMessage,
  signBlindedMessage,
  unblindSignedBlindedMessage,
  verify,
} = require("./blind-secp256k1");
const BN = require("bn.js");
const fs = require("fs");

for (let i = 0; i < 1000; i++) {
  try {
    //--------------------------------------------------
    // Get 2 sets of keys for the organizer
    const { d, QX, QY } = newKeyPair();
    const { k, signerRX, signerRY } = newRequestParameters();

    //--------------------------------------------------
    // Generate the UUID
    // Generate a and b and use them to generate R
    // Use R to blind the UUID
    const uuid = v4();
    let { a, b, RX, RY, blindedMessage } = blindMessage(
      uuid,
      signerRX,
      signerRY
    );

    let votedData = {
      uuid: sha3(uuid).substring(2),
      a: a,
      b: b,
      RX: RX.toString(16),
      RY: RY.toString(16),
      blindedUUID: blindedMessage.toString(16),
    };
    fs.writeFileSync("./demo-voted-data.json", JSON.stringify(votedData));

    //--------------------------------------------------
    // The organizer signs the blindedUUID with d and k private keys
    votedData = JSON.parse(fs.readFileSync("./demo-voted-data.json", "utf8"));
    const blindedUUID = new BN(votedData.blindedUUID, 16);
    const signedBlindedMessage = signBlindedMessage(blindedUUID, d, k);
    votedData.signedBlindedUUID = signedBlindedMessage.toString(16);
    fs.writeFileSync("./demo-voted-data.json", JSON.stringify(votedData));

    //--------------------------------------------------
    // The voter unblinds the signed blinded UUID
    // It is used as the s part of the (R,s) signature
    votedData = JSON.parse(fs.readFileSync("./demo-voted-data.json", "utf8"));
    const signedBlindedUUID = new BN(votedData.signedBlindedUUID, 16);
    const unblindedSignedMessage = unblindSignedBlindedMessage(
      signedBlindedUUID,
      votedData.a,
      votedData.b
    );
    votedData.unblindedSignedUUID = unblindedSignedMessage.toString(16);
    fs.writeFileSync("./demo-voted-data.json", JSON.stringify(votedData));

    //--------------------------------------------------
    // Verification is done by the equation
    // s*G = R + Rx*hm*G === s*G = R + Rx*hm*Q
    votedData = JSON.parse(fs.readFileSync("./demo-voted-data.json", "utf8"));
    const hm = new BN(votedData.uuid, 16);
    const unblindedSignedUUID = votedData.unblindedSignedUUID;
    // RX = new BN(votedData.RX, 16);
    // RY = new BN(votedData.RY, 16);
    const valid = verify(hm, unblindedSignedUUID, RX, RY, QX, QY);
    if (!valid) console.log(votedData);
  } catch (error) {
    console.log(i);
    console.log(error);
  }
}
