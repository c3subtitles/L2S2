// @flow
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

type Props = {
  room?: Object,
  shortcuts?: Map<string, string>,
  user?: Object,
};

@Connect(props)
@Radium
export default class WriterInput extends React.Component {
  props: Props;
  static style = {
    marginBottom: 2,
  };
  componentDidMount() {
    this.refs.input.focus();
  }
  handleChange = (e: Event) => {
    const { room, shortcuts, user } = this.props;
    if (!room || !shortcuts || !user) {
      return;
    }
    // $FlowFixMe
    let line = e.target.value;
    shortcuts.filter(text => text).forEach((text, key) => {
      line = line.replace(new RegExp(key, 'g'), text);
    });
    // $FlowFixMe
    e.target.value = line;
    lineStart(room.id, line, user.id);
  };
  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    // $FlowFixMe
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      const { room, user } = this.props;
      // $FlowFixMe
      line(room.id, e.target.value, user);
      // $FlowFixMe
      e.target.value = '';
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
      // $FlowFixMe
      e.target.value = '';
    }
  };
  shouldComponentUpdate(nextProps: Object) {
    return this.props.shortcuts !== nextProps.shortcuts;
  }
  render() {
    const { user } = this.props;
    return (
      <input defaultValue={user ? user.currentLine : ''} onKeyDown={this.handleKeyDown} onChange={this.handleChange} ref="input" style={WriterInput.style}/>
    );
  }
}
