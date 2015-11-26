import _ from 'lodash';
import { Connect } from '../Helper';
import { Paper } from 'material-ui';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  userInRoom: state.userInRoom,
});

@Connect(props)
@Radium
export default class UserList extends React.Component {
  static propTypes = {
    userInRoom: React.PropTypes.arrayOf(ClientUser),
  };
  static style = {
    wrapper: {
      width: '15%',
      display: 'flex',
      flexDirection: 'column',
      padding: 5,
    },
    user: {
      borderRadius: 5,
      padding: 2,
      ':hover': {
        backgroundColor: 'lightgrey',
      },
    },
  };
  render() {
    const style = UserList.style;
    const { userInRoom } = this.props;
    return (
      <Paper style={style.wrapper}>
        {
          _.sortBy(userInRoom, 'username').map(user => (
            <div style={[style.user, { color: user.color }]} key={user.id}>{user.username}</div>
          ))
        }
      </Paper>
    );
  }
}
