import { v4 } from "uuid";
import { blindMessage } from "../../blind-signatures/blind-secp256k1";
import { download } from "../../helpers/key-file-helpers";

const register = async (contract) => {
  // Generates UUID
  const uuid = v4();
  // Blinds the UUID using the blind-secp256k1 implementation
  const { a, b, RX, RY, hm, blindedMessage } = blindMessage(
    uuid,
    contract.signerR.RX,
    contract.signerR.RY
  );
  const keys = {
    a,
    b,
    RX,
    RY,
    uuid: hm,
  };
  // Uses the “VotingSystem” contract wrapper class to register
  await contract.object.register(blindedMessage);
  // Downloads the registration keys so they can be updated later
  download(keys, "registration-keys");
};

export default register;
