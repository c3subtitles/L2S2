// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { lineStart, line } from 'Service/Socket';
import RoomService from 'Service/Room';
import LoginService from 'Service/Login';

type State = {
  line: string,
}

export default class WriterInput extends React.PureComponent {
  state: State = {
    line: '',
  };
  componentDidMount() {
    this.refs.input.focus();
  }
  handleChange = (e: SyntheticKeyboardEvent) => {
    // $FlowFixMe
    const line = e.target.value;
    this.setState({
      line,
    });
    lineStart(RoomService.room.id, line, LoginService.user.id);
  };
  handleKeyDown = (e: KeyboardEvent) => {
    // $FlowFixMe
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      // $FlowFixMe
      line(RoomService.room.id, e.target.value, 'fo');
      // $FlowFixMe
      e.target.value = '';
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
      // $FlowFixMe
      e.target.value = '';
      lineStart(RoomService.room.id, e.target.value, LoginService.user.id);
    }
  };
  render() {
    const { line } = this.state;
    return (
      <input value={line} onKeyDown={this.handleKeyDown} onChange={this.handleChange} ref="input" className={css(style.line)}/>
    );
  }
}

const style = StyleSheet.create({
  line: {
    marginBottom: 2,
  },
});
