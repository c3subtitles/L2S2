// @flow
import React from 'react';
import LoggedIn from 'Helper/LoggedIn';
import Loading from 'react-loader';
import ShortcutList from './ShortcutList';
import UserList from './UserList';
import WriteArea from './WriteArea';
import { css, StyleSheet } from 'aphrodite';
import RoomService from 'Service/Room';

type Props = {
  params: {
    id: string,
  },
};

@LoggedIn
export default class Write extends React.PureComponent {
  props: Props;
  componentWillMount() {
    const { params: { id } } = this.props;
    RoomService.joinRoom(Number.parseInt(id, 10), true);
  }
  componentWillUnmount() {
    const { params: { id } } = this.props;
    RoomService.leaveRoom(Number.parseInt(id, 10), true);
  }
  render() {
    const room = RoomService.room;
    if (!room) {
      return <Loading/>;
    }
    return (
      <div className={css(style.wrapper)}>
        <WriteArea/>
        <UserList/>
        <ShortcutList/>
      </div>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    WebkitFlex: '1 1 0',
    flex: '1 1 0',
    overflow: 'hidden',
  },
});
