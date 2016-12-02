/* @flow */
let notificationSystem;

export function setSystem(system: Object) {
  notificationSystem = system;
}

export function addRawNotification(notification: Object) {
  if (notificationSystem) {
    notificationSystem.addNotification(notification);
  }
}

export function addError(notification: Object) {
  notification.level = 'error';
  addRawNotification(notification);
}

export function addWarning(notification: Object) {
  notification.level = 'warning';
  addRawNotification(notification);
}

export function addInfo(notification: Object) {
  notification.level = 'info';
  addRawNotification(notification);
}

export function addSuccess(notification: Object) {
  notification.level = 'success';
  addRawNotification(notification);
}
