// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);

}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNNumber;
    mapping(address => uint256)  public votingPowerSpent;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNNumber = _targetBlockNumber;
        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPower = votingPower(msg.sender);
        require(votingPower >= amount, "TokenizedBallot: trying to vote more than allowed");
        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNNumber) -
                votingPowerSpent[account];
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}