const BN = require("bn.js");
const {
  zeroTime,
  registrationTimeStart,
  registrationTimeEnd,
  votingTimeStart,
  votingTimeEnd,
} = require("./input-values");
const { expect } = require("chai");

module.exports = {
  voterAssertion: (
    voter,
    voterAddress,
    blindedUUID,
    signedBlindedUUID,
    registered
  ) => {
    expect(voter.voterAddress).is.equal(voterAddress);
    expect(voter.blindedUUID).is.bignumber.eq(blindedUUID);
    expect(voter.signedBlindedUUID).is.bignumber.eq(signedBlindedUUID);
    expect(voter.registered).is.equal(registered);
  },
  rawBallotsToJson: (rawBallots) => {
    const jsonBallots = [];
    rawBallots.forEach((ballot) => {
      jsonBallots.push({
        RX: new BN(ballot.RX),
        RY: new BN(ballot.RY),
        uuid: new BN(ballot.uuid),
        unblindedSignedUUID: new BN(ballot.unblindedSignedUUID),
        choice: new BN(ballot.choice),
      });
    });
    return jsonBallots;
  },
  rawChoiceToJson: (rawChoices) => {
    const jsonChoices = [];
    rawChoices.forEach((choice) => {
      jsonChoices.push({
        choice: choice.choice,
        votes: parseInt(choice.votes),
      });
    });
    return jsonChoices;
  },
  rawVoterToJson: (rawVoter) => {
    return {
      voterAddress: rawVoter.voterAddress,
      blindedUUID: rawVoter.blindedUUID,
      signedBlindedUUID: rawVoter.signedBlindedUUID,
      registered: rawVoter.registered,
    };
  },
  rawContractToJson: (rawContract) => {
    return {
      contractAddress: rawContract._contractAddress,
      contractOwner: rawContract._contractOwner,
    };
  },
  rawTimeToBN: (rawTime) => {
    return [new BN(rawTime["0"]), new BN(rawTime["1"])];
  },
  getZeroTimes: () => {
    const times = [[zeroTime, zeroTime, votingTimeStart, zeroTime]];
    const time = [
      registrationTimeStart,
      registrationTimeEnd,
      votingTimeStart,
      votingTimeEnd,
    ];
    let time0 = [...time];
    for (let i = 0; i < 4; i++) {
      time0[i] = zeroTime;
      let time1 = [...time];
      time1[i] = zeroTime;
      times.push(time1);
      for (let j = i + 1; j < 4; j++) {
        let time2 = [...time1];
        time2[j] = zeroTime;
        times.push(time2);
        for (let k = j + 1; k < 4; k += 2) {
          let time3 = [...time2];
          time3[k] = zeroTime;
          times.push(time3);
        }
      }
    }
    times.push(time0);
    return times;
  },
};
