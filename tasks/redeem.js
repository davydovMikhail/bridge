const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-web3");

task("redeem", "redeem")
    .addParam("id", "id") 
    .addParam("amount", "amount") 
    .addParam("recepient", "recepient") 
    .addParam("chainfrom", "chainFrom") 
    .addParam("chainto", "chainTo") 
    .addParam("symbol", "symbol") 
    .addParam("v", "v") 
    .addParam("r", "v") 
    .addParam("s", "v") 
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Bridge", process.env.BRIDGE_ROPSTEN);
        try {
            await contract.redeem(taskArgs.id, web3.utils.toWei(taskArgs.amount, 'ether'), taskArgs.recepient, taskArgs.chainfrom, taskArgs.chainto, taskArgs.symbol, taskArgs.v, taskArgs.r, taskArgs.s);
            console.log('redeemed');
        } catch (e) {
            console.log('error', e);
        }
    });