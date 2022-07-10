import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

window.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
};

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
      const { lookUptokenIdToStarInfo } = this.meta.methods;
      const id = document.getElementById("lookid").value;
      try{
        let owner = await lookUptokenIdToStarInfo(id).call();
        if (!owner || owner.length == 0) {
          App.setStatus("Cannot find owner");
        } else {
          App.setStatus("Star owner of " + id  + ": " + owner);
        }
      }catch(e) {
        App.setStatus("Invalid input");
      }
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/82bd1c20b95c47e9b8eb44076582d9c0"),);
  }

  App.start();
});