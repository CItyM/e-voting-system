import { download } from "../../helpers/key-file-helpers";

const update = (contract, keys) => {
  keys.signedBlindedUUID = contract.voter.signedBlindedUUID;
  // Downloads the updated keys so they can be used during voting
  download(keys, "voting-keys");
};

export default update;
