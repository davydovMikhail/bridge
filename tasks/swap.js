const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-web3");

task("swap", "swap")
    .addParam("id", "id") 
    .addParam("amount", "amount") 
    .addParam("recepient", "recepient") 
    .addParam("chainto", "chainTo") 
    .addParam("symbol", "bridge's address") 
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Bridge", process.env.BRIDGE_RINKEBY);
        try {
            await contract.swap(taskArgs.id, web3.utils.toWei(taskArgs.amount, 'ether'), taskArgs.recepient, taskArgs.chainto, taskArgs.symbol);
            console.log('swaped');
        } catch (e) {
            console.log('error', e);
        }
    });