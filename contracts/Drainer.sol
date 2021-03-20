// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IDrainer.sol";

abstract contract Drainer is IDrainer, Ownable {

  function drainEth(address payable _beneficiary)
  public
  onlyOwner
  virtual
  override
  {
    uint balance = address(this).balance;
    // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
    _beneficiary.call{ value : balance}("");
  }

  function drainTokens(address _token, address _beneficiary, uint _amount)
  public
  onlyOwner
  virtual
  override
  {
    require(_amount > 0, "0 amount");
    IERC20(_token).transfer(_beneficiary, _amount);
  }
}
