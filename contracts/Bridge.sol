//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract Bridge is Ownable {
    uint256 private chainId;
    address validator;

    mapping(uint256 => bool) chains;
    mapping(string => address) tokens;
    mapping(bytes32 => bool) swaps;

    constructor(uint256 chainId_) {
        chainId = chainId_;
    }

    function setValidator(address _validator) external onlyOwner {
        validator = _validator;
    }

    function updateChainById(uint256 _chainId) external onlyOwner {
        chains[_chainId] = !chains[_chainId];
    }

    function includeToken(string calldata _symbol, address _token)
        external
        onlyOwner
    {
        tokens[_symbol] = _token;
    }

    function excludeToken(string calldata _symbol) external onlyOwner {
        tokens[_symbol] = address(0);
    }

    function swap(
        uint256 _id,
        uint256 _amount,
        address _recepient,
        uint256 _chainTo,
        string calldata _symbol
    ) external {
        require(chains[_chainTo], "recipient's chainId was not added");
        require(
            _chainTo != chainId,
            "Error: chainTo and chainFrom is the same"
        );
        require(
            tokens[_symbol] != address(0),
            "the token was not added to the bridge"
        );

        bytes32 hashedMessage = keccak256(
            abi.encodePacked(
                _id,
                _amount,
                _recepient,
                chainId,
                _chainTo,
                _symbol
            )
        );
        require(swaps[hashedMessage] == false, "swap already completed");

        Token(tokens[_symbol]).burn(msg.sender, _amount);
        swaps[hashedMessage] = true;
    }

    function hashMessage(bytes32 _message) private pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(abi.encodePacked(prefix, _message));
    }

    function redeem(
        uint256 _id,
        uint256 _amount,
        address _recepient,
        uint256 _chainFrom,
        uint256 _chainTo,
        string memory _symbol,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external {
        require(
            _chainTo == chainId,
            "Error: chainTo and chainFrom is the same"
        );
        require(
            tokens[_symbol] != address(0),
            "the token was not added to the bridge"
        );

        bytes32 hashedMessage = keccak256(
            abi.encodePacked(
                _id,
                _amount,
                _recepient,
                _chainFrom,
                _chainTo,
                _symbol
            )
        );

        address recoveredAddress = ecrecover(
            hashMessage(hashedMessage),
            _v,
            _r,
            _s
        );
        require(recoveredAddress == validator);

        Token(tokens[_symbol]).mint(_recepient, _amount);
    }
}
