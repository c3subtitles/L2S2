/* @flow */
import { Connect } from '../Helper';
import { Map } from 'immutable';
import { Paper, TextField } from 'material-ui';
import Radium from 'radium';
import React from 'react';
import { setShortcut } from '../Actions/rooms';

const props = state => ({
  shortcuts: state.shortcuts,
});

type Props = {
  shortcuts: Map,
};

/*::`*/
@Connect(props)
@Radium
/*::`*/
export default class ShortcutList extends React.Component<void, Props, void> {
  static style = {
    wrapper: {
      width: '15%',
      display: 'flex',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
      padding: 5,
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    title: {
      WebkitAlignSelf: 'center',
      alignSelf: 'center',
    },
    shortcut: {
      borderRadius: 5,
      padding: 2,
    },
    input: {
      wrapper: {
        WebkitFlexShrink: 0,
        flexShrink: 0,
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
  handleShortcutChange = (key: string, e: SyntheticKeyboardEvent) => {
    /* $FlowFixMe */
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
            <TextField onChange={this.handleShortcutChange.bind(this, key)} floatingLabelStyle={style.input.label} inputStyle={style.input.input} style={style.input.wrapper} key={key} floatingLabelText={key} value={text}/>
          )).toArray()
        }
      </Paper>
    );
  }
}
