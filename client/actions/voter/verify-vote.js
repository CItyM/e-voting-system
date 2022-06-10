const verifyVote = async (contract, keys) => {
  const vote = await contract.object.votes(keys.uuid);
  console.log(vote);
  alert(`You voter for: ${contract.choices[vote.choice].choice}`);
};

export default verifyVote;
