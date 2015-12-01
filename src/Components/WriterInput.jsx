import { Connect } from '../Helper';
import { lineStart, line } from '../Services/socket';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  room: state.currentRoom,
  user: state.user,
});

@Radium
@Connect(props)
export default class WriterInput extends React.Component {
  static propTypes = {
    room: React.PropTypes.object,
    user: React.PropTypes.object,
  };
  static style = {
    marginBottom: 2,
  };
  componentDidMount() {
    this.refs.input.focus();
  }
  handleChange = e => {
    const { room } = this.props;
    lineStart(room.id, e.target.value);
  };
  handleKeyDown = e => {
    console.log(e);
    if (e.key === 'Enter') {
      const { room } = this.props;
      line(room.id, e.target.value);
      e.target.value = '';
    }
  };
  render() {
    const { user } = this.props;
    return (
      <input defaultValue={user.currentLine} onKeyDown={this.handleKeyDown} onChange={this.handleChange} ref="input" style={WriterInput.style}/>
    );
  }
}
