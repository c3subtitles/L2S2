// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import RecentLines from './RecentLines';
import LinesInProgress from './LinesInProgress';
import WriterInput from './WriterInput';

export default class WriteArea extends React.PureComponent {
  render() {
    return (
      <div className={css(style.wrapper)}>
        <div className={css(style.lineContainer, style.inner)}>
          <RecentLines/>
          <LinesInProgress/>
        </div>
        <WriterInput/>
      </div>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  lineContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  inner: {
    overflowWrap: 'break-word',
    marginBottom: 5,
    flex: '1 1 0',
    overflow: 'hidden',
  },
  spacer: {
    marginTop: 5,
    marginBottom: 5,
    height: 1,
  },
});
