import _ from 'lodash';
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
    lines: React.PropTypes.array,
    style: React.PropTypes.object,
  };
  render() {
    const { lines, style } = this.props;
    return (
      <div style={style}>
        {
          _.takeRight(lines, 3).map((l, index) => (
            <span key={`${index}`} style={{ color: l.user.color }}>{l.line}</span>
          ))
        }
      </div>
    );
  }
}
