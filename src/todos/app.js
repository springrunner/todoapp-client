import { LocalTodos } from './model.js';
import { TodoView } from './view.js';
import TodoController from './controller.js';

const todos = new LocalTodos();
const todoView = new TodoView();
const controler = new TodoController(todos, todoView);

todos.subscribe(todoView);
todos.notify();