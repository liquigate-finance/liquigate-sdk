pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() public ERC20("TokenB", "TKB"){
        _mint(msg.sender, 1000000000000000000000000);
    }
}