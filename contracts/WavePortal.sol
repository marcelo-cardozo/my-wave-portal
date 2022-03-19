// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    // automatically initialized to 0, "state variable", it's stored permanently in contract storage
    uint256 totalWaves;
    uint256 private seed;

    mapping(address => uint256) public lastWavedAt;
    mapping(address => uint256) waveCountByAddress;
    Wave[] waves;

    event NewWave(address indexed from, string message, uint256 timestamp);

    constructor() payable {
        console.log("this is the contract constructor");

        // set initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15 minutes"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        console.log("%s waved w/ message %s", msg.sender, _message);

        waveCountByAddress[msg.sender] += 1;
        totalWaves += 1;

        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        // 50% chance to win the reward
        if (seed < 50 || waves.length == 1) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("%d times waved", totalWaves);
        return totalWaves;
    }

    function getMyTotalWaves() public view returns (uint256) {
        console.log(
            "%s has waved %d times",
            msg.sender,
            waveCountByAddress[msg.sender]
        );
        return waveCountByAddress[msg.sender];
    }
}
