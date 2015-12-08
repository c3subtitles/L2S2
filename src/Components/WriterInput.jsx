import { Connect } from '../Helper';
import { lineStart, line } from '../Services/socket';
import { Map } from 'immutable';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  room: state.currentRoom,
  user: state.user,
  shortcuts: state.shortcuts,
});

@Radium
@Connect(props)
export default class WriterInput extends React.Component {
  static propTypes = {
    room: React.PropTypes.object,
    shortcuts: React.PropTypes.instanceOf(Map),
    user: React.PropTypes.object,
  };
  static style = {
    marginBottom: 2,
  };
  componentDidMount() {
    this.refs.input.focus();
  }
  handleChange = e => {
    const { room, shortcuts }: { room: RoomType, shortcuts: Map<string, string> } = this.props;
    let line = e.target.value;
    shortcuts.filter(text => text).forEach((text, key) => {
      line = line.replace(new RegExp(key, 'g'), text);
    });
    e.target.value = line;
    lineStart(room.id, line);
  };
  handleKeyDown = e => {
    console.log(e);
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      const { room, user } = this.props;
      line(room.id, e.target.value, user);
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
