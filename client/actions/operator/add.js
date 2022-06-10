const add = async (contract, voters) => {
  const addressArray = [];
  voters.forEach((voter) => addressArray.push(voter.address));
  await contract.object.addVoters(addressArray);
};

export default add;
