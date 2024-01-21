import { LocalUserSession } from '../user-session.js';
import { LocalOnlineUsersCounter } from '../online-users-counter.js';

import { LocalTodos } from './model.js';
import { UserSessionView, TodoView } from './view.js';
import TodoController from './controller.js';

const isDevelopmentMode = import.meta.env.MODE === 'development'

const userSession = new LocalUserSession();
const todos = new LocalTodos();
const onlineUsersCounter = new LocalOnlineUsersCounter();
const userSessionView = new UserSessionView();
const todoView = new TodoView();
const controler = new TodoController(
  {
    loginUrl: isDevelopmentMode ? '/pages/login.html' : '/login',
    logoutUrl: isDevelopmentMode ? '/pages/login.html' : '/logout',
  },
  userSession, userSessionView, todos, todoView
);

userSession.subscribe(userSessionView);
userSession.notify();

todos.subscribe(todoView);
todos.notify();

onlineUsersCounter.subscribe(todoView);
onlineUsersCounter.notify();