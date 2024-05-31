// imports
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { contractAddress, abi } from "./constants.js";

// add button on clicks
const connectBtn = document.getElementById("connectBtn");
const fundMeButton = document.getElementById("fundBtn");
const getContractBalanceBtn = document.getElementById("getContractBalanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.addEventListener("click", connect);
fundMeButton.addEventListener("click", fund);
getContractBalanceBtn.addEventListener("click", getContractBalance);
withdrawBtn.addEventListener("click", withdraw);

//  functions

async function connect() {
  if (typeof window.ethereum != "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectBtn.innerHTML = "Connected";
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
    } catch (error) {
      console.error("Failed to connect to metamask:", error);
    }
  } else {
    console.log("install metamask");
    alert("install metamask");
  }
}

async function fund() {
  const fundAmount = document.getElementById("amount").value;

  if (!fundAmount) return alert("invalid amount");

  if (typeof window.ethereum != "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const response = await contract.fund({
        value: ethers.parseEther(fundAmount.toString()),
      });
      
      await listenForTransactionMine(response);
      console.log("done");
      alert("Funded successfully");
      alert(balance);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("install metamask");
    alert("install metamask");
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const response = await contract.withdraw();
      console.log("cons withdraw")
      await listenForTransactionMine(response);
      console.log("done");
      alert("withdrawal successful.");
      alert(balance);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("install metamask");
    alert("install metamask");
  }
}

async function getContractBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(balance.toString());
      alert(ethers.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("install metamask");
    alert("install metamask");
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        resolve();
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
