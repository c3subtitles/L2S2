/* @flow */
import { Connect } from '../Helper';
import { Map } from 'immutable';
import Radium from 'radium';
import React from 'react';

type Props = {
  filteredUser: Map,
  spacerStyle: Object,
};

const props = state => ({
  filteredUser: state.userInRoom.filter(u => u.currentLine).sort(user => user.id !== state.user),
});

/*::`*/
@Connect(props)
@Radium
/*::`*/
export default class LinesInProgress extends React.Component<void, Props, void> {
  static style = {
    entry: {
      color: 'black',
      paddingLeft: 15,
    },
    wrapper: {
      display: 'flex',
      WebkitFlexDirection: 'column-reverse',
      flexDirection: 'column-reverse',
    },
  };
  render(): ReactElement {
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
