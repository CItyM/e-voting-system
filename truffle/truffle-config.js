module.exports = {
  networks: {
    evoting: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1234",
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.11",
      // settings: {
      //   optimizer: {
      //     enabled: true,
      //     runs: 200,
      //   },
      //   evmVersion: "london",
      // },
    },
  },
};
