// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export default class RecentLines extends React.PureComponent {
  render() {
    // const { lines } = this.props;
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
