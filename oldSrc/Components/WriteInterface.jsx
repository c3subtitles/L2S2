/* @flow */
import { addError } from '../Services/notifications';
import { Connect, Permission } from '../Helper';
import { joinRoom, leaveRoom } from '../Actions/rooms';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';
import ShortcutList from './ShortcutList';
import UserList from './UserList';
import WriteArea from './WriteArea';

const props = state => ({
  user: state.user,
  room: state.currentRoom,
});

type Props = {
  params: {
    roomId: string,
  },
  room: RoomType,
  user: ClientUser,
};

@Permission()
@Connect(props)
@Radium
export default class WriteInterface extends React.Component<void, Props, void> {
  static contextTypes = {
    transitionTo: React.PropTypes.func,
  };
  static propTypes = {
    params: React.PropTypes.shape({
      roomId: React.PropTypes.string,
    }),
    room: React.PropTypes.object,
    user: React.PropTypes.object,
  };
  static style = {
    wrapper: {
      display: 'flex',
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
      overflow: 'hidden',
    },
    mainContent: {
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
    },
  };
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.room.locked && !nextProps.user.role.canJoinLocked) {
      this.context.transitionTo('/write');
      addError({ title: 'Room locked', message: 'The room got locked. You do not have the permission to be in locked Rooms' });
    }
  }
  componentWillMount() {
    const { roomId } = this.props.params;
    joinRoom(Number.parseInt(roomId, 10));
  }
  componentWillUnmount() {
    const { roomId } = this.props.params;
    leaveRoom(Number.parseInt(roomId, 10));
  }
  render() {
    const style = WriteInterface.style;
    const { room } = this.props;
    if (!room) {
      return <Loading/>;
    }
    return (
      <div style={style.wrapper}>
        <WriteArea/>
        <UserList/>
        <ShortcutList/>
      </div>
    );
  }
}
