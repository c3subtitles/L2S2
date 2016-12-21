// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export default class LinesInProgress extends React.PureComponent {
  render() {
    return (
      <div className={css(style.wrapper)}>
        LinesInProgress
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
