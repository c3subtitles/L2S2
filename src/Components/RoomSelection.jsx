import { Connect } from '../Helper';
import { fetchRooms } from '../Actions/rooms';
import { Paper } from 'material-ui';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  rooms: state.rooms,
});

@Connect(props)
@Radium
export default class RoomSelection extends React.Component {
  static propTypes = {
    onRoomClick: React.PropTypes.func,
    rooms: React.PropTypes.arrayOf(Object),
  };
  static style = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    room: {
      alignItems: 'center',
      display: 'flex',
      height: 250,
      justifyContent: 'center',
      marginBottom: 10,
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
      ':hover': {
        backgroundColor: 'lightGrey',
      },
    },
  }
  componentWillMount() {
    fetchRooms();
  }
  render() {
    const style = RoomSelection.style;
    const { rooms, onRoomClick } = this.props;
    return (
      <div style={style.wrapper}>
        {
          rooms.map(room => {
            let roomClick;
            if (onRoomClick) {
              roomClick = onRoomClick.bind(this, room);
            }
            return (
              <div key={room.id} style={style.room}>
                <Paper onClick={roomClick} style={style.innerRoom}>
                  {room.name}
                </Paper>
              </div>
            );
          })
        }
      </div>
    );
  }
}
