// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export default class ShortcutList extends React.PureComponent {
  render() {
    return (
      <div className={css(style.wrapper)}>
        <h3 className={css(style.title)}>Shortcuts</h3>
        Shortcuts.
      </div>
    );
  }
}

const style = StyleSheet.create({
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
});
