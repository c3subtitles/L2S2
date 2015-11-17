import { Map } from 'immutable';
import UUID from 'uuid-js';
export default exports;

let sessions = Map();
export function getSession({ id }) {
  return sessions.get(id);
}

export function getUserIdForSessionId(sessionId: string) {
  return sessions.findKey(sId => sId === sessionId);
}

export function newSession({ id }) {
  const oldSession = sessions.get(id);
  if (oldSession) {
    return oldSession;
  }
  const session = UUID.create();
  sessions = sessions.set(id, session);
  return session;
}

export function hasSession(user) {
  return Boolean(getSession(user));
}

export function removeSession(sessionId: string) {
  sessions = sessions.filter((sId) => sId !== sessionId);
}
