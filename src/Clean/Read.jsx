import { joinReadRoom, leaveReadRoom, primus } from './Service';
import Radium from 'radium';
import React from 'react';
import ReadLines from '../Components/ReadLines';

@Radium
export default class Read extends React.Component {
  state = {
    lines: [],
  };
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
      WebkitAlignItems: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
    },
  };
  componentWillMount() {
    const rawRoomId = location.search
    .substr(1, location.search.length)
    .split('=')[1];
    this.roomId = Number.parseInt(rawRoomId);
    joinReadRoom(this.roomId).then(lines => {
      this.setState({
        lines,
      });
    });
    primus.on('line', (roomId, text) => {
      if (roomId == this.roomId && text && text.trim().length > 0) {
        const { lines } = this.state;
        if (lines.length > 7) {
          lines.shift();
        }
        lines.push(text);
        this.setState({
          lines,
        });
      }
    });
    primus.on('reconnect', () => {
      joinReadRoom(this.roomId).then(lines => {
        lines = this.state.lines.concat(lines);
        this.setState({
          lines,
        });
      });
    });
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  render(): ReactElement {
    const style = Read.style;
    const { lines } = this.state;
    return (
      <div>
        <div style={style.wrapper}>
          <ReadLines alwaysUpdate lines={lines}/>
        </div>
      </div>
    );
  }
}
