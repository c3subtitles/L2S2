import { Paper } from 'material-ui';
import RecentLines from './RecentLines';
import LinesInProgress from './LinesInProgress';
import React from 'react';
import WriterInput from './WriterInput';
import Radium from 'radium';
import OldLines from './OldLines';

@Radium
export default class WriteArea extends React.Component {
  static style = {
    wrapper: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
    },
    lineContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    inner: {
      overflowWrap: 'break-word',
      flex: '1 1 0',
    },
    spacer: {
      background: 'red',
      height: 1,
    },
  };
  render() {
    const style = WriteArea.style;
    return (
      <Paper style={style.wrapper}>
        <div style={[style.lineContainer, style.inner]}>
          <OldLines style={style.lineContainer}/>
          <div style={style.spacer}/>
          <LinesInProgress spacerStyle={style.spacer} style={style.lineContainer}/>
          <RecentLines style={style.lineContainer}/>
        </div>
        <WriterInput/>
      </Paper>
    );
  }
}
