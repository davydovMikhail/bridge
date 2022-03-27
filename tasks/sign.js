const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");


task("sign", "getting VRS")
    .addParam("id", "id")
    .addParam("amount", "amount")
    .addParam("recepient", "recepient")
    .addParam("chainfrom", "chainfrom")
    .addParam("chainto", "chainto")
    .addParam("symbol", "symbol")
    .addParam("validator", "validator")
    .setAction(async function (taskArgs, hre) {
    
        let message = hre.web3.utils.soliditySha3(
            taskArgs.id,
            taskArgs.amount * 10**18,
            taskArgs.recepient,
            taskArgs.chainfrom,
            taskArgs.chainto,
            taskArgs.symbol       
            );
        let signature = await hre.web3.eth.sign(message, taskArgs.validator);
        let splitedSignature = hre.ethers.utils.splitSignature(signature);

        console.log("v: " + splitedSignature.v);
        console.log("r: " + splitedSignature.r);
        console.log("s: " + splitedSignature.s);
});