// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import RoomService from 'Service/Room';
import { observer } from 'mobx-react';

@observer
export default class RecentLines extends React.PureComponent {
  render() {
    const lines = RoomService.lines;
    return (
      <div className={css(style.wrapper)}>
        {/* {
          lines.map((l, index) => {
            const color = (l.user && l.user.color) || l.color;
            return (
              <span key={`${index}`} className={css(style.line)} style={{ backgroundColor: color }}>{l.line}</span>
            );
          })
        } */}
        RecentLines
      </div>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  line: {
    paddingLeft: 5,
    color: 'black',
  },
});
