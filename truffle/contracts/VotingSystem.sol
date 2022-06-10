// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting System
 * @author Marin I. Karadzhov 马睿
 * @notice This is an instance of a vote, deployed by a factory
 * for every new vote
 */

contract VotingSystem is Ownable {
    struct Choice {
        string choice;
        uint256 votes;
    }

    struct Voter {
        address voterAddress;
        uint256 blindedUUID;
        uint256 signedBlindedUUID;
        bool registered;
    }

    struct Vote {
        bool voted;
        uint256 choice;
    }

    struct Ballot {
        uint256 RX;
        uint256 RY;
        uint256 uuid;
        uint256 unblindedSignedUUID;
        uint256 choice;
    }

    string public name;

    uint256 public registrationStart;
    uint256 public registrationEnd;
    uint256 public votingStart;
    uint256 public votingEnd;

    uint256 public signerRX;
    uint256 public signerRY;

    uint256 public alreadyVotedCount;
    uint256 public eligibleVotersCount;
    uint256 public registeredVotersCount;

    bool public tallied;

    Choice[] public choices;

    Ballot[] public ballots;

    /**
     * @notice Voters
     * A mapping with voter’s address as a key and a struct Voter as value.
     */
    mapping(address => Voter) public voters;

    /**
     * @notice Voters
     * A mapping with voter’s UUID as a key and a struct Vote as value.
     */
    mapping(uint256 => Vote) public votes;

    event AddedVoter(address indexed voter);
    event Registered(address indexed voter, uint256 indexed blindedUUID);
    event Voted(
        address indexed voter,
        uint256 indexed uuid,
        uint256 indexed choice
    );

    /**
     * @notice Check if a voter is eligible or not
     * @param _voterAddress: The address of the given voter
     */
    modifier isEligibleVoter(address _voterAddress) {
        require(
            voters[_voterAddress].voterAddress != address(0),
            "Error: InvalidVoter"
        );
        _;
    }

    /**
     * @notice Constructor
     * Initialize a vote. All the parameters are immutable once set.
     * The name of the vote must not be empty string. The array of
     * choices must not be empty, or contain empty strings. The value
     * of registration start timestamp must be lesser than the
     * registration end timestamp. The value of voting start timestamp
     * must be lesser than the voting end timestamp, but greater than
     * or equal to the registration end time. Finally the operators
     * public key values must not be zero.
     * @param _name: Name of the vote.
     * @param _choices: A array of choices.
     * @param _registrationStart: The start of the registration period.
     * @param _registrationEnd: The end of the registration period.
     * @param _votingStart: The start of the voting period.
     * @param _votingEnd: The end of the voting period.
     * @param _RX: The X value of the operators signing public key.
     * @param _RY: The Y value of the operators signing public key.
     */
    constructor(
        string memory _name,
        string[] memory _choices,
        uint256 _registrationStart,
        uint256 _registrationEnd,
        uint256 _votingStart,
        uint256 _votingEnd,
        uint256 _RX,
        uint256 _RY
    ) {
        require(bytes(_name).length != 0, "Error: EmptyName");
        require(_choices.length != 0, "Error: EmptyChoices");
        require(
            _registrationStart != 0 &&
                _registrationEnd != 0 &&
                _votingStart != 0 &&
                _votingEnd != 0,
            "Error: ZeroTime"
        );
        require(
            _registrationStart < _registrationEnd,
            "Error: RegistrationTimeError"
        );
        require(_registrationEnd <= _votingStart, "Error: TimeError");
        require(_votingStart < _votingEnd, "Error: VotingTimeError");
        require(_RX != 0 && _RY != 0, "Error: ZeroKey");

        name = _name;
        _addChoices(_choices);
        registrationStart = _registrationStart;
        registrationEnd = _registrationEnd;
        votingStart = _votingStart;
        votingEnd = _votingEnd;
        signerRX = _RX;
        signerRY = _RY;
    }

    /**
     * @notice Add choices
     * Add the choices of the vote.
     * @param _choices: A string array of choices
     * @dev
     */
    function _addChoices(string[] memory _choices) private {
        uint256 length = _choices.length;
        for (uint256 i = 0; i < length; ) {
            require(bytes(_choices[i]).length != 0, "Error: EmptyChoices");

            choices.push(Choice(_choices[i], 0));
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Add a single voter
     * Perform validation checks on the voter's address and
     * then adds a Voter to the contract.
     * @param _voterAddress: The address of the given voter
     * @dev The function is called by addVoters for clean code
     * purpoces.
     */
    function _addVoter(address _voterAddress) private {
        require(_voterAddress != address(0), "Error: ZeroAddress");
        require(
            voters[_voterAddress].voterAddress == address(0),
            "Error: ExistingVoter"
        );

        Voter storage voter = voters[_voterAddress];
        voter.voterAddress = _voterAddress;

        emit AddedVoter(_voterAddress);

        unchecked {
            ++eligibleVotersCount;
        }
    }

    /**
     * @notice Add voters
     * The operator adds the eligible voters' addresses to the contract.
     * @param _voterAddresses: An array of voter addresses.
     */
    function addVoters(address[] memory _voterAddresses) public onlyOwner {
        uint256 length = _voterAddresses.length;
        for (uint256 i = 0; i < length; ) {
            address voterAddress = _voterAddresses[i];
            _addVoter(voterAddress);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Register to vote
     * The function is called by the voter himself in order to upload
     * the blinded UUID to the contract to be signed. Marking the
     * voter as register, giving him ability to vote in the voting
     * period. The function can be executed only during the registration
     * period by only eligible voters.
     * @param _blindedUUID: The blinded value of the voters UUID.
     */
    function register(uint256 _blindedUUID) public isEligibleVoter(msg.sender) {
        require(_blindedUUID != 0, "Error: ZeroUUID");
        require(
            block.timestamp > registrationStart &&
                block.timestamp < registrationEnd,
            "Error: NotRegistrationPeriod"
        );

        Voter storage voter = voters[msg.sender];
        voter.registered = true;
        voter.blindedUUID = _blindedUUID;

        emit Registered(msg.sender, _blindedUUID);

        unchecked {
            ++registeredVotersCount;
        }
    }

    /**
     * @notice Set voter's signed blinded UUID
     * The operator signs the blinded UUID of the voter offchain
     * and uploads it to the contract using this function.
     * @param _voterAddress: The address of the given voter.
     * @param _signedBlindedUUID: The address of the given voter
     */
    function signBlindedUUID(address _voterAddress, uint256 _signedBlindedUUID)
        public
        onlyOwner
        isEligibleVoter(_voterAddress)
    {
        require(_signedBlindedUUID != 0, "Error: ZeroSignedBlindedUUID");
        require(
            voters[_voterAddress].signedBlindedUUID == 0,
            "Error: AlreadySigned"
        );

        Voter storage voter = voters[_voterAddress];
        voter.signedBlindedUUID = _signedBlindedUUID;
    }

    /**
     * @notice Vote
     * The voter cast his vote using this function. It takes all
     * the values required to compose a Ballot and cast it. The
     * voter’s public key values must not be zero. Same goes for
     * the UUID and the unblinded signed UUID. This function can
     * be executed only during voting period.
     * @param _RX: The X value of the voter's public key
     * @param _RY: The Y value of the voter's public key
     * @param _uuid: Voter's uuid
     * @param _unblindedSignedUUID: Voter's unblinded signed uuid
     * @param _choice: Voter's choice
     */
    function vote(
        uint256 _RX,
        uint256 _RY,
        uint256 _uuid,
        uint256 _unblindedSignedUUID,
        uint256 _choice
    ) public {
        require(
            block.timestamp > votingStart && block.timestamp < votingEnd,
            "Error: NotVotingPeriod"
        );
        require(_RX != 0 && _RY != 0, "Error: ZeroKey");
        require(
            _uuid != 0 && _unblindedSignedUUID != 0,
            "Error: ZeroUUID and ZeroUnblindedSignedUUID"
        );

        ballots.push(Ballot(_RX, _RY, _uuid, _unblindedSignedUUID, _choice));

        require(votes[_uuid].voted == false, "Error: AlreadyVoted");

        Vote storage userVote = votes[_uuid];
        userVote.voted = true;

        emit Voted(msg.sender, _uuid, _choice);
    }

    /**
     * @notice Tally a single vote
     * Records the vote of an user.
     * The votes of only valid and not already tallied voters
     * can be tallied.
     * @param _uuid: Voter's uuid
     * @param _choice: Voter's coresponding choice
     * @dev To check if the vote was tallied previously the
     * function require the choice of the corespondinding uuid
     * to be 0 (the default value). Then to record vote the coice's
     * value is incremented by 1 to prevent choice with value 0 to
     * be tagged as already tallied.
     */
    function _tallyVote(uint256 _uuid, uint256 _choice) private {
        require(votes[_uuid].voted, "Error: InvalidVote");
        require(votes[_uuid].choice == 0, "Error: AlreadyTallied");

        Vote storage userVote = votes[_uuid];
        userVote.choice = _choice + 1;

        Choice storage choice = choices[_choice];
        ++choice.votes;
    }

    /**
     * @notice Tally the votes
     * The function tally the results after they have been verified
     * as valid by the operator. Requires the time of execution to be
     * past the voting end time. Can be called only once by the operator.
     * @param _uuids: An array of voters' UUIDs
     * @param _choices: An array of voters' corresponding  choices
     */
    function tallyVotes(uint256[] memory _uuids, uint256[] memory _choices)
        public
        onlyOwner
    {
        require(block.timestamp > votingEnd, "Error: NotTallyPeriod");
        require(tallied == false, "Error: AlreadyTallied");

        uint256 length = _uuids.length;
        for (uint256 i = 0; i < length; ) {
            uint256 voterUUID = _uuids[i];
            uint256 voterChoice = _choices[i];
            _tallyVote(voterUUID, voterChoice);
            unchecked {
                ++i;
            }
        }
        tallied = true;
    }

    /**
     * @notice Get choices
     * @return Array of type Choice with all the choices.
     */
    function getChoices() public view returns (Choice[] memory) {
        return choices;
    }

    /**
     * @notice Get ballots
     * @return Array of type Ballot with all the ballots.
     */
    function getBallots() public view returns (Ballot[] memory) {
        return ballots;
    }

    /**
     * @notice Get registration time
     * @return Tupple of the registrationStart and registrationEnd.
     */
    function getRegistrationTime() public view returns (uint256, uint256) {
        return (registrationStart, registrationEnd);
    }

    /**
     * @notice Get voting time
     * @return Tupple of the votingStart and votingEnd.
     */
    function getVotingTime() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }
}
