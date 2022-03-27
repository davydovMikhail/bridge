require("@nomiclabs/hardhat-web3");

async function main() {

  const totalSupply = '10000'
  const name = 'Bridge Token'
  const symbol = 'UNITOK'

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(web3.utils.toWei(totalSupply, 'ether'), name, symbol);

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });