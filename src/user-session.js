class UserSession {
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(subscriber) {
      this.subscribers.push(subscriber);
    }
    
    async notify() {
      if (this.subscribers.length > 0) {
        const userSession = { 
          userProfile: await this.userProfile(),
        };
        this.subscribers.forEach((subscriber) => subscriber.onChangedUserSession(userSession));
      }
    }
  
    async userProfile() { throw new Error('Method not implemented'); }
  }
  
  class LocalUserSession extends UserSession {
    constructor() {
      super();
      this.userProfileKey = 'userProfile';
    }

    async set(username, profilePictureUrl) {
      const userProfile = { name: username, profilePictureUrl: profilePictureUrl };      
      localStorage.setItem(this.userProfileKey, JSON.stringify(userProfile));      

      return this.notify();
    }
  
    async userProfile() {
      return JSON.parse(localStorage.getItem(this.userProfileKey)) || null;
    }
  }
  
  export { LocalUserSession };