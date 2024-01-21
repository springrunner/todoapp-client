class Todos {
  constructor(store) {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }
  
  async notify() {
    if (this.subscribers.length > 0) {
      const todos = await this.all();
      this.subscribers.forEach((subscriber) => subscriber.onChangedTodos(todos));
    }
  }

  async all() { throw new Error('Method not implemented'); }
  
  async toggleAllComplete(completed) { throw new Error('Method not implemented'); }
  async add(text) { throw new Error('Method not implemented'); }
  async edit(todoId, text, completed) { throw new Error('Method not implemented'); }
  async remove(todoId) { throw new Error('Method not implemented'); }
  async clearCompleted() { throw new Error('Method not implemented'); }
}

class LocalTodos extends Todos {
  constructor() {
    super();
    this.key = 'todos';
  }

  async all() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  async toggleAllComplete(completed) {
    const todos = JSON.parse(localStorage.getItem(this.key)) || [];    
    for (let todo of todos) {
      todo.completed = completed;
    }
    localStorage.setItem(this.key, JSON.stringify(todos));
    
    return this.notify();
  }

  async add(text) {
    const todo = { id: Date.now(), text, completed: false, createdAt: Date.now(), updatedAt: null };

    const todos = JSON.parse(localStorage.getItem(this.key)) || [];
    todos.push(todo);
    localStorage.setItem(this.key, JSON.stringify(todos));

    return this.notify();
  }

  async edit(todoId, text, completed) {
    const updatedTodo = { id: todoId, text, completed, updatedAt: Date.now() };

    let todos = JSON.parse(localStorage.getItem(this.key)) || [];
    todos = todos.map(todo => todo.id === todoId ? {...todo, ...updatedTodo} : todo);
    localStorage.setItem(this.key, JSON.stringify(todos));

    return this.notify();
  }

  async remove(todoId) {
    const todos = JSON.parse(localStorage.getItem(this.key)) || [];
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem(this.key, JSON.stringify(filteredTodos));

    return this.notify();
  }

  async clearCompleted() {
    const todos = JSON.parse(localStorage.getItem(this.key)) || [];    
    const filteredTodos = todos.filter(todo => !todo.completed);
    localStorage.setItem(this.key, JSON.stringify(filteredTodos));
    
    return this.notify();
  }
}

export { LocalTodos };