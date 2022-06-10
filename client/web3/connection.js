import detectEthereumProvider from "@metamask/detect-provider";

/**
 * @notice Connect
 * Connect the voter wallet to the app.
 * @param {*} handleOnLogIn
 */
export const connect = async (handleOnLogIn) => {
  const provider = await detectEthereumProvider();
  if (!provider) {
    window.alert("Install Meta Mask");
    return;
  }
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await handleOnLogIn(accounts[0], provider);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @notice Disconnect
 * Disconects the voter from the app.
 * @param {Function} handleOnLogOut
 */
export const disconnect = (handleOnLogOut) => {
  handleOnLogOut();
};
