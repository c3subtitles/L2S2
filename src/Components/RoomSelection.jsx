// @flow
import { Connect } from '../Helper';
import { fetchRooms } from '../Actions/rooms';
import { Map } from 'immutable';
import { Paper } from 'material-ui';
import Radium from 'radium';
import React from 'react';
import lockIcon from '../Lock.svg';
import unlockIcon from '../unlock.svg';

const props = state => ({
  canJoinLocked: state.user && state.user.role.canJoinLocked,
  rooms: state.rooms,
});

type Props = {
  canJoinLocked?: bool,
  onRoomClick: Function,
  rooms?: Map<number, Room>,
  showLockedState?: bool,
};

@Radium
@Connect(props)
export default class RoomSelection extends React.Component {
  props: Props;
  static style = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    room: {
      alignItems: 'center',
      display: 'flex',
      height: 250,
      justifyContent: 'center',
      marginBottom: 10,
      position: 'relative',
      width: '33.3%',
    },
    innerRoom: {
      alignItems: 'center',
      backgroundColor: 'inherit',
      cursor: 'pointer',
      display: 'flex',
      flex: '1 1 0',
      fontSize: 40,
      fontWeight: 'bold',
      height: '100%',
      justifyContent: 'center',
      margin: 10,
    },
    normalHover: {
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.15)',
      },
    },
    redHover: {
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.25)',
      },
    },
  };
  componentWillMount() {
    fetchRooms();
  }
  render() {
    const style = RoomSelection.style;
    const { rooms, onRoomClick, showLockedState, canJoinLocked } = this.props;
    return (
      <div style={style.wrapper}>
        {
          rooms && rooms.map((room: Room) => {
            let roomClick;
            let lockState;
            let hoverStyle = style.normalHover;
            if (onRoomClick) {
              roomClick = onRoomClick.bind(this, room);
            }
            if (showLockedState) {
              lockState = {
                backgroundImage: `url(${room.locked || room.speechLocked ? lockIcon : unlockIcon})`,
                backgroundPosition: '50% 50%',
                backgroundRepeat: 'no-repeat',
                bottom: 15,
                left: 15,
                position: 'absolute',
                right: 15,
                top: 15,
                opacity: 0.2,
                zIndex: -1,
              };
              if (room.locked && !canJoinLocked) {
                hoverStyle = style.redHover;
              }
            }
            return (
              <div key={room.id} style={style.room}>
                {lockState && <div style={lockState}/>}
                <Paper onClick={roomClick} style={{ ...style.innerRoom, ...hoverStyle }}>
                  {room.name}
                </Paper>
              </div>
            );
          }).toArray()
        }
      </div>
    );
  }
}
