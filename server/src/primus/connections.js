import _ from 'lodash';
import { getUserForSessionId } from '../Services/users';
import { addLine, lineStart, leaveRoom, leaveAllRooms } from '../Services/rooms';

function emitToRoom(spark, roomId, ...params) {
  _.each(spark.room(roomId).except(spark.id).connections, s => {
    s.emit(...params);
  });
}

export function onConnection(spark: Object) {
  spark.on('end', () => {
    if (spark.user) {
      leaveAllRooms(spark.user.id, (roomId) => {
        emitToRoom(spark, roomId, 'leave', roomId, spark.user.client());
      });
    }
  });

  spark.on('sessionId', async sessionId => {
    spark.user = await getUserForSessionId(sessionId);
  });

  spark.on('join', roomId => {
    spark.join(roomId);
    if (spark.user) {
      emitToRoom(spark, roomId, 'join', roomId, spark.user.client());
    }
  });

  spark.on('leave', roomId => {
    spark.leave(roomId);
    if (spark.user) {
      leaveRoom(Number.parseInt(roomId), spark.user.id);
      emitToRoom(spark, roomId, 'leave', roomId, spark.user.client());
    }
  });

  spark.on('lineStart', (roomId, text) => {
    if (spark.user) {
      lineStart(text, spark.user.id, Number.parseInt(roomId));
      emitToRoom(spark, roomId, 'lineStart', roomId, spark.user.id, text);
    }
  });

  spark.on('line', (roomId, text) => {
    if (spark.user) {
      lineStart('', spark.user.id, Number.parseInt(roomId));
      addLine(text, Number.parseInt(roomId), spark.user.id);
      emitToRoom(spark, roomId, 'line', roomId, spark.user.id, text);
    }
  });
}
