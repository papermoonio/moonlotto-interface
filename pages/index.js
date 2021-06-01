import React, { Component } from "react";
import { Container, Button, Menu, Grid, Icon } from "semantic-ui-react";
import Head from "next/head";
import * as ethers from "ethers";

import { Link } from "../routes";
import ParticipateComponent from "../components/participate-component";
import StatusComponent from "../components/status-component";
import WinnersComponent from "../components/winners-component";

class MoonLottoDashboard extends Component {
  // Initial State
  state = {
    account: "Not Connected",
    connected: false,
  };

  async componentDidMount() {
    // If already connected display account
    if (typeof ethereum !== "undefined" && ethereum.selectedAddress !== null) {
      console.log(ethereum);

      this.setState({
        account: ethers.utils.getAddress(ethereum.selectedAddress),
        connected: true,
      });
    }
  }

  onConnect = async () => {
    if (typeof ethereum === "undefined") {
      // MetaMask not detected
      this.setState({ account: "MetaMask not Detected" });
    } else {
      // MetaMask detected - check network
      if (ethereum.chainId !== "0x507") {
        this.setState({ account: "Only Moonbase Alpha Supported" });
      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        // Set account to state
        if (accounts) {
          this.setState({
            account: ethers.utils.getAddress(accounts[0]),
            connected: true,
          });
        }
      }
    }
  };

  render() {
    return (
      <Container>
        <Head>
          <title>MoonLotto Lottery</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
        </Head>
        <div style={{ paddingTop: "10px" }}></div>
        <Menu>
          <Link route="/">
            <a className="item">MoonLotto Lottery Dashboard</a>
          </Link>
          <Menu.Menu position="right">
            <a className="item"> {this.state.account} </a>
            {this.state.connected ? (
              <Button floated="right" icon labelPosition="left" color="green">
                <Icon name="check"></Icon>
                Connected
              </Button>
            ) : (
              <Button floated="right" icon labelPosition="left" onClick={this.onConnect} primary>
                <Icon name="plus square"></Icon>
                Connect MetaMask
              </Button>
            )}
          </Menu.Menu>
        </Menu>
        <br />
        <h2>🌚🌚 MoonLotto Test Lottery 🌚🌚</h2>
        <p>
          MoonLotto Lottery on Moonbase Alpha where you can win DEV tokens. <br />
          Draws are done every half hour if there are at least 10 participants. <br />
        </p>
        <Grid>
          <Grid.Column width={7} stretched verticalAlign="top">
            <StatusComponent account={this.state.account} />
          </Grid.Column>
          <Grid.Column width={1} stretched></Grid.Column>
          <Grid.Column width={8} stretched verticalAlign="top">
            <ParticipateComponent account={this.state.account} connected={this.state.connected} />
          </Grid.Column>
        </Grid>
        <br />
        <hr />
        <br />
        <WinnersComponent account={this.state.account} />
        <br />
        <p style={{ textAlign: "center" }}>
          Don't judge the code :) as it is for demostration purposes only. You can check the source
          code <a href="https://github.com/albertov19/moonlotto-interface">here</a>
        </p>
        <br />
      </Container>
    );
  }
}

export default MoonLottoDashboard;
