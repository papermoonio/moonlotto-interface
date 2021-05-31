import fetch from 'isomorphic-fetch';
import data from './example-data.json';

const subGraphURL = 'https://api.thegraph.com/subgraphs/name/mario-purestake/moonlotto-moonbase';

// Returns all public pools
export async function getLotterySubgraph() {
    let data = { data: [] };
    try {
        winners = await getLotteryData();
        if (data.winners.length === 0) {
            console.log(
                `[SubGraph] Load Error - No Data Returned. Defaulting To Example List.`
            );
            //data = lottoData.data;
        }
    } catch (error) {
        data = lottoData.data;
    }

    return data;
}

async function getLotteryData() {
    const query = `
    {
        rounds(first: 1000) {
          id
          index
          prize
          tickets {
            id
          }
        },
        players(first: 1000) {
          id
          address
          tickets {
            id
          }
        },
        ticket(first: 1000) {
            id
            address
            tickets {
              id
            }
        },
        players(first: 1000) {
            id
            address
            tickets {
              id
            }
          }
      }
    `;

    const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
        }),
    });

    const { data } = await response.json();
    console.log('--HERE')
    console.log(data);
    let pools = data.pools0.concat(data.pools1000);
    return { pools: pools };
}

getLotterySubgraph();
