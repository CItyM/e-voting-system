import { rawContractsToJson } from "../helpers/raw-to-json";
import VotingSystemV2 from "./contract-objects/VotingSystem";

/**
 * @notice Lote vote contracts
 * Load all the vote contracts from the factory contract
 * @param  {string} account
 * @param  {Web3} web3
 * @param  {VotingSystemFactory} factoryContract
 * @returns An array of contracts.
 */
export const loadVoteContracts = async (account, web3, factoryContract) => {
  const contracts = rawContractsToJson(await factoryContract.getContracts());
  const jsonContracts = [];
  contracts.forEach(async (contract) => {
    const object = new VotingSystemV2(web3, contract.contractAddress, account);
    const name = await object.name();
    const registrationTime = await object.registrationTime();
    const votingTime = await object.votingTime();
    const choices = await object.choices();
    const tallied = await object.tallied();
    const signerR = await object.signerR();
    const voter = await object.voter(account);
    let isAVoter = false;
    if (voter.voterAddress !== "0x0000000000000000000000000000000000000000") {
      isAVoter = true;
    }

    jsonContracts.push({
      address: contract.contractAddress,
      owner: contract.contractOwner,
      object,
      tallied,
      name,
      registrationTime,
      votingTime,
      choices,
      signerR,
      voter,
      isAVoter,
    });
  });
  return jsonContracts;
};
