import { LocalUserSession } from '../user-session.js';


class DevelopmentLoginProcessor {
  constructor() {
    const userSession = new LocalUserSession();
    userSession.subscribe(this);  

    const form = document.getElementsByClassName('login-form')[0];
    const username = document.getElementById('username');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      userSession.set(username.value, '/profile-picture.png');
    });
  }

  onChangedUserSession(userSession) {
    window.location.href = '/pages/todos.html';
  }
}

/**
 * In the development environment, this simulate the login process.
 * In production environments, this should be handled on the server via a login form request.
 */
const mode = import.meta.env.MODE
if (mode === 'development') {
  console.info('Running in development mode');
  
  const loginProcessor = new DevelopmentLoginProcessor();
}