
import React from 'react';
import Radium from 'radium';
import WriterInput from './WriterInput';


@Radium
export default class WriteInterface extends React.Component {
  static style = {
    mainWrap: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    textPrev: {
      flex: 1,
    },
  };
  static contextTypes = {
    history: React.PropTypes.object,
  };
  render() {
    const style = WriteInterface.style;
    return (
      <div style={style.mainWrap}>
        <div style={style.textPrev}>

        </div>
        <WriterInput/>
      </div>
    );
  }
}
