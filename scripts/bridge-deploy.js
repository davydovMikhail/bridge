async function main() {

  const ids = {
    rinkeby: 4,
    ropsten: 3
  }

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(ids.ropsten);

  console.log("Bridge address:", bridge.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });