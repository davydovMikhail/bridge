require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('solidity-coverage');
require('dotenv').config();
require("./tasks")

const { API_URL_RINKEBY, API_URL_ROPSTEN, PRIVATE_KEY} = process.env;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: API_URL_RINKEBY, 
      accounts: [`0x${PRIVATE_KEY}`]
    },
    ropsten: {
      url: API_URL_ROPSTEN, 
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};
