import fetch from "isomorphic-fetch";
import * as ethers from "ethers";

const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/mario-purestake/moonlotto-moonbase";

export async function getCurrentRound() {
  const query = `
  {
    rounds(
      first: 1,
      orderBy: index,
      orderDirection: desc
    ) {
      index
      prize
      tickets {
        player {
          address
        }
      }
    }
  }
  `;

  let data = await fetchSubgraph(query);

  let currentRound = {};
  if (data && data.rounds && data.rounds.length) {
    currentRound = data.rounds[0];
  }

  const players = new Set();
  for (const ticket of currentRound.tickets) {
    players.add(ticket.player.address);
  }
  currentRound.players = [...players];

  return currentRound;
}

export async function getLastRoundsWinners(amount = 5) {
  const query = `
  {
    rounds(
      first: ${amount},
      orderBy: index,
      orderDirection: desc,
      where: {timestampEnd_not: null}
    ) {
      index
      prize
      tickets(where: {isWinner: true}) {
        player {
          address
        }
      }
    }
  }
  `;

  let data = await fetchSubgraph(query);

  for (const round of data.rounds) {
    const winner = round.tickets[0].player.address;
    round.winner = ethers.utils.getAddress(winner);
  }

  return data.rounds;
}

async function fetchSubgraph(query) {
  let data;
  try {
    const r = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    ({ data } = await r.json());
  } catch (error) {
    console.log(`Could not load the data from the remote Subgraph. Error: ${error}`);
    data = null;
  }

  return data;
}
