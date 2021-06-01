import React, { Component } from "react";
import * as ethers from "ethers";

import { lottery } from "../address.json";
import LotteryInstance from "../ethereum/lottery";
import { getCurrentRound } from "../lib/subgraph-fetch";

class StatusComponent extends Component {
  static async getInitialProps() {
    return {
      account: "",
    };
  }

  // Initial State
  state = {
    roundIndex: "N/A",
    ticketPrice: "N/A",
    prizeAmount: "N/A",
    roundPlayers: "N/A",
    numTickets: "N/A",
    myTickets: "N/A",
  };

  async componentDidMount() {
    await this.onUpdate();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  onUpdate = async () => {
    try {
      // Contract Fetch
      const contractInstance = LotteryInstance(lottery, 0);
      const ticketPrice = ethers.utils.formatEther(await contractInstance.ticketPrice());

      // Subgraph Fetch
      const currentRound = await getCurrentRound();
      const prizeAmount = ethers.utils.formatEther(currentRound.prize);
      const roundPlayers = currentRound.players.length;
      const numTickets = currentRound.tickets.length;
      const myTickets = currentRound.tickets.filter(
        (ticket) => ticket.player.address.toLowerCase() === this.props.account.toLowerCase()
      );

      this.setState({
        roundIndex: currentRound.index.toString(),
        ticketPrice: ticketPrice.toString(),
        prizeAmount: prizeAmount.toString(),
        roundPlayers: roundPlayers.toString(),
        numTickets: numTickets,
        myTickets: myTickets.length,
      });

      this.intervalID = setTimeout(this.onUpdate.bind(this), 5000);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        {/* <h3>Ticket</h3>
        <table className="ui celled table">
          <tbody>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Ticket Price</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.ticketPrice} DEV</td>
            </tr>
          </tbody>
        </table> */}

        <h3>Current Round</h3>
        <table className="ui celled table">
          <tbody>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Round Index</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.roundIndex}</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Current Prize</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.prizeAmount} DEV</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Total Players</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.roundPlayers}</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>Total Tickets</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.numTickets}</td>
            </tr>
            <tr>
              <td style={{ width: "60%" }}>
                <b>My tickets</b>
              </td>
              <td style={{ textAlign: "right" }}>{this.state.myTickets}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default StatusComponent;
