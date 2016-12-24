// @flow
import { List } from 'immutable';
import Radium from 'radium';
import React from 'react';

type Props = {
  alwaysUpdate?: bool,
  fontSize: string|number,
  lines: List<string>,
};

type DefaultProps = {
  fontSize: 38,
};

@Radium
export default class ReadLines extends React.Component<DefaultProps, Props, void> {
  static style = {
    line: {
      WebkitAlignSelf: 'center',
      alignSelf: 'center',
      display: 'flex',
      fontWeight: 'bold',
      marginTop: '1em',
      marginBottom: '1em',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      WebkitFlexDirection: 'column',
    },
  };
  static defaultProps = {
    fontSize: 38,
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
