import { List } from 'immutable';
import { Connect } from '../Helper';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  lines: state.lines,
});

@Radium
@Connect(props)
export default class RecentLines extends React.Component {
  static propTypes = {
    lines: React.PropTypes.instanceOf(List),
    style: React.PropTypes.object,
  };
  render() {
    const { lines, style } = this.props;
    return (
      <div style={style}>
        {
          lines.takeLast(3).map((l, index) => (
            <span key={`${index}`} style={{ color: (l.user && l.user.color) || 'black' }}>{l.line}</span>
          ))
        }
      </div>
    );
  }
}
