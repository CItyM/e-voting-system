import VotingSystemFactoryJSON from "../../contracts/VotingSystemFactory.json";
import { rawContractsToJson } from "../../helpers/raw-to-json";

// VotingSystemFactory smart contract wrapper
class VotingSystemFactory {
  contract = null;

  constructor(contract) {
    this.contract = contract;
  }

  static async init(web3, from) {
    const networkId = await web3.eth.getChainId();
    const deploymentNetwork = VotingSystemFactoryJSON.networks[networkId];
    const contract = new web3.eth.Contract(
      VotingSystemFactoryJSON.abi,
      deploymentNetwork && deploymentNetwork.address,
      { from: from }
    );
    return new VotingSystemFactory(contract);
  }

  async create(
    name,
    choices,
    ethRegistrationStartDate,
    ethRegistrationEndDate,
    ethVotingStartDate,
    ethVotingEndDate,
    RX,
    RY
  ) {
    await this.contract.methods
      .create(
        name,
        choices,
        ethRegistrationStartDate,
        ethRegistrationEndDate,
        ethVotingStartDate,
        ethVotingEndDate,
        RX,
        RY
      )
      .send();
  }

  async contract(index) {
    const contract = await this.contract.methods.contracts(index).call();
    return contract;
  }

  async getContracts() {
    const rawContracts = await this.contract.methods.getContracts().call();
    const jsonContracts = rawContractsToJson(rawContracts);
    return jsonContracts;
  }
}

export default VotingSystemFactory;
