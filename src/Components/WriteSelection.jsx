// @flow
import { Connect } from '../Helper';
import { addError } from '../Services/notifications';
import Radium from 'radium';
import React from 'react';
import RoomSelection from './RoomSelection';

type Props = {
  user?: ClientUser,
};

@Radium
@Connect(state => ({ user: state.user }))
export default class WriteSelection extends React.Component {
  props: Props;
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  handleRoomClick = (room: Room) => {
    const { user } = this.props;
    if (!user || (room.locked && !user.role.canJoinLocked)) {
      addError({ title: 'insufficent Perissions', message: 'You are not allowed to join locked Rooms' });
      return;
    }
    this.context.router.transitionTo(`/write/${room.id}`);
  };
  render() {
    return (
      <RoomSelection showLockedState onRoomClick={this.handleRoomClick}/>
    );
  }
}
