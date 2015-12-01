import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom } from '../Actions/rooms';
import { List } from 'immutable';
import { Paper } from 'material-ui';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  lines: state.readLines,
});

@Connect(props)
@Radium
export default class ReadInterface extends React.Component {
  static propTypes = {
    lines: React.PropTypes.instanceOf(List),
    params: React.PropTypes.object,
  };
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    line: {
      alignItems: 'center',
      display: 'flex',
      fontSize: 32,
      fontWeight: 'bold',
      minHeight: '4em',
    },
    gradient: {
      background: 'linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0.7), transparent)',
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  }
  componentWillMount() {
    const { roomId } = this.props.params;
    joinReadRoom(roomId);
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  render() {
    const { lines } = this.props;
    if (!lines) {
      return <Loading/>;
    }
    const style = ReadInterface.style;
    return (
      <Paper style={style.wrapper}>
        <div style={style.gradient}/>
        {
          lines.map((l, i) => (
            <div style={style.line} key={i}>
              {l}
            </div>
          ))
        }
      </Paper>
    );
  }
}
