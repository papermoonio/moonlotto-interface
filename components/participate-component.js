import React, { Component } from "react";
import { Button, Form, Message, Grid, Icon, Label } from "semantic-ui-react";
import * as ethers from "ethers";

import LotteryInstance from "../ethereum/lottery";
import { lottery } from "../address.json";

class ParticipateComponent extends Component {
  static async getInitialProps() {
    return {
      account: "",
    };
  }

  // Initial State
  state = {
    recipient: "",
    justForMe: false,
    errorMessage: "",
    loading: false,
    ticketPrice: "0",
  };

  async componentDidMount() {
    const contractInstance = LotteryInstance(lottery, 0);
    const ticketPrice = await contractInstance.ticketPrice();

    this.setState({ ticketPrice: ticketPrice.toString() });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    // Check Metamask and Chain ID
    if (typeof window.ethereum === "undefined" || ethereum.chainId !== "0x507") {
      // Error message because MetaMask not found or Network Id not correct
      this.setState({
        loading: false,
        errorMessage: "Please install MetaMask or connect it to Moonbase Alpha",
      });

      this.setState({ loading: false });
      return;
    }

    // Contract info
    const contractInstance = LotteryInstance(lottery, 1);

    try {
      if (this.state.justForMe) {
        await contractInstance.joinLottery({
          value: this.state.ticketPrice,
        });
      } else {
        let recipient = this.state.recipient;
        recipient = ethers.utils.getAddress(recipient);

        await contractInstance.giftTicket(recipient, {
          value: this.state.ticketPrice,
        });
      }
    } catch (err) {
      this.setState({
        errorMessage: err.message,
      });
    }

    this.setState({ loading: false });
  };

  handleJustForMe = async (event) => {
    const justForMe = event.target.checked;
    let account;
    try {
      account = ethers.utils.getAddress(this.props.account);
    } catch (error) {
      account = " ";
    }

    if (justForMe) {
      this.setState({
        justForMe: justForMe,
        recipient: account,
      });
    } else {
      this.setState({
        justForMe: justForMe,
        recipient: "",
      });
    }
  };

  render() {
    return (
      <div>
        <h3>Participate in MoonLotto</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Ticket recipient</label>
            <input
              disabled={this.state.justForMe}
              placeholder="Address of Recipient"
              value={this.state.recipient}
              onChange={(event) => this.setState({ recipient: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <Grid>
              <Grid.Column width={1} stretched verticalAlign="middle">
                <input
                  type="checkbox"
                  value={this.state.justForMe}
                  onChange={this.handleJustForMe}
                />
              </Grid.Column>
              <Grid.Column width={9} stretched verticalAlign="middle">
                <label>I want to buy a ticket for my address</label>
              </Grid.Column>
            </Grid>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button type="submit" as="div" labelPosition="right" fluid>
            <Button primary loading={this.state.loading} fluid>
              <Icon name="external alternate" />
              Submit on MetaMask
            </Button>
            <Label
              as="a"
              basic
              pointing="left"
              style={{
                width: "30%",
                textAlign: "middle",
                display: "block",
                lineHeight: "150%",
              }}
            >
              {ethers.utils.formatEther(this.state.ticketPrice)} DEV
            </Label>
          </Button>
        </Form>
        <br />
      </div>
    );
  }
}

export default ParticipateComponent;
