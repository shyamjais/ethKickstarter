var Campaign = artifacts.require("./Campaign.sol");
var campaignFactory = artifacts.require("./campaignFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(campaignFactory);
};
