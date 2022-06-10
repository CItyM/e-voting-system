import { unblindSignedBlindedMessage } from "../../blind-signatures/blind-secp256k1";
import { download } from "../../helpers/key-file-helpers";

const vote = async (contract, keys, choice) => {
  const unblindedSignedUUID = unblindSignedBlindedMessage(
    keys.signedBlindedUUID,
    keys.a,
    keys.b
  );

  keys.unblindedSignedUUID = unblindedSignedUUID;

  await contract.object.vote(
    keys.RX,
    keys.RY,
    keys.uuid,
    unblindedSignedUUID,
    choice
  );

  download(keys, "verification-keys");
};

export default vote;
