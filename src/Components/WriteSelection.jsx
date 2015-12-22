/* @flow */
import { Connect } from '../Helper';
import { addError } from '../Services/notifications';
import Radium from 'radium';
import React from 'react';
import RoomSelection from './RoomSelection';

type Props = {
  user: ClientUser,
};

/*::`*/
@Radium
@Connect(state => ({ user: state.user }))
/*::`*/
export default class WriteSelection extends React.Component<void, Props, void> {
  static contextTypes = {
    transitionTo: React.PropTypes.func,
  };
  handleRoomClick = room => {
    const { user } = this.props;
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
