// @flow
import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom } from '../Actions/rooms';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  lines: state.readLines,
});

@Connect(props)
@Radium
export default class CleanReadInterface extends React.Component {
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
    },
  };
  componentWillMount() {
    const { roomId } = this.props.params;
    joinReadRoom(Number.parseInt(roomId, 10));
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  render() {
    const { lines } = this.props;
    if (!lines) {
      return null;
    }
    const style = CleanReadInterface.style;
    return (
      <div style={style.wrapper}>
        <div style={style.wrapper}>
          {
            lines.map((l, i) => (
              <div key={i}>
                {l}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
