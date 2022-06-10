#!/usr/bin/env node

const BN = require("bn.js");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const Web3 = require("web3");
const VotingSystem = require("../../client/contracts/VotingSystem");
const fs = require("fs");
const yargs = require("yargs");
const { signBlindedMessage } = require("../blind-secp256k1");
const path = require("path");
const os = require("os");

// Provider
const localProviderURL = "ws://localhost:8547";

(async () => {
  clear();

  const options = yargs
    .usage("Usage: -a <address>")
    .options("a", {
      alias: "address",
      describe: "Contract address",
      type: "string",
      demandOption: true,
    })
    .usage("Usage: -p <password>")
    .options("p", {
      alias: "password",
      describe: "Contract owner's keystore password",
      type: "string",
      demandOption: true,
    })
    .usage("Usage: -k <keystore>")
    .options("k", {
      alias: "key-store",
      describe: "Contract owner's keystore file",
      type: "string",
      demandOption: true,
    })
    .usage("Usage: -s <path>")
    .options("s", {
      alias: "signing-keys",
      describe: "Signing keys file's location",
      type: "string",
      demandOption: true,
    }).argv;

  const localProvider = new Web3.providers.WebsocketProvider(localProviderURL);
  const web3 = new Web3(localProvider);

  const keys = JSON.parse(fs.readFileSync(options.signingKeys, "utf-8"));

  const keyStore = JSON.parse(
    fs.readFileSync(path.join(options.keyStore), "utf-8")
  );
  const account = web3.eth.accounts.decrypt(keyStore, options.password);
  const contract = new web3.eth.Contract(VotingSystem.abi, options.address, {
    from: account.address,
  });
  const name = await contract.methods.name().call();

  console.log(
    chalk.yellow(
      figlet.textSync(`${name} Signer`, {
        horizontalLayout: "full",
      })
    )
  );

  const {
    eligibleVotersLog,
    eligibleVotersLogPath,
    registeredVotersLog,
    registeredVotersLogPath,
    votesLog,
    votesLogPath,
  } = initLogs(options.address);

  contract.events.AddedVoter({}, async (error, event) => {
    try {
      if (error) throw new Error(error);
      const { returnValues } = event;
      const { voter } = returnValues;
      const log = { voter };
      eligibleVotersLog.push(log);
      console.log(log);
    } catch (error) {
      console.error(error);
    }
  });

  contract.events.Registered({}, async (error, event) => {
    try {
      if (error) throw new Error(error);
      const { returnValues } = event;
      let { voter, blindedUUID } = returnValues;
      blindedUUID = new BN(blindedUUID);
      const signedBlindedUUID = signBlindedMessage(blindedUUID, keys.d, keys.k);
      const log = {
        voter,
        blindedUUID: blindedUUID.toString(16),
        signedBlindedUUID: signedBlindedUUID.toString(16),
      };

      await contract.methods.signBlindedUUID(voter, signedBlindedUUID).send();
      registeredVotersLog.push(log);
      console.log(log);
    } catch (error) {
      console.error(error);
    }
  });

  contract.events.Voted({}, async (error, event) => {
    try {
      if (error) throw new Error(error);
      const { returnValues } = event;
      const { voter, uuid, choice } = returnValues;
      const log = {
        voter,
        uuid,
        choice,
      };

      votesLog.push(log);
      console.log(log);
    } catch (err) {
      console.error(err);
    }
  });

  process.on("SIGINT", () => {
    fs.writeFileSync(votesLogPath, JSON.stringify(votesLog));
    fs.writeFileSync(eligibleVotersLogPath, JSON.stringify(eligibleVotersLog));
    fs.writeFileSync(
      registeredVotersLogPath,
      JSON.stringify(registeredVotersLog)
    );
    process.exit();
  });
})();

// HELPERS
const initLogs = (address) => {
  // Paths
  const logsDirPath = path.join(os.homedir(), "e-voting-logs", address);
  const eligibleVotersLogPath = path.join(logsDirPath, "eligile-voters.json");
  const registeredVotersLogPath = path.join(
    logsDirPath,
    "registered-voters.json"
  );
  const votesLogPath = path.join(logsDirPath, "votes.json");

  if (!fs.existsSync(logsDirPath))
    fs.mkdir(logsDirPath, { recursive: true }, (err) => {
      if (err) console.error(err);
    });

  let eligibleVotersLog = [];
  let registeredVotersLog = [];
  let votesLog = [];
  if (fs.existsSync(eligibleVotersLogPath))
    eligibleVotersLog = JSON.parse(
      fs.readFileSync(eligibleVotersLogPath, "utf-8")
    );
  if (fs.existsSync(registeredVotersLogPath))
    registeredVotersLog = JSON.parse(
      fs.readFileSync(registeredVotersLogPath, "utf-8")
    );
  if (fs.existsSync(votesLogPath))
    votesLog = JSON.parse(fs.readFileSync(votesLogPath, "utf-8"));

  return {
    eligibleVotersLog,
    eligibleVotersLogPath,
    registeredVotersLog,
    registeredVotersLogPath,
    votesLog,
    votesLogPath,
  };
};
