import { verify } from "../../blind-signatures/blind-secp256k1";

const tally = async (contract, keys) => {
  const ballots = await contract.object.ballots();
  const uuids = [];
  const choices = [];
  ballots.forEach((ballot) => {
    const isValid = verify(
      ballot.uuid,
      ballot.unblindedSignedUUID,
      ballot.RX,
      ballot.RY,
      keys.QX,
      keys.QY
    );
    if (isValid) {
      uuids.push(ballot.uuid);
      choices.push(ballot.choice);
    }
  });

  if (uuids.length === choices.length && uuids.length !== 0)
    await contract.object.tallyVotes(uuids, choices);
  else alert("No ballots to tally");
};

export default tally;
