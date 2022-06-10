import { signBlindedMessage } from "../../blind-signatures/blind-secp256k1";

const sign = async (contract, keys, voters) => {
  for (const v of voters) {
    // Uses the “VotingSystem” contract wrapper class to get a voter data
    const voter = await contract.object.voter(v.address);
    // Signs the blinded UUID using the blind-secp256k1 implementation
    const signedBlindedMessage = signBlindedMessage(
      voter.blindedUUID,
      keys.d,
      keys.k
    );
    // Uses the “VotingSystem” contract wrapper class to set voters signed blinded UUID
    await contract.object.signBlindedUUID(v.address, signedBlindedMessage);
  }
};
export default sign;
