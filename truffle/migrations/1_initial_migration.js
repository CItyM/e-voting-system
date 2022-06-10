const Migrations = artifacts.require("Migrations");

/**
 *
 * @param {*} deployer
 */
module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
