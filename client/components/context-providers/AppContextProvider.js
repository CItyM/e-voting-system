import { useState } from "react";
import Web3 from "web3";
import VotingSystemFactory from "../../web3/contract-objects/VotingSystemFactory";
import { loadVoteContracts } from "../../web3/loader";
import sleep from "../../helpers/sleep";
import AppContext from "../../context/AppContext";
import { upload } from "../../helpers/key-file-helpers";

export default function AppContextProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [loggedAccount, setAccount] = useState("");
  const [factoryContract, setFactoryContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [keys, setKeys] = useState();
  const [voters, setVoters] = useState([{ address: "" }]);

  const handleOnFileChange = (e) => {
    upload(e, setKeys);
  };

  const handleOnLogIn = async (account, provider) => {
    const web3 = new Web3(provider);
    const networkId = await web3.eth.getChainId();

    if (networkId === 1234) {
      await loadFactoryContract(account, web3);
      await sleep(1000);
      setIsLogged(true);
      setAccount(account);
    } else {
      alert("Wrong network");
    }
  };

  const handleOnLogOut = () => {
    setIsLogged(false);
    setAccount("");
    setFactoryContract(null);
  };

  const loadFactoryContract = async (account, web3) => {
    try {
      const factoryContract = await VotingSystemFactory.init(web3, account);
      const jsonContracts = await loadVoteContracts(
        account,
        web3,
        factoryContract
      );
      setFactoryContract(factoryContract);
      setContracts(jsonContracts);
    } catch (error) {
      console.error(error);
    }
  };

  const values = {
    isLogged,
    contracts,
    loggedAccount,
    factoryContract,
    keys,
    voters,
    setVoters,
    handleOnFileChange,
    handleOnLogIn,
    handleOnLogOut,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
