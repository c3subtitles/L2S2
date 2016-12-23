// @flow
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { observer } from 'mobx-react';
import RoomService from 'Service/Room';

@observer
export default class UserList extends React.PureComponent {
  render() {
    const users = RoomService.users;
    return (
      <div className={css(style.wrapper)}>
        <h3 className={css(style.title)}>User</h3>
        {users.toList().map(u => (
          <div key={u.id}>{u.username}</div>
        ))}
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
