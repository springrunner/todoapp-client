import { LocalOnlineUsersCounter } from '../online-users-counter.js';

import { LocalTodos } from './model.js';
import { TodoView } from './view.js';
import TodoController from './controller.js';

const todos = new LocalTodos();
const onlineUsersCounter = new LocalOnlineUsersCounter();
const todoView = new TodoView();
const controler = new TodoController(todos, todoView);

todos.subscribe(todoView);
todos.notify();

onlineUsersCounter.subscribe(todoView);
onlineUsersCounter.notify();