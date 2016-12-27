// @flow
import { Paper } from 'material-ui';
import RecentLines from './RecentLines';
import LinesInProgress from './LinesInProgress';
import React from 'react';
import WriterInput from './WriterInput';
import Radium from 'radium';

/*::`*/
@Radium
/*::`*/
export default class WriteArea extends React.Component {
  static style = {
    wrapper: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    },
    lineContainer: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      flexShrink: 0,
      justifyContent: 'flex-end',
    },
    inner: {
      flex: '1 1 0',
      marginBottom: 5,
      overflow: 'hidden',
      overflowWrap: 'break-word',
    },
    spacer: {
      height: 1,
      marginBottom: 5,
      marginTop: 5,
    },
  };
  shouldComponentUpdate(): false {
    return false;
  }
  render() {
    const style = WriteArea.style;
    return (
      <Paper style={style.wrapper}>
        <div style={[style.lineContainer, style.inner]}>
          <RecentLines style={style.lineContainer}/>
          <LinesInProgress spacerStyle={style.spacer} style={style.lineContainer}/>
        </div>
        <WriterInput/>
      </Paper>
    );
  }
}
