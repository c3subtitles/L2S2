export default function(component) {
  return class ObserveMount extends component {
    _mounted = false
    _checkMounted = false
    componentDidMount() {
      this._mounted = true;
      this._checkMounted = true;
      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }
    componentWillUnmount() {
      this._mounted = false;
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }
    setState() {
      if (!this._checkMounted || this._mounted) {
        super.setState.apply(this, arguments);
      }
    }
  };
}
