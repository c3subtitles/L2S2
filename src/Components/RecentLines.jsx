// @flow
import { List } from 'immutable';
import { Connect } from '../Helper';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  lines: state.lines,
});

type Props = {
  lines?: List,
  style: Object,
};

@Connect(props)
@Radium
export default class RecentLines extends React.Component {
  props: Props;
  render() {
    const { lines, style } = this.props;
    return (
      <div style={style}>
        {
          lines.map((l, index) => {
            const color = (l.user && l.user.color) || l.color;
            return (
              <span key={`${index}`} style={{ paddingLeft: 5, color: 'black', backgroundColor: color }}>{l.line}</span>
            );
          })
        }
      </div>
    );
  }
}
