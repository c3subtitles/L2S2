/* @flow */
import { List } from 'immutable';
import Radium from 'radium';
import React from 'react';

type Props = {
  lines: List<string>
};

@Radium
export default class ReadLines extends React.Component<void, Props, void> {
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
    },
  };
  shouldComponentUpdate(nextProps: Props): bool {
    return this.props.lines !== nextProps.lines;
  }
  render(): ReactElement {
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
