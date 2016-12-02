/* @flow */
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
      WebkitFlex: '1 1 0',
      flexDirection: 'column',
      WebkitFlexDirection: 'column',
      overflow: 'hidden',
    },
    lineContainer: {
      display: 'flex',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
      justifyContent: 'flex-end',
    },
    inner: {
      overflowWrap: 'break-word',
      marginBottom: 5,
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
      overflow: 'hidden',
    },
    spacer: {
      marginTop: 5,
      marginBottom: 5,
      height: 1,
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
