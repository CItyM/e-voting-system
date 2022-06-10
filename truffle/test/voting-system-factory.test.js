const VotingSystemFactory = artifacts.require("VotingSystemFactory");
const {
  name,
  choices,
  registrationTimeStart,
  registrationTimeEnd,
  votingTimeStart,
  votingTimeEnd,
  signerRX,
  signerRY,
} = require("./input-values");
const { expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

contract("VotingSystemFactory", async ([owner, organizer]) => {
  before(async () => {
    factory = await VotingSystemFactory.new({ from: owner });
  });

  it("Create a new election", async () => {
    const receipt = await factory.create(
      name,
      choices,
      registrationTimeStart,
      registrationTimeEnd,
      votingTimeStart,
      votingTimeEnd,
      signerRX,
      signerRY,
      { from: organizer }
    );

    expectEvent(receipt, "Created");
    const votingSystem = await factory.contracts(0);
    expect(votingSystem.contractAddress).not.equals(ZERO_ADDRESS);
    expect(votingSystem.contractOwner).equals(organizer);
  });
});
