// @flow

export type Notification = {
  title?: string,
  message?: string,
  level?: 'success' | 'info' | 'warning' | 'error',
  position?: 'tr' | 'tl' | 'tc' | 'br' | 'bl' | 'bc',
  autoDismiss?: number,
  dismissible?: bool,
  action?: Object,
  children?: string|React$Element<*>,
  onAdd?: (notification: Notification) => any,
  onRemove?: (notification: Notification) => any,
  uid?: number|string,
}

let notificationSystem;

export function setSystem(system: Object) {
  global.noti = notificationSystem = system;
}

export function addRawNotification(notification: Notification) {
  if (notificationSystem) {
    notificationSystem.addNotification(notification);
  }
}

export function addError(notification: Notification) {
  notification.level = 'error';
  addRawNotification(notification);
}

export function addWarning(notification: Notification) {
  notification.level = 'warning';
  addRawNotification(notification);
}

export function addInfo(notification: Notification) {
  notification.level = 'info';
  addRawNotification(notification);
}

export function addSuccess(notification: Notification) {
  notification.level = 'success';
  addRawNotification(notification);
}
