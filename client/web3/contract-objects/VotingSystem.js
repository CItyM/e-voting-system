import {
  rawBallotsToJson,
  rawChoicesToJson,
  rawTimeToJson,
  rawVoterToJson,
  rawVoteToJson,
} from "../../helpers/raw-to-json";
import VotingSystemJSON from "../../contracts/VotingSystem.json";
import BN from "bn.js";

// VotingSystem smart contract wrapper
class VotingSystem {
  contract = null;

  constructor(web3, address, from) {
    try {
      const contract = new web3.eth.Contract(VotingSystemJSON.abi, address, {
        from: from,
      });
      this.contract = contract;
    } catch (error) {
      console.log(error);
    }
  }

  async name() {
    const name = await this.contract.methods.name().call();
    return name;
  }

  async registrationTime() {
    const rawTime = await this.contract.methods.getRegistrationTime().call();
    const bnTime = rawTimeToJson(rawTime);
    return bnTime;
  }

  async votingTime() {
    const rawTime = await this.contract.methods.getVotingTime().call();
    const bnTime = rawTimeToJson(rawTime);
    return bnTime;
  }

  async signerR() {
    const RX = await this.contract.methods.signerRX().call();
    const RY = await this.contract.methods.signerRY().call();
    return { RX: new BN(RX), RY: new BN(RY) };
  }

  async choices() {
    const rawChoices = await this.contract.methods.getChoices().call();
    const jsonChoices = rawChoicesToJson(rawChoices);
    return jsonChoices;
  }

  async voter(address) {
    const rawVoter = await this.contract.methods.voters(address).call();
    const jsonVoter = rawVoterToJson(rawVoter);
    return jsonVoter;
  }

  async eligibleVotersCount() {
    const count = await this.contract.methods.eligibleVotersCount().call();
    return count;
  }

  async registeredVotersCount() {
    const count = await this.contract.methods.registeredVotersCount().call();
    return count;
  }

  async alreadyVotedCount() {
    const count = await this.contract.methods.alreadyVotedCount().call();
    return count;
  }

  async owner() {
    return await this.contract.methods.owner().call();
  }

  async addVoter(voter) {
    await this.contract.methods.addVoter(voter).send();
  }

  async addVoters(voters) {
    await this.contract.methods.addVoters(voters).send();
  }

  async register(blindedUUID) {
    await this.contract.methods.register(blindedUUID).send();
  }

  async signBlindedUUID(voterAddresss, signedBlindedUUID) {
    await this.contract.methods
      .signBlindedUUID(voterAddresss, signedBlindedUUID)
      .send();
  }

  async vote(RX, RY, uuid, unblindedSignedUUID, choice) {
    await this.contract.methods
      .vote(
        new BN(RX, 16),
        new BN(RY, 16),
        new BN(uuid, 16),
        unblindedSignedUUID,
        new BN(choice)
      )
      .send();
  }

  async ballots() {
    const rawBallots = await this.contract.methods.getBallots().call();
    const jsonBallots = rawBallotsToJson(rawBallots);
    return jsonBallots;
  }

  async tallyVotes(uuids, choices) {
    await this.contract.methods.tallyVotes(uuids, choices).send();
  }

  async tallied() {
    return await this.contract.methods.tallied().call();
  }

  async votes(uuid) {
    const rawVote = await this.contract.methods.votes(new BN(uuid, 16)).call();
    console.log(rawVote);
    const jsonVote = rawVoteToJson(rawVote);
    return jsonVote;
  }
}

export default VotingSystem;
