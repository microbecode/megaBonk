// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/ICallable.sol";
import "./Drainer.sol";

contract BonkMigrator is Ownable, ReentrancyGuard, Drainer, ICallable {

  using SafeMath for uint;

  uint public constant CLAIM_PERIOD = 7 days;

  IERC20 public oldToken;

  IERC20 public newToken;

  uint public deadline;

  mapping(address => uint) public migrated;

  uint public totalMigrated;

  event Migrated(address indexed _recipient, uint _amount, uint _timestamp);

  constructor(address _oldToken, address _newToken)
  {
    require(_oldToken != address(0), "Invalid old token address");
    require(_newToken != address(0), "Invalid new token address");

    oldToken = IERC20(_oldToken);
    newToken = IERC20(_newToken);

    deadline = _getNow() + CLAIM_PERIOD;
  }

  modifier beforeDeadline() {
    require(_getNow() <= deadline, "Too late");
    _;
  }

  modifier onlyOldBonkToken() {
    require(msg.sender == address(oldToken), "Caller is not the old token");
    _;
  }

  /**
  * @dev callback function that is called by BONK token.
  * @param _from who sent the tokens.
  * @param _tokens how many tokens were sent.
  * @param _data extra call data.
  * @return success.
  */
  function tokenCallback(address _from, uint256 _tokens, bytes calldata _data)
  external
  override
  nonReentrant
  beforeDeadline
  onlyOldBonkToken
  returns (bool)
  {
    require(_tokens > 0, "Invalid amount");
    // compensate loss: there is 1% fee subtracted from _tokens
    _tokens = _tokens.mul(110).div(100);
    _migrate(_from, _tokens);
    return true;
  }

  function migrateAll()
  external
  returns (bool)
  {
    uint balance = oldToken.balanceOf(msg.sender);
    return migrate(balance);
  }

  function migrate(uint _amount)
  public
  nonReentrant
  beforeDeadline
  returns (bool)
  {
    require(_amount > 0, "Invalid amount");
    require(oldToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
    _migrate(msg.sender, _amount);
    return true;
  }

  function drainTokens(address _token, address _beneficiary, uint _amount)
  public
  override
  {
    require(_getNow() > deadline, "Too early");
    super.drainTokens(_token, _beneficiary, _amount);
  }

  function _migrate(address _recipient, uint _amount)
  internal
  {
    migrated[_recipient] = migrated[_recipient].add(_amount);
    totalMigrated = totalMigrated.add(_amount);

    require(newToken.transfer(_recipient, _amount), "Tokens transfer failed");
    emit Migrated(_recipient, _amount, _getNow());
  }

  function _getNow()
  internal
  view
  returns (uint)
  {
    return block.timestamp;
  }
}