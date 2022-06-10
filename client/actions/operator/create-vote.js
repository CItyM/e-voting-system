import {
  newKeyPair,
  newRequestParameters,
} from "../../blind-signatures/blind-secp256k1";
import { download } from "../../helpers/key-file-helpers";

const create = async (
  factoryContract,
  name,
  choices,
  registrationStartDate,
  registrationEndDate,
  votingStartDate,
  votingEndDate
) => {
  const ethRegistrationStartDate = (registrationStartDate / 1000) | 0;
  const ethRegistrationEndDate = (registrationEndDate / 1000) | 0;
  const ethVotingStartDate = (votingStartDate / 1000) | 0;
  const ethVotingEndDate = (votingEndDate / 1000) | 0;
  const choicesArray = [];
  choices.forEach((choice) => choicesArray.push(choice.choice));
  // Generate keys using the blind-secp256k1 implementation
  const { d, QX, QY } = newKeyPair();
  const { k, signerRX, signerRY } = newRequestParameters();
  const keys = {
    d,
    QX,
    QY,
    k,
    signerRX: signerRX.toString(16),
    signerRY: signerRY.toString(16),
  };
  // Uses the “VotingSystemFactory” contract wrapper class to create new voting instance
  await factoryContract.create(
    name,
    choicesArray,
    ethRegistrationStartDate,
    ethRegistrationEndDate,
    ethVotingStartDate,
    ethVotingEndDate,
    signerRX,
    signerRY
  );
  // Downloads the signing keys so they can be used by the signer-cli app
  download(keys, "signing-keys");
};

export default create;
