// @flow
import { joinReadRoom, nextTalk, leaveReadRoom, primus } from './Service';
import Radium from 'radium';
import React from 'react';
import ReadLines from '../Components/ReadLines';
import { List } from 'immutable';

type State = {
  lines: Line[],
  nextTalk?: Talk,
};

@Radium
export default class Read extends React.Component {
  roomId: number;
  state: State = {
    lines: [],
  };
  static style = {
    wrapper: {
      alignItems: 'flex-start',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginLeft: 50,
      marginRight: 50,
      overflow: 'hidden',
      position: 'relative',
    },
    outer: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  };
  setState(state: Object, cb?: Function) {
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
    this.roomId = Number.parseInt(rawRoomId, 10);
    joinReadRoom(this.roomId).then(lines => {
      // while (lines.length > 5) {
      //   lines.shift();
      // }
      this.setState({
        lines,
      });
    });
    primus.on('line', (roomId, text, userId, color, hash, rawTimeout) => {
      /* eslint-disable */
      if (roomId == this.roomId && text && text.trim().length > 0) {
        /* eslint-enable */
        const { lines } = this.state;
        let timeout;
        if (rawTimeout) {
          timeout = new Date(rawTimeout);
        }
        lines.push({
          text,
          color,
          timeout,
          userId,
          hash,
        });
        if (lines.length > 20) {
          lines.shift();
        }
        this.setState({
          lines,
        });
      }
    });
    primus.on('reconnect', () => {
      joinReadRoom(this.roomId).then(lines => {
        this.setState({
          lines: this.state.lines.concat(lines),
        });
      });
    });
  }
  componentWillUnmount() {
    leaveReadRoom(this.roomId);
  }
  render() {
    const style = Read.style;
    const { lines } = this.state;
    return (
      <div style={[lines.length <= 0 && style.outer]}>
        {
          lines.length > 0 && (<div style={style.wrapper}>
            <ReadLines fontSize="65px" alwaysUpdate smooth lines={List(lines)}/>
          </div>
        )}
        {/* {lines.length <= 0 && (
          <NextTalk talk={nextTalk}/>
        )} */}
      </div>
    );
  }
}
