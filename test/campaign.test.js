const assert = require ('assert');
const ganache = require ('ganache-cli');
const Web3 = require ('web3');  //Constructor of web3 assigned to Web3
const web3 = new Web3(ganache.provider()); //New instance of Web3 using the ganache web provider

const compiledFactory = require ('../ethereum/build/CampaignFactory.json');     //Requiring the entire json file instead of the individual interface and bytecode
const compiledCampaign = require ('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))    //Gives web3 the idea of the compiled contract by Parsing the JSON file for interface
    .deploy({data: compiledFactory.bytecode})       //Deploys the contract's data ie the bytecode
    .send({from:accounts[0], gas:'1000000'});       //Sends the actual transaction

    await factory.methods.createCampaign('100').send({
        from :accounts[0],
        gas:'1000000'
    });
    
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();  //ES2016 syntax, same as assigning array output from getDeployedCampaigns to a const address and then assigning addresses[0] to campaignAddress
    campaign = await new web3.eth.Contract(         //this syntax instead of deploy, send syntax from above because this contract is already deployed and we just need address to interact with it
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns',()=>{
    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it('allows contribution and marks contributer as approver', async()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        });
        const approverBool = await campaign.methods.approvers(accounts[1]).call();
        assert(approverBool);
    });

    it('requires contribution to be greater than minimum contribution', async()=>{
        try{
			await campaign.methods.contribute().send({
				from:accounts[0],
				value: '99'
			});
			assert(false);
		}
		catch(err){
			assert(err);
		}
    });

    it('allows manager to create a payment request', async()=>{
        await campaign.methods.createRequest(
            'Buy Batteries',
            '100',
            accounts[1]
        ).send({
            from: accounts[0],
            gas : '1000000'
        });
        const request= await campaign.methods.requests(0).call();
        assert.equal('Buy Batteries', request.description);
    });

    it('processes requests', async()=>{
        
        let balance1 = await web3.eth.getBalance(accounts[1]);
        balance1 = web3.utils.fromWei(balance1,'ether');
        balance1 = parseFloat(balance1);

        await campaign.methods.contribute().send({
            from:accounts[0],
            value:web3.utils.toWei('10','ether')
        });
        await campaign.methods
        .createRequest(
            'A', web3.utils.toWei('5','ether'), accounts[1]
        )
        .send({
                from: accounts[0], 
                gas:'1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });
        
        await campaign.methods.finaliseRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });

        let balance2 = await web3.eth.getBalance(accounts[1]);
        balance2 = web3.utils.fromWei(balance2,'ether');
        balance2 = parseFloat(balance2);

        assert(balance2-balance1>=4);
    });
});