// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

//account 0: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30
//priv key 0: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

//arbiter: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
//priv arbiter: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

//arbiter2: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0
//priv2: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

//benef: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71
//priv: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

contract Escrow {
	address public arbiter1;
	address public arbiter2;
	address public beneficiary;
	address public depositor;

	uint public approveCount = 0;

	constructor(address _arbiter1, address _arbiter2, address _beneficiary) payable {
		arbiter1 = _arbiter1;
		arbiter2 = _arbiter2;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter1 || msg.sender == arbiter2);
		if (approveCount <= 1){
			approveCount++;
		}  
		if (approveCount == 2){
			uint balance = address(this).balance;
			(bool sent, ) = payable(beneficiary).call{value: balance}("");
			require(sent, "Failed to send Ether");
			emit Approved(balance);
		}
	}
}
