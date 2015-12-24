import React from 'react';
import Radium from 'radium';

@Radium
export default class ReadLines extends React.Component {
  static style = {
    line: {
      WebkitAlignItems: 'center',
      alignItems: 'center',
      display: 'flex',
      fontSize: 32,
      fontWeight: 'bold',
      minHeight: '4em',
    },
  }
  render() {
    const style = ReadLines.style;
    const { lines } = this.props;
    return (
      <div>
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
