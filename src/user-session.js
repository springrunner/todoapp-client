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
  
    async cleanUp() { /* Do nothing. Override if needed. */ }
    async userProfile() { throw new Error('Method not implemented'); }
    async updateupdateProfilePicture(profilePicture) { throw new Error('Method not implemented'); }
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

    async cleanUp() {
      localStorage.removeItem(this.userProfileKey);
      
      return this.notify();
    }    
  
    async userProfile() {
      return JSON.parse(localStorage.getItem(this.userProfileKey)) || null;
    }

    async updateProfilePicture(profilePicture) {
      const userProfile = JSON.parse(localStorage.getItem(this.userProfileKey)) || null;
      if (userProfile === null) {
        throw new Error('user-profile is null');
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        userProfile.profilePictureUrl = event.target.result;
        localStorage.setItem(this.userProfileKey, JSON.stringify(userProfile));
        this.notify();
      }

      reader.readAsDataURL(profilePicture);
    }
  }
  
  export { LocalUserSession };