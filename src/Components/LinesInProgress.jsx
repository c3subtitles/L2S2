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
    entry: {
      color: 'black',
      paddingLeft: 15,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column-reverse',
    },
  }
  render() {
    const style = LinesInProgress.style;
    const { spacerStyle, userInRoom } = this.props;
    const filteredUser = userInRoom.filter(u => u.currentLine);
    return (
      <div style={style.wrapper}>
        {
          filteredUser.map(u => (
            <span key={u.id}
              style={[style.entry, { backgroundColor: u.color }]}>
              {u.currentLine}
            </span>
          )).toArray()
        }
        {filteredUser.size > 0 && <div style={spacerStyle}/>}
      </div>
    );
  }
}
