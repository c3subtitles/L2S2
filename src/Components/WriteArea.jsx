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
      flex: 1,
      flexDirection: 'column',
    },
    inner: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-end',
      overflow: 'auto',
    },
  };
  render() {
    const style = WriteArea.style;
    return (
      <Paper style={style.wrapper}>
        <div style={style.inner}>
          <OldLines style={style.inner}/>
          SPACER
          <LinesInProgress style={style.inner}/>
          SPACER
          <RecentLines style={style.inner}/>
        </div>
        <WriterInput/>
      </Paper>
    );
  }
}
