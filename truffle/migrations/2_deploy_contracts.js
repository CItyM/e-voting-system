const VotingSystemFactory = artifacts.require("VotingSystemFactory");

module.exports = function (deployer) {
  deployer.deploy(VotingSystemFactory);
};
