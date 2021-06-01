import web3 from "./web3.js";
const LotteryInterface = require("./abi/Lottery.json");
const ethers = require("ethers");

const LotteryInstance = (address, flag) => {
  switch (flag) {
    case 1:
      return new ethers.Contract(address, LotteryInterface.abi, web3().getSigner());
    default:
      return new ethers.Contract(address, LotteryInterface.abi, web3());
  }
};

export default LotteryInstance;
