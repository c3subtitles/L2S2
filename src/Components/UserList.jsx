// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export default class UserList extends React.PureComponent {
  render() {
    return (
      <div className={css(style.wrapper)}>
        <h3 className={css(style.title)}>User</h3>
        UserInRoom
      </div>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    WebkitFlexDirection: 'column',
    flexDirection: 'column',
    overflow: 'auto',
    padding: 5,
    width: '15%',
  },
  user: {
    color: 'black',
    padding: 2,
    ':hover': {
      opacity: 0.6,
    },
  },
  title: {
    alignSelf: 'center',
  },
});
