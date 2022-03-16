// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // automatically initialized to 0, "state variable", it's stored permanently in contract storage
    mapping(address => uint256) waveByAddress;
    uint256 totalWaves;

    constructor() {
        console.log(
            "Hey hey hey, you might be a contract but you are not smart ;)"
        );
    }

    function wave() public {
        waveByAddress[msg.sender] += 1;
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("%d times waved", totalWaves);
        return totalWaves;
    }

    function getMyTotalWaves() public view returns (uint256) {
        console.log("%s has waved %d times", msg.sender, waveByAddress[msg.sender]);
        return waveByAddress[msg.sender];
    }
}
