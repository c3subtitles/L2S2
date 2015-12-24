import React from 'react';
import Radium from 'radium';

@Radium
export default class ReadLines extends React.Component {
  static style = {
    line: {
      WebkitAlignSelf: 'center',
      alignSelf: 'center',
      display: 'flex',
      fontSize: 32,
      fontWeight: 'bold',
      minHeight: '4em',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      WebkitFlexDirection: 'column',
    }
  }
  render() {
    const style = ReadLines.style;
    const { lines } = this.props;
    return (
      <div style={style.wrapper}>
        {
          lines.map((l, i) => (
            <div style={style.line} key={i}>
              {l}
            </div>
          ))
        }
      </div>
    );
  }
}
