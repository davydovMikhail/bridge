const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("Bridge", function () {
  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    validator = (await hre.ethers.getSigners())[19].address;
    TokenF = await ethers.getContractFactory("Token");
    BridgeF = await ethers.getContractFactory("Bridge");
    primaryTotalSupply = parseEther("10000");
    symbol = "UNITOK";
    tokenFrom = await TokenF.connect(owner).deploy(primaryTotalSupply, "Token From", symbol);
    tokenTo = await TokenF.connect(owner).deploy(primaryTotalSupply, "Token To", symbol);
    chainFrom = 4;
    chainTo = 97;
    bridgeFrom = await BridgeF.connect(owner).deploy(chainFrom)
    bridgeTo = await BridgeF.connect(owner).deploy(chainTo)
    await bridgeFrom.connect(owner).setValidator(validator)
    await bridgeTo.connect(owner).setValidator(validator)
    await bridgeFrom.connect(owner).updateChainById(chainTo)
    await bridgeTo.connect(owner).updateChainById(chainFrom)
    await bridgeFrom.connect(owner).includeToken(symbol, tokenFrom.address)
    await bridgeTo.connect(owner).includeToken(symbol, tokenTo.address)
    tokenFrom.connect(owner).setBridgeAddress(bridgeFrom.address)
    tokenTo.connect(owner).setBridgeAddress(bridgeTo.address)
  })


  it("main loop", async function () {
    const balance = parseEther('100');
    await tokenFrom.connect(owner).transfer(user1.address, balance);
    const id = 1
    await bridgeFrom.connect(user1).swap(id, balance, user2.address, chainTo, symbol);
    expect(await tokenFrom.balanceOf(user2.address)).to.equal(0);
    const message = hre.web3.utils.soliditySha3(
      id,
      balance,
      user2.address,
      chainFrom,
      chainTo,
      symbol
    )
    const signature = await hre.web3.eth.sign(message, validator);
    let splitedSignature = hre.ethers.utils.splitSignature(signature);
    await bridgeTo.connect(user2).redeem(id, balance, user2.address, chainFrom, chainTo, symbol, splitedSignature.v, splitedSignature.r, splitedSignature.s);
    expect(await tokenTo.balanceOf(user2.address)).to.equal(balance);
  });
});
