import React, { Component } from "react";
import * as ethers from "ethers";

import { getLastRoundsWinners } from "../lib/subgraph-fetch";

class WinnersComponent extends Component {
  // Nextjs uses this function to render this first server-side
  static async getInitialProps() {
    this.setState({
      roundWinners: [],
      loading: false,
      errorMessage: "",
    });
  }

  state = {
    roundWinners: [],
  };

  async componentDidMount() {
    await this.onUpdate();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  onUpdate = async () => {
    try {
      // Subgraph Fetch
      const lastRoundsWinners = await getLastRoundsWinners(5);

      this.setState({
        roundWinners: lastRoundsWinners.map((round) => {
          return {
            index: round.index,
            winner: round.winner,
            prize: round.prize,
          };
        }),
      });

      this.intervalID = setTimeout(this.onUpdate.bind(this), 5000);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const winners = [];
    for (const round of this.state.roundWinners) {
      winners.push(
        <tbody key={round.index}>
          <tr>
            <td>{round.index}</td>
            <td>{round.winner}</td>
            <td>{ethers.utils.formatEther(round.prize.toString())} DEV</td>
          </tr>
        </tbody>
      );
    }

    return (
      <div>
        <h3>Last 5 rounds winners</h3>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Round Index</th>
              <th>Address of winner</th>
              <th>Prize won</th>
            </tr>
          </thead>

          {winners}
        </table>
      </div>
    );
  }
}

export default WinnersComponent;
