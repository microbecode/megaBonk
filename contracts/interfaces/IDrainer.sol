// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.5;

interface IDrainer {

  /**
   * @dev allows withdrawal of ETH in case it was sent by accident
   * @param _beneficiary address where to send the eth.
   */
  function drainEth(address payable _beneficiary) external;

  /**
  * @dev allows withdrawal of ERC20 token in case it was sent by accident
  * @param _token address of ERC20 token.
  * @param _beneficiary address where to send the tokens.
  * @param _amount amount to send.
  */
  function drainTokens(address _token, address _beneficiary, uint _amount) external;
}