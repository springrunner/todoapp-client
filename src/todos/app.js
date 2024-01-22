import { QueryStringFeatureToggles } from '../feature-toggles.js';
import { LocalUserSession } from '../user-session.js';
import { LocalOnlineUsersCounter } from '../online-users-counter.js';

import { LocalTodos } from './model.js';
import { UserSessionView, TodoView } from './view.js';
import TodoController from './controller.js';

const isDevelopmentMode = import.meta.env.MODE === 'development'

const featureToggles = new QueryStringFeatureToggles();
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

featureToggles.subscribe(userSessionView);
featureToggles.subscribe(todoView);
featureToggles.notify();

userSession.subscribe(userSessionView);
userSession.notify();

todos.subscribe(todoView);
todos.notify();

if (featureToggles.isOnlineUsersCounter()) {
  onlineUsersCounter.subscribe(todoView);
  onlineUsersCounter.notify();
}