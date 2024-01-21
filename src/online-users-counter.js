class OnlineUsersCounter {
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(subscriber) {
      this.subscribers.push(subscriber);
    }
    
    async notify() {
      if (this.subscribers.length > 0) {
        const count = await this.count();
        this.subscribers.forEach((subscriber) => subscriber.onChangedOnlineUserCount(count));
      }
    }
  
    async count() { throw new Error('Method not implemented'); }
  }
  
  class LocalOnlineUsersCounter extends OnlineUsersCounter {
    constructor() {
      super();
    }
  
    async count() {
      return 1;
    }
  }

  export { LocalOnlineUsersCounter };