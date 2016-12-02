import React from 'react';
import axios from 'axios';

export default class Stats extends React.Component {
  state = {};
  componentWillMount() {
    axios.get('/stats').then(stats => {
      this.setState({
        stats,
      });
    });
  }
  render() {
    const { stats } = this.state;
    return (
      <div>{stats}</div>
    );
  }
}
