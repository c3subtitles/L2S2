/* @flow */
import { getUserForSessionId } from '../Services/users';
import { addLine, lineStart, leaveRoom, leaveAllRooms } from '../Services/rooms';

export function emitToRoomAuth(spark, roomId, ...params) {
  spark.room(roomId).transform(function(packet, done) {
    if (this.user && this.id !== spark.id) {
      this.emit(...packet.data[0]);
    }
    done(undefined, false);
  })
  .write(params);
}

export function onConnection(spark) {
  spark.on('end', () => {
    if (spark.user) {
      leaveAllRooms(spark.user.id, (roomId) => {
        emitToRoomAuth(spark, roomId, 'leave', roomId, spark.user.client());
      });
    }
  });

  spark.on('sessionId', async sessionId => {
    spark.user = await getUserForSessionId(sessionId);
  });

  spark.on('join', roomId => {
    spark.join(roomId);
    if (spark.user) {
      emitToRoomAuth(spark, roomId, 'join', roomId, spark.user.client());
    }
  });

  spark.on('leave', roomId => {
    spark.leave(roomId);
    if (spark.user) {
      leaveRoom(Number.parseInt(roomId), spark.user.id);
      emitToRoomAuth(spark, roomId, 'leave', roomId, spark.user.client());
    }
  });

  spark.on('lineStart', (roomId, text) => {
    if (spark.user) {
      lineStart(text, spark.user.id, Number.parseInt(roomId));
      emitToRoomAuth(spark, roomId, 'lineStart', roomId, spark.user.id, text);
    }
  });


  spark.on('line', (roomId, text, color) => {
    if (spark.user) {
      lineStart('', spark.user.id, Number.parseInt(roomId));
      addLine(text, Number.parseInt(roomId), spark.user.id, color);
      spark.room(roomId).transform(function(packet, done) {
        if (this.id !== spark.id) {
          this.emit(...packet.data[0]);
          done(undefined, false);
        }
      }).write(['line', roomId, text, spark.user.id, color]);
    }
  });
}
