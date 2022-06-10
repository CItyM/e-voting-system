// TODO: Write the correct errors

const VotingSystem = artifacts.require("VotingSystem");
const { expect } = require("chai");
const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const {
  voterAssertion,
  rawChoiceToJson,
  getZeroTimes,
  rawTimeToBN,
  rawBallotsToJson,
  rawVoterToJson,
} = require("./helpers");
const {
  name,
  emptyName,
  choices,
  emptyChoices,
  registrationTimeStart,
  registrationTimeEnd,
  votingTimeStart,
  votingTimeEnd,
  zero,
  zeroUUID,
  d,
  k,
  QX,
  QY,
  signerRX,
  signerRY,
  zeroKey,
} = require("./input-values");
const {
  blindMessage,
  signBlindedMessage,
  unblindSignedBlindedMessage,
  verify,
} = require("./blind-secp256k1");
const fs = require("fs");
const { v4 } = require("uuid");
const {} = require("./helpers");

contract("VotingSystem", async ([owner, ...voters]) => {
  let votingSystem;
  const numAdd = 6;
  const numRegister = 4;
  const numVote = 2;

  before(async () => {
    votingSystem = await VotingSystem.new(
      name,
      choices,
      registrationTimeStart,
      registrationTimeEnd,
      votingTimeStart,
      votingTimeEnd,
      signerRX,
      signerRY,
      { from: owner }
    );
  });

  describe("Adding voters", () => {
    it("Throw Ownable error when adding voters", async () => {
      for (const voter of voters) {
        await expectRevert.unspecified(
          votingSystem.addVoter(voter, { from: voter })
        );
      }
      await expectRevert.unspecified(
        votingSystem.addVoters(voters, { from: voters[0] })
      );
    });

    it("Throw ZeroAddress error when adding voters", async () => {
      await expectRevert.unspecified(
        votingSystem.addVoter(ZERO_ADDRESS, { from: owner })
      );
      await expectRevert.unspecified(
        votingSystem.addVoters([ZERO_ADDRESS], { from: owner })
      );
    });

    it("Add voters one by one successfuly", async () => {
      for (const voterAddress of voters.slice(0, numAdd / 2)) {
        const receipt = await votingSystem.addVoter(voterAddress, {
          from: owner,
        });
        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);
        expectEvent(receipt, "AddedVoter", { voter: voterAddress });
        voterAssertion(voter, voterAddress, zero, zero, false);
      }
    });

    it("Add multiple voters at once successfuly", async () => {
      await votingSystem.addVoters(voters.slice(numAdd / 2, numAdd), {
        from: owner,
      });

      for (const voterAddress of voters.slice(numAdd / 2, numAdd)) {
        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);
        voterAssertion(voter, voterAddress, zero, zero, false);
      }
    });

    it("Throw ExistingVoter error", async () => {
      for (const voterAddress of voters.slice(0, numAdd)) {
        await expectRevert.unspecified(
          votingSystem.addVoter(voterAddress, {
            from: owner,
          })
        );
      }
    });

    it("Default values are returned if the addres is not in votes", async () => {
      for (const voterAddress of voters.slice(0, numAdd)) {
        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);
        voterAssertion(voter, voterAddress, zero, zero, false);
      }
    });
  });

  describe("Registration, Signing, Voting", async () => {
    it("Throw ZeroUUID error", async () => {
      for (const voterAddress of voters.slice(0, numRegister)) {
        await expectRevert.unspecified(
          votingSystem.register(zeroUUID, {
            from: voterAddress,
          })
        );
      }
    });

    it("Register successfuly", async () => {
      for (let i = 0; i < numRegister; i++) {
        const voterAddress = voters[i];
        const uuid = v4();
        const { a, b, RX, RY, hm, blindedMessage } = blindMessage(
          uuid,
          signerRX,
          signerRY
        );

        const receipt = await votingSystem.register(blindedMessage, {
          from: voterAddress,
        });

        expectEvent(receipt, "Registered", {
          voter: voterAddress,
          blindedUUID: blindedMessage,
        });

        const voterData = {
          uuid: hm,
          a,
          b,
          RX,
          RY,
          blindedUUID: blindedMessage.toString(16),
        };
        fs.writeFileSync(
          `./test/voter-${i}-data.json`,
          JSON.stringify(voterData)
        );
      }
    });

    it("Registered voters have the correct data", async () => {
      for (let i = 0; i < numRegister; i++) {
        const voterAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i}-data.json`, "utf8")
        );
        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);
        voterAssertion(
          voter,
          voterAddress,
          new BN(voterData.blindedUUID, 16),
          zero,
          true
        );
      }
    });

    it("Not retgistered votes return default values", async () => {
      for (const voterAddress of voters.slice(numRegister, numAdd)) {
        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);
        voterAssertion(voter, voterAddress, zero, zero, false);
      }
    });

    it("Throw InvalidVoter error when registering", async () => {
      for (const voterAddress of voters.slice(numAdd)) {
        const uuid = v4();
        const { blindedMessage } = blindMessage(uuid, signerRX, signerRY);

        await expectRevert.unspecified(
          votingSystem.register(blindedMessage, {
            from: voterAddress,
          })
        );
      }
    });

    it("Throw InvalidVoter error when signing", async () => {
      for (const voterAddress of voters.slice(numAdd)) {
        const uuid = v4();
        const { blindedMessage } = blindMessage(uuid, signerRX, signerRY);
        const signedBlindedMessage = signBlindedMessage(blindedMessage, d, k);

        await expectRevert.unspecified(
          votingSystem.signBlindedUUID(voterAddress, signedBlindedMessage, {
            from: owner,
          })
        );
      }
    });

    it("Throw Ownable error when signing", async () => {
      for (let i = 0; i < numRegister; i++) {
        const voterAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i}-data.json`, "utf8")
        );
        const blindedUUID = new BN(voterData.blindedUUID, 16);
        const signedBlindedMessage = signBlindedMessage(blindedUUID, d, k);
        await expectRevert.unspecified(
          votingSystem.signBlindedUUID(voterAddress, signedBlindedMessage, {
            from: voterAddress,
          })
        );
      }
    });

    it("Sign voter's blindedUUID successfully", async () => {
      for (let i = 0; i < numRegister; i++) {
        const voterAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i}-data.json`, "utf8")
        );
        const blindedUUID = new BN(voterData.blindedUUID, 16);
        const signedBlindedMessage = signBlindedMessage(blindedUUID, d, k);
        await votingSystem.signBlindedUUID(voterAddress, signedBlindedMessage, {
          from: owner,
        });

        voterData.signedBlindedUUID = signedBlindedMessage.toString(16);
        fs.writeFileSync(
          `./test/voter-${i}-data.json`,
          JSON.stringify(voterData)
        );
      }
    });

    it("Voters' data is correct after signing", async () => {
      for (let i = 0; i < numRegister; i++) {
        const voterAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i}-data.json`, "utf8")
        );
        const blindedUUID = new BN(voterData.blindedUUID, 16);
        const signedBlindedUUID = new BN(voterData.signedBlindedUUID, 16);

        const rawVoter = await votingSystem.voters(voterAddress);
        const voter = rawVoterToJson(rawVoter);

        voterAssertion(
          voter,
          voterAddress,
          blindedUUID,
          signedBlindedUUID,
          true
        );
      }
    });

    it("Throw NotVotingPeriod error when try voting before period", async () => {
      for (let i = numAdd; i < numAdd + numVote / 2; i++) {
        const voterAddress = voters[i - numAdd];
        const votingAddress = voters[i];

        const rawVoter = await votingSystem.voters(voterAddress, {
          from: voterAddress,
        });
        const voter = rawVoterToJson(rawVoter);
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i - numAdd}-data.json`, "utf8")
        );

        const unblindedSignedMessage = unblindSignedBlindedMessage(
          voter.signedBlindedUUID,
          voterData.a,
          voterData.b
        );

        await expectRevert.unspecified(
          votingSystem.vote(
            new BN(voterData.RX, 16),
            new BN(voterData.RY, 16),
            new BN(voterData.uuid, 16),
            unblindedSignedMessage,
            i % choices.length,
            {
              from: votingAddress,
            }
          )
        );
      }
    });

    it("Vote successfuly", async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 120 * 1000);
      });

      for (let i = numAdd; i < numAdd + numVote / 2; i++) {
        const votingAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i - numAdd}-data.json`, "utf8")
        );

        const unblindedSignedMessage = unblindSignedBlindedMessage(
          voterData.signedBlindedUUID,
          voterData.a,
          voterData.b
        );

        const receipt = await votingSystem.vote(
          new BN(voterData.RX, 16),
          new BN(voterData.RY, 16),
          new BN(voterData.uuid, 16),
          unblindedSignedMessage,
          i % choices.length,
          {
            from: votingAddress,
          }
        );

        expectEvent(receipt, "Voted", {
          voter: votingAddress,
          uuid: new BN(voterData.uuid, 16),
        });

        voterData.unblindedSignedUUID = unblindedSignedMessage.toString(16);
        fs.writeFileSync(
          `./test/voter-${i - numAdd}-data.json`,
          JSON.stringify(voterData)
        );
      }
    }).timeout(50 * 1000);

    it("Throw ZeroKey error when voting", async () => {
      for (let i = numAdd; i < numAdd + numVote / 2; i++) {
        const votingAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i - numAdd}-data.json`, "utf8")
        );
        const keys = [
          [new BN(voterData.RX), zeroKey],
          [zeroKey, new BN(voterData.RY)],
          [zeroKey, zeroKey],
        ];
        for (const key of keys) {
          await expectRevert.unspecified(
            votingSystem.vote(
              ...key,
              new BN(voterData.uuid, 16),
              new BN(voterData.unblindedSignedUUID, 16),
              i % choices.length,
              {
                from: votingAddress,
              }
            )
          );
        }
      }
    });

    it("Throw ZeroUUID error when voting", async () => {
      for (let i = numAdd; i < numAdd + numVote / 2; i++) {
        const votingAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i - numAdd}-data.json`, "utf8")
        );
        await expectRevert.unspecified(
          votingSystem.vote(
            new BN(voterData.RX, 16),
            new BN(voterData.RY, 16),
            zeroUUID,
            new BN(voterData.unblindedSignedUUID, 16),
            i % choices.length,
            {
              from: votingAddress,
            }
          )
        );
      }
    });

    it("Throw AlreadyVoted error when voting", async () => {
      for (let i = numAdd; i < numAdd + numVote / 2; i++) {
        const votingAddress = voters[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i - numAdd}-data.json`, "utf8")
        );
        await expectRevert.unspecified(
          votingSystem.vote(
            new BN(voterData.RX, 16),
            new BN(voterData.RY, 16),
            new BN(voterData.uuid, 16),
            new BN(voterData.unblindedSignedUUID, 16),
            i % choices.length,
            {
              from: votingAddress,
            }
          )
        );
      }
    });

    it("Throw NotRegistrationPeriod error when try to register after period", async () => {
      for (let i = numRegister; i < numAdd; i++) {
        const voterAddress = voters[i];
        const uuid = v4();
        const { blindedMessage } = blindMessage(uuid, signerRX, signerRY);
        await expectRevert.unspecified(
          votingSystem.register(blindedMessage, {
            from: voterAddress,
          })
        );
      }
    });

    it("Throw Ownable error when tally votes", async () => {
      const rawBallots = await votingSystem.getBallots();
      const jsonBallots = rawBallotsToJson(rawBallots);
      const uuids = [];
      const choices = [];
      for (let i = 0; i < numVote / 2; i++) {
        const ballot = jsonBallots[i];
        const valid = verify(
          ballot.uuid,
          ballot.unblindedSignedUUID,
          ballot.RX,
          ballot.RY,
          QX,
          QY
        );

        if (valid) {
          uuids.push(ballot.uuid);
          choices.push(ballot.choice);
        }
      }

      await expectRevert.unspecified(
        votingSystem.tallyVotes(uuids, choices, { from: voters[0] })
      );
    });

    it("Throw InvalidVote error when tally votes", async () => {
      const rawBallots = await votingSystem.getBallots();
      const jsonBallots = rawBallotsToJson(rawBallots);
      const uuids = [];
      const choices = [];
      for (let i = 0; i < numVote / 2; i++) {
        const ballot = jsonBallots[i];
        const valid = verify(
          ballot.uuid,
          ballot.unblindedSignedUUID,
          ballot.RX,
          ballot.RY,
          QX,
          QY
        );

        if (valid) {
          for (let i = 0; i < numVote; i++) {
            uuids.push(ballot.uuid);
            choices.push(ballot.choice);
          }
        }
      }

      await expectRevert.unspecified(
        votingSystem.tallyVotes(uuids, choices, { from: voters[0] })
      );
    });

    it("Tally votes", async () => {
      const rawBallots = await votingSystem.getBallots();
      const jsonBallots = rawBallotsToJson(rawBallots);
      const uuids = [];
      const choices = [];
      for (let i = 0; i < numVote / 2; i++) {
        const ballot = jsonBallots[i];
        const voterData = JSON.parse(
          fs.readFileSync(`./test/voter-${i}-data.json`, "utf8")
        );
        const valid = verify(
          ballot.uuid,
          ballot.unblindedSignedUUID,
          ballot.RX,
          ballot.RY,
          QX,
          QY
        );
        expect(ballot.RX).is.bignumber.eq(new BN(voterData.RX, 16));
        expect(ballot.RY).is.bignumber.eq(new BN(voterData.RY, 16));
        expect(ballot.uuid).is.bignumber.eq(new BN(voterData.uuid, 16));
        expect(ballot.unblindedSignedUUID).is.bignumber.eq(
          new BN(voterData.unblindedSignedUUID, 16)
        );
        expect(valid).is.true;
        if (valid) {
          uuids.push(ballot.uuid);
          choices.push(ballot.choice);
        }
      }

      await votingSystem.tallyVotes(uuids, choices, { from: owner });
    });

    it("Throw AlreadyTallied error when tally votes", async () => {
      const rawBallots = await votingSystem.getBallots();
      const jsonBallots = rawBallotsToJson(rawBallots);
      const uuids = [];
      const choices = [];
      for (let i = 0; i < numVote / 2; i++) {
        const ballot = jsonBallots[i];
        const valid = verify(
          ballot.uuid,
          ballot.unblindedSignedUUID,
          ballot.RX,
          ballot.RY,
          QX,
          QY
        );

        if (valid) {
          uuids.push(ballot.uuid);
          choices.push(ballot.choice);
        }
      }

      await expectRevert.unspecified(
        votingSystem.tallyVotes(uuids, choices, { from: voters[0] })
      );
    });
  });

  describe("Getters", () => {
    it("Get name", async () => {
      const returnedName = await votingSystem.name();
      expect(returnedName).to.equal(name);
    });

    it("Get registration time", async () => {
      const rawTime = await votingSystem.getRegistrationTime();
      const [returnedRegistrationTimeStart, returnedRegistrationTimeEnd] =
        rawTimeToBN(rawTime);
      expect(returnedRegistrationTimeStart).is.bignumber.equal(
        registrationTimeStart
      );
      expect(returnedRegistrationTimeEnd).is.bignumber.equal(
        registrationTimeEnd
      );
    });

    it("Get voting time", async () => {
      const rawTime = await votingSystem.getVotingTime();
      const [returnedVotingTimeStart, returnedVotingTimeEnd] =
        rawTimeToBN(rawTime);
      expect(returnedVotingTimeStart).is.bignumber.equal(votingTimeStart);
      expect(returnedVotingTimeEnd).is.bignumber.equal(votingTimeEnd);
    });

    it("Get signer R", async () => {
      const returnedSignerRX = await votingSystem.signerRX();
      const returnedSignerRY = await votingSystem.signerRY();
      expect(returnedSignerRX).to.be.bignumber.eq(signerRX);
      expect(returnedSignerRY).to.be.bignumber.eq(signerRY);
    });
  });
});
