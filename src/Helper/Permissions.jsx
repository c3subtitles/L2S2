// @flow
import LoggedIn from './LoggedIn';
import LoginService from 'Service/Login';

export default function Permission(...permissions: Array<string>) {
  return function(target: any) {
    @LoggedIn
    class PermissionComponent extends target {
      componentWillMount() {
        if (!LoginService.hasPermission(permissions)) {
          setTimeout(() => {
            this.context.router.transitionTo('/');
          });
          return;
        }
        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }
    }
    return PermissionComponent;
  };
}
