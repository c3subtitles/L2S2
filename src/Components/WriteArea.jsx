import { Connect } from '../Helper';
import { Paper } from 'material-ui';
import React from 'react';
import WriterInput from './WriterInput';

const props = state => ({
  lines: state.lines,
});

@Connect(props)
export default class WriteArea extends React.Component {
  static propTypes = {
    lines: React.PropTypes.array,
  };
  static style = {
    wrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    inner: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  };
  render() {
    const style = WriteArea.style;
    const { lines } = this.props;
    return (
      <Paper style={style.wrapper}>
        <div style={style.inner}>
          {
            lines.map((l, index) => (
              <span key={`${index}l.line`} style={{ color: l.user.color }}>{l.line}</span>
            ))
          }
        </div>
        <WriterInput/>
      </Paper>
    );
  }
}
