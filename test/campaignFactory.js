const assert = require('assert');

const campaignFactory = artifacts.require('campaignFactory.sol');
const Campaign = artifacts.require('Campaign.sol');




contract(' campaignFactory ', (accounts) => {
    let campaignAddress;
    let factory;
    let campaign;

    beforeEach(async () => {
        factory = await campaignFactory.new();
        // campaign = await Campaign.new();

        await factory.createCampaign('100', {from : accounts[0]});
        [campaignAddress] = await factory.getDeployedCampaign();
        
        campaign = await Campaign.at(campaignAddress);
    });

    xit('checks for contract addresses' ,() => {
        
        assert.ok(factory.address);
        assert.ok(campaign.address);
        
    });

    xit('marks the caller as manager of the contract', async () => {
        const manager = await campaign.manager();
        assert.strictEqual(accounts[0], manager);
    });

    xit('allows to contribute and checks for the contributor', async () => {
        await campaign.contribute({from : accounts[1], value : 200});
        // let isContributor = await campaign.approvers(accounts[1]);
        // console.log(isContributor);
        // assert(isContributor);
    });
    xit('checks for minimum contribution', async () => {
        try {
            await campaign.contribute({from : accounts[2], value : 80});
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    xit('checks if the manager has the ability to Request for funds', async () => {
        await campaign.createRequest("buy batteries", "150", accounts[0], {from : accounts[0]});
        const request = await campaign.requests(0);
        console.log(request.description);
        assert.strictEqual("buy batteries", request.description);
    });

    it('processes requests',async () => {
        await campaign.contribute({from : accounts[1], value : web3.utils.toWei('10', 'ether')});
        await campaign.createRequest("chori", String(web3.utils.toWei('5', 'ether')), accounts[2], {from : accounts[0]});
        await campaign.approveRequest(0, {from : accounts[1]});
        await campaign.finalizeRequest(0,{from: accounts[0]});
        let balance = await web3.eth.getBalance(accounts[2]);
        balance = parseFloat(web3.utils.fromWei(balance, 'ether'));
        console.log(balance);
        assert(balance > 100);
    });
 });