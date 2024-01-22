export default class TodoController {
  constructor(props, userSession, userSessionView, todos, todoView) {
    this.props = props;
    this.userSession = userSession;
    this.userSessionView = userSessionView;
    this.todos = todos;
    this.todoView = todoView;

    this.userSessionView.onLogin = this.handleLogin.bind(this);
    this.userSessionView.onUpdateProfilePicture = this.handleUpdateProfilePicture.bind(this);
    this.userSessionView.onLogout = this.handleLogout.bind(this);

    this.todoView.onToggleAll = this.handleToggleAll.bind(this);
    this.todoView.onCreateTodo = this.handleCreateTodo.bind(this);
    this.todoView.onUpdateTodo = this.handleUpdateTodo.bind(this);
    this.todoView.onDeleteTodo = this.handleDeleteTodo.bind(this);
    this.todoView.onClearCompletedTodos = this.handleClearCompletedTodos.bind(this);
    this.todoView.onDownloadTodos = this.handleDownloadTodos.bind(this);
  }

  handleLogin() {
    document.location.href = this.props.loginUrl;
  }

  handleUpdateProfilePicture(profilePicture) {
    this.userSession.updateProfilePicture(profilePicture);
  }

  handleLogout() {
    this.userSession.cleanUp().then(() => {
      document.location.href = this.props.logoutUrl;
    });
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

  handleDownloadTodos(outputStream) {
    this.todos.all().then(result => {
      if (Array.isArray(result)) {
        const headers = 'id,text,completed,createdAt\n';
        const rows = result.map(todo => {
          const createdAt = new Date(todo.createdAt).toString();

          return `${todo.id},"${todo.text}",${todo.completed},${createdAt}`
        }).join('\n');
        
        outputStream(headers + rows, 'text/csv;charset=utf-8;', 'todos.csv');
      } else {
        throw new Error('Unknown result type: ' + typeof result);
      }
    });
  }
}