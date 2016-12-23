// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import RoomService from 'Service/Room';
import { observer } from 'mobx-react';

@observer
export default class LinesInProgress extends React.PureComponent {
  render() {
    const lines = RoomService.users.filter(u => u.current).toList();
    return (
      <div className={css(style.wrapper)}>
        {lines.map((l, i) => (
          <span key={i}>
            {l.current}
          </span>
        ))}
      </div>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
});
