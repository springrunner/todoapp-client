class FeatureToggles {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }
  
  async notify() {
    if (this.subscribers.length > 0) {
      const props = {
        auth: this.isAuth(),
        onlineUsersCounter: this.isOnlineUsersCounter(),
      };
      this.subscribers.forEach((subscriber) => subscriber.onChangedFeatureToggles(props));
    }
  }

  isAuth() { throw new Error('Method not implemented'); }
  isOnlineUsersCounter() { throw new Error('Method not implemented'); }
}

class QueryStringFeatureToggles extends FeatureToggles {
  constructor() {
    super();
    const params = new URLSearchParams(window.location.search);
    this.props = {
        auth: params.get('auth') === 'true',
        onlineUsersCounter: params.get('onlineUsersCounter') === 'true'
    };
  }

  isAuth() {
    return this.props.auth;
  }

  isOnlineUsersCounter() {
    return this.props.onlineUsersCounter;
  }
}

export { QueryStringFeatureToggles };