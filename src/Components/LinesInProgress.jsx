import { Connect } from '../Helper';
import { Map } from 'immutable';
import Radium from 'radium';
import React from 'react';


const props = state => ({
  userInRoom: state.userInRoom,
});

@Connect(props)
@Radium
export default class LinesInProgress extends React.Component {
  static propTypes = {
    spacerStyle: React.PropTypes.object,
    userInRoom: React.PropTypes.instanceOf(Map),
  };
  static style = {
    opacity: 0.6,
  }
  render() {
    const { spacerStyle, userInRoom } = this.props;
    const filteredUser = userInRoom.filter(u => u.currentLine);
    return (
      <div>
        {
          filteredUser.map(u => (
            <span key={u.id}
              style={[LinesInProgress.style, { color: u.color }]}>
              {u.currentLine}
            </span>
          )).toArray()
        }
        {filteredUser.size > 0 && <div style={spacerStyle}/>}
      </div>
    );
  }
}
