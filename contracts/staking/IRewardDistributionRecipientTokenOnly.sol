// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRewardDistributionRecipientTokenOnly {

    function rewardToken() external view returns(IERC20);

    function notifyRewardAmount(uint256 reward) external;
}
