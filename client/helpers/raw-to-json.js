import BN from "bn.js";

export const rawChoicesToJson = (rawChoices) => {
  const jsonChoices = [];
  rawChoices.forEach((rawChoice) => {
    jsonChoices.push({
      choice: rawChoice.choice,
      votes: parseInt(rawChoice.votes),
    });
  });
  return jsonChoices;
};

export const rawVoterToJson = (rawVoter) => {
  return {
    voterAddress: rawVoter.voterAddress,
    blindedUUID: new BN(rawVoter.blindedUUID),
    signedBlindedUUID: new BN(rawVoter.signedBlindedUUID),
    registered: rawVoter.registered,
  };
};

export const rawVoteToJson = (rawVote) => {
  return {
    voted: rawVote.voted,
    choice: rawVote.choice - 1,
  };
};

export const rawBallotsToJson = (rawBallots) => {
  const jsonBallots = [];
  rawBallots.forEach((rawBallot) => {
    jsonBallots.push({
      RX: new BN(rawBallot.RX),
      RY: new BN(rawBallot.RY),
      uuid: new BN(rawBallot.uuid),
      unblindedSignedUUID: new BN(rawBallot.unblindedSignedUUID),
      choice: new BN(rawBallot.choice),
    });
  });
  return jsonBallots;
};

export const rawContractToJson = (rawContract) => {
  return {
    contractAddress: rawContract.contractAddress,
    contractOwner: rawContract.contractOwner,
  };
};

export const rawContractsToJson = (rawContracts) => {
  const jsonContracts = [];
  rawContracts.map((rawContract) =>
    jsonContracts.push(rawContractToJson(rawContract))
  );
  return jsonContracts;
};

export const rawTimeToJson = (rawTime) => {
  return { start: parseInt(rawTime["0"]), end: parseInt(rawTime["1"]) };
};
