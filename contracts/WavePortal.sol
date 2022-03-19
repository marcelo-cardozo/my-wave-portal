// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // automatically initialized to 0, "state variable", it's stored permanently in contract storage
    mapping(address => uint256) waveCountByAddress;
    uint256 totalWaves;
    event NewWave(address indexed from, string message, uint256 timestamp);
    
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() {
        console.log("this is the contract constructor");
    }

    function wave(string memory _message) public {
        console.log("%s waved w/ message %s", msg.sender, _message);

        waveCountByAddress[msg.sender] += 1;
        totalWaves += 1;
        
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("%d times waved", totalWaves);
        return totalWaves;
    }

    function getMyTotalWaves() public view returns (uint256) {
        console.log("%s has waved %d times", msg.sender, waveCountByAddress[msg.sender]);
        return waveCountByAddress[msg.sender];
    }
}
