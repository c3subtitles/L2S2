import { Connect } from '../Helper';
import { Map } from 'immutable';
import { Paper, TextField } from 'material-ui';
import Radium from 'radium';
import React from 'react';
import { setShortcut } from '../Actions/rooms';

const props = state => ({
  shortcuts: state.shortcuts,
});

@Radium
@Connect(props)
export default class ShortcutList extends React.Component {
  static propTypes = {
    shortcuts: React.PropTypes.instanceOf(Map),
  };
  static style = {
    wrapper: {
      width: '15%',
      display: 'flex',
      flexDirection: 'column',
      padding: 5,
    },
    title: {
      alignSelf: 'center',
    },
    shortcut: {
      borderRadius: 5,
      padding: 2,
    },
    input: {
      wrapper: {
        height: 47,
      },
      input: {
        marginTop: 4,
      },
      label: {
        top: 17,
      },
    },
  };
  handleShortcutChange = (key: string, e: SyntheticEvent) => {
    setShortcut(key, e.target.value);
  };
  render() {
    const style = ShortcutList.style;
    const { shortcuts } = this.props;
    return (
      <Paper style={style.wrapper}>
        <h3 style={style.title}>Shortcuts</h3>
        {
          shortcuts.map((text: string, key: string) => (
            <TextField onChange={this.handleShortcutChange.bind(this, key)} floatingLabelStyle={style.input.label} inputStyle={style.input.input} style={style.input.wrapper} key={key} floatingLabelText={`#${key}`} value={text}/>
          )).toArray()
        }
      </Paper>
    );
  }
}
