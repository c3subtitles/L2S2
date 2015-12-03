import { Connect } from '../Helper';
import { addError } from '../Services/notifications';
import Radium from 'radium';
import React from 'react';
import RoomSelection from './RoomSelection';


@Radium
@Connect(state => ({ user: state.user }))
export default class WriteSelection extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
  };
  static contextTypes = {
    transitionTo: React.PropTypes.func,
  };
  handleRoomClick = room => {
    const { user }: { user: ClientUser } = this.props;
    if (room.locked && !user.role.canJoinLocked) {
      addError({ title: 'insufficent Perissions', message: 'You are not allowed to join locked Rooms' });
      return;
    }
    this.context.transitionTo(`/write/${room.id}`);
  };
  render() {
    return (
      <RoomSelection showLockedState onRoomClick={this.handleRoomClick}/>
    );
  }
}
