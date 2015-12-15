import { Connect } from '../Helper';
import { Map } from 'immutable';
import Radium from 'radium';
import React from 'react';


const props = state => ({
  filteredUser: state.userInRoom.filter(u => u.currentLine),
});

@Connect(props)
@Radium
export default class LinesInProgress extends React.Component {
  static propTypes = {
    filteredUser: React.PropTypes.instanceOf(Map),
    spacerStyle: React.PropTypes.object,
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
    const { spacerStyle, filteredUser } = this.props;
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
