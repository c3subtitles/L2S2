// @flow
import React from 'react';
import axios from 'axios';

type RoomStats = {
  lines: string,
  chars: string,
};

type State = {
  stats?: {
    connections: number,
    roomOne: RoomStats,
    roomTwo: RoomStats,
  },
};

export default class Stats extends React.Component {
  state: State = {};
  componentWillMount() {
    axios.get('/stats').then(stats => {
      this.setState({
        stats: stats.data,
      });
    });
  }
  render() {
    const { stats } = this.state;
    if (!stats) {
      return null;
    }
    return (
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <span>{stats.connections} Clients per Websocket (overall)</span>
        <span>{stats.roomOne.lines} Lines (Hall 1)</span>
        <span>{stats.roomOne.chars} Chars (Hall 1)</span>

        <span>{stats.roomTwo.lines} Lines (Hall 2)</span>
        <span>{stats.roomTwo.chars} Chars (Hall 2)</span>

      </div>
    );
  }
}
