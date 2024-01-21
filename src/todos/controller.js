export default class TodoController {
  constructor(todos, todoView) {
    this.todos = todos;
    this.todoView = todoView;

    this.todoView.onToggleAll = this.handleToggleAll.bind(this);
    this.todoView.onCreateTodo = this.handleCreateTodo.bind(this);
    this.todoView.onUpdateTodo = this.handleUpdateTodo.bind(this);
    this.todoView.onDeleteTodo = this.handleDeleteTodo.bind(this);
    this.todoView.onClearCompletedTodos = this.handleClearCompletedTodos.bind(this);
  }

  handleToggleAll(state) {
    this.todos.toggleAllComplete(state);
  }  

  handleCreateTodo(text) {
    this.todos.add(text);
  }

  handleUpdateTodo(todoId, text, completed) {
    const id = Number(todoId);
    if (!isNaN(id)) {
      this.todos.edit(id, text, completed);
    } else {
      throw new Error('Invalid todoId: ' + todoId);
    }
  }

  handleDeleteTodo(todoId) {
    const id = Number(todoId);
    if (!isNaN(id)) {
      this.todos.remove(id);
    } else {
      throw new Error('Invalid todoId: ' + todoId);
    }
  }

  handleClearCompletedTodos() {
    this.todos.clearCompleted();
  }
}