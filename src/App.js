import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    enterMessage: '',
    winnerMessage: ''
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onEnter = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ enterMessage: 'Waiting on transaction...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ enterMessage: 'You have been entered!'});
    this.refresh();
  };

  selectWinner = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ winnerMessage: 'Selecting Winner...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ winnerMessage: 'If you are the winner you should see the ether in your account!'});
    this.refresh();
  }

  render() {
    return (
      <div className="App">
        <h1>Lottery Smart Contract</h1>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />
        <form onSubmit={this.onEnter}>
          <h3>Good Luck!</h3>
          <label>Amount of ether to enter</label>
          <input 
            value = {this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
          <button>Enter</button>
        </form>
        <h4>{this.state.enterMessage}</h4>
        <p />
        <hr />
        <h3>Ready to Pick a Winner?</h3>
        <button onClick={this.selectWinner}>Pick the winner!</button>
        <h4>{this.state.winnerMessage}</h4>
      </div>
    );
  }
}

export default App;
