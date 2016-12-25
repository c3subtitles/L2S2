// @flow
import { List } from 'immutable';
import Radium from 'radium';
import React from 'react';

type Props = {
  alwaysUpdate?: bool,
  fontSize: string,
  lines: List<string>,
};

@Radium
export default class ReadLines extends React.Component {
  props: Props;
  static style = {
    line: {
      alignSelf: 'center',
      display: 'flex',
      fontWeight: 'bold',
      marginBottom: '1em',
      marginTop: '1em',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
  static defaultProps = {
    fontSize: '38px',
  };
  shouldComponentUpdate(nextProps: Props): bool {
    return nextProps.alwaysUpdate || this.props.lines !== nextProps.lines;
  }
  render() {
    const style = ReadLines.style;
    const { lines, fontSize } = this.props;
    const lineStyle = {
      ...style.line,
      fontSize,
    };
    return (
      <div style={style.wrapper}>
        {
          lines.map((l, i) => (
            <div style={lineStyle} key={i}>
              {l}
            </div>
          ))
        }
      </div>
    );
  }
}
