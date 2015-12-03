import { addError } from '../Services/notifications';
import { Connect, Permission } from '../Helper';
import { joinRoom, leaveRoom } from '../Actions/rooms';
import Loading from 'react-loader';
import React from 'react';
import UserList from './UserList';
import WriteArea from './WriteArea';

const props = state => ({
  user: state.user,
  room: state.currentRoom,
});


@Permission()
@Connect(props)
export default class WriteInterface extends React.Component {
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
      flex: '1 1 0',
    },
    mainContent: {
      flex: '1 1 0',
    },
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.room.locked && !nextProps.user.role.canJoinLocked) {
      this.context.transitionTo('/write');
      addError({ title: 'Room locked', message: 'The room got locked. You do not have the permission to be in locked Rooms' });
    }
  }
  componentWillMount() {
    const { roomId } = this.props.params;
    joinRoom(roomId);
  }
  componentWillUnmount() {
    const { roomId } = this.props.params;
    leaveRoom(roomId);
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
      </div>
    );
  }
}
