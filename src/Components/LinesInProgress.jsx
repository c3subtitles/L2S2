import { Connect } from '../Helper';
import Radium from 'radium';
import React from 'react';


const props = state => ({
  userInRoom: state.userInRoom,
});

@Connect(props)
@Radium
export default class LinesInProgress extends React.Component {
  static propTypes = {
    userInRoom: React.PropTypes.array,
  };
  static style = {
    opacity: 0.7,
  }
  render() {
    const { userInRoom } = this.props;
    return (
      <div>
        {
          userInRoom.filter(u => u.currentLine).map(u => (
            <span key={u.id}
              style={[LinesInProgress.style, { color: u.color }]}>
              {u.currentLine}
            </span>
          ))
        }
      </div>
    );
  }
}
