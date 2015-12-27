import { joinReadRoom, nextTalk, leaveReadRoom, primus } from './Service';
import NextTalk from '../Components/NextTalk';
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
      marginLeft: 50,
      marginRight: 50,
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'center',
      WebkitAlignItems: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
    },
    outer: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      WebkitAlignItems: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'center',
    },
  };
  setState(state, cb) {
    if (state.lines && state.lines.length <= 0) {
      nextTalk(this.roomId).then(talk => {
        this.setState({
          nextTalk: talk,
        });
      });
    }
    super.setState(state, cb);
  }
  componentWillMount() {
    // setInterval(() => {
    //   let { lines } = this.state;
    //   const refDate = new Date();
    //   lines = lines.filter(l => !l.timeout || l.timeout < refDate);
    //   this.setState({
    //     lines,
    //   });
    // }, 45000);
    const rawRoomId = location.search
    .substr(1, location.search.length)
    .split('=')[1];
    this.roomId = Number.parseInt(rawRoomId);
    joinReadRoom(this.roomId).then(lines => {
      while (lines.length > 3) {
        lines.shift();
      }
      this.setState({
        lines,
      });
    });
    primus.on('line', (roomId, text, userId, color, rawTimeout) => {
      if (roomId == this.roomId && text && text.trim().length > 0) {
        const { lines } = this.state;
        if (lines.length >= 3) {
          lines.shift();
        }
        let timeout;
        if (rawTimeout) {
          timeout = new Date(rawTimeout);
        }
        lines.push({
          text,
          timeout,
        });
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
    const { lines, nextTalk } = this.state;
    return (
      <div style={[lines.length <= 0 && style.outer]}>
        {
          lines.length > 0 && (<div style={style.wrapper}>
            <ReadLines fontSize="5em" alwaysUpdate lines={lines.map(l => l.text)}/>
          </div>
        )}
        {lines.length <= 0 && (
          <NextTalk talk={nextTalk}/>
        )}
      </div>
    );
  }
}
