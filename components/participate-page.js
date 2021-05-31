import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import LotteryInstance from '../ethereum/lottery';
import { lottery } from '../address.json';
import { getLotterySubgraph } from './subgraph-fetch'
import * as ethers from 'ethers';

class Table extends Component {
   // Nextjs uses this function to render this first server-side
   static async getInitialProps() { 
      getValues();
     }

   state = {
      recipient: '',
      ticketPrice: 'N/A',
      prizeAmount: 'N/A',
      roundPlayers: 'N/A',
      loading: false,
      errorMessage: '',
   };

   async componentDidMount() {
      this.getValues();
   }

   componentWillUnmount() {
      clearInterval(this.intervalID);
   }

   onSubmit = async (event) => {
      event.preventDefault();

      this.setState({ loading: true, errorMessage: '' });

      // Check Metamask and Chain ID
      if (
         typeof window.ethereum !== 'undefined' &&
         ethereum.chainId === '0x507'
      ) {
         // Contract info
         const contractInstance = LotteryInstance(lottery, 1);

         try {
            let recipient = this.state.recipient;
            if (!recipient) {
               await contractInstance.joinLottery({value: ethers.utils.parseEther('1')})
            } else {
               await contractInstance.giftTicket(ethers.utils.getAddress(recipient),{
                  value: ethers.utils.parseEther('1')
               });
            }
         } catch (err) {
            this.setState({
               loading: false,
               errorMessage: err.message,
            });
         }

         this.setState({ loading: false });
         return;

      } else {
         // Error message because MetaMask not found or Network Id not correct
         this.setState({
            loading: false,
            errorMessage:
               'Please install MetaMask or connect it to Moonbase Alpha',
         });
      }
   };

   getValues = async () => {
      try {
         // Contract Fetch
         const contractInstance = LotteryInstance(lottery, 0);
         const ticketPrice =  ethers.utils.formatEther(await contractInstance.ticketPrice());
         const prizeAmount =  ethers.utils.formatEther(await contractInstance.prizeAmount());
         
         // Subgraph Fetch
         const rounds = (await getLotterySubgraph()).rounds;
         const round = rounds[rounds.length-1];
         const roundPlayers = round.players.length;

         // Update value, time and lastJobID
         this.setState({
            ticketPrice: ticketPrice.toString(),
            prizeAmount: prizeAmount.toString(),
            roundPlayers: roundPlayers.toString(),
         });
         

         this.intervalID = setTimeout(this.getValues.bind(this), 5000);
      } catch (error) {
         console.log(error);
      }
   };

   render() {
      return (
         <div>
            <h2>🌚🌚 MoonLotto Test Lottery 🌚🌚</h2>
            <p>
               MoonLotto Lottery on Moonbase Alpha where you can win DEV tokens. <br />
               Draws are done every hour if there are at least 10 participants. <br />
            </p>
            <h3>Current Round</h3>
            <table className='ui celled table'>
               <tbody>
                  <tr>
                     <td><b>Ticket Prize</b></td>
                     <td>{this.state.ticketPrice} DEV</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td><b>Current Prize</b></td>
                     <td>{this.state.prizeAmount} DEV</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td><b>Total Players</b></td>
                     <td>{this.state.roundPlayers}</td>
                  </tr>
               </tbody>
            </table>

            <h3>Participate in MoonLotto</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
               <Form.Field>
                  <label>Recipient of Lottery Ticket:</label>
                  <input
                     placeholder='Address of Recipient (Leave empty if it is for you)'
                     value={this.state.recipient}
                     onChange={(event) =>
                        this.setState({ recipient: event.target.value })
                     }
                  />
               </Form.Field>
               <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
               />
               <Button type='submit' loading={this.state.loading} primary>
                  Submit Tx
               </Button>
            </Form>
            <br />
         </div>
      );
   }
}

export default Table;
