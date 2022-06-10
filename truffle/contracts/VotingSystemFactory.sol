// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./VotingSystem.sol";

contract VotingSystemFactory {
    struct Contract {
        address contractAddress;
        address contractOwner;
    }

    Contract[] public contracts;

    event Created(
        address indexed contractAddress,
        address indexed ownerAddress
    );

    /**
     * @notice Create
     * Creates and deploys to the blockcahin new VotingSystem contract.
     * The owner of the new contract is the msg.sender.
     * @param _name: Name of the vote.
     * @param _choices: A array of choices.
     * @param _registrationStart: The start of the registration period.
     * @param _registrationEnd: The end of the registration period.
     * @param _votingStart: The start of the voting period.
     * @param _votingEnd: The end of the voting period.
     * @param _RX: The X value of the operators signing public key.
     * @param _RY: The Y value of the operators signing public key.p
     */
    function create(
        string memory _name,
        string[] memory _choices,
        uint256 _registrationStart,
        uint256 _registrationEnd,
        uint256 _votingStart,
        uint256 _votingEnd,
        uint256 _RX,
        uint256 _RY
    ) public {
        VotingSystem votingSystem = new VotingSystem(
            _name,
            _choices,
            _registrationStart,
            _registrationEnd,
            _votingStart,
            _votingEnd,
            _RX,
            _RY
        );
        address contractAddress = address(votingSystem);
        votingSystem.transferOwnership(msg.sender);
        contracts.push(Contract(contractAddress, msg.sender));
        emit Created(contractAddress, msg.sender);
    }

    /**
     * @notice Get Contracts
     * @return An array of Conracts.
     */
    function getContracts() public view returns (Contract[] memory) {
        return contracts;
    }
}
