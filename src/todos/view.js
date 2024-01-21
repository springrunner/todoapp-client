const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';

class TodoView {
  constructor() {
    this.newTodoInput = document.querySelector('.new-todo');
    this.toggleAllCheckbox = document.querySelector('.toggle-all');
    this.toggleAll = document.querySelector('.toggle-all-label');
    this.todoList = document.querySelector('.todo-list');  
    this.todoCount = document.querySelector('.todo-count strong');
    this.filters = document.querySelector('.filters');
    this.clearCompletedButton = document.querySelector('.clear-completed');
    this.downloadTodosButton = document.querySelector('.download-todos');
    
    this.onToggleAll = null;
    this.onCreateTodo = null;    
    this.onUpdateTodo = null;
    this.onDeleteTodo = null;
    this.onClearCompletedTodos = null;

    this.todos = [];
    this.filter = '';

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.toggleAll.addEventListener('click', event => {
      if (!this.onToggleAll) {
        console.warn('Warning: onToggleAll handler is not defined');
        return;
      }

      this.toggleAllCheckbox.checked = !this.toggleAllCheckbox.checked;
      this.onToggleAll(this.toggleAllCheckbox.checked);
    });

    this.newTodoInput.addEventListener('keypress', event => {
      if (!this.onCreateTodo) {
        console.warn('Warning: onCreateTodo handler is not defined');
        return;
      }

      if (event.key === ENTER_KEY && this.newTodoInput.value.trim() !== '') {
        this.onCreateTodo(this.newTodoInput.value.trim());
        this.newTodoInput.value = '';
      }
    });

    this.todoList.addEventListener('click', event => {
      if (!this.onDeleteTodo) {
        console.warn('Warning: onDeleteTodo handler is not defined');
        return;
      }
      if (!this.onUpdateTodo) {
        console.warn('Warning: onUpdateTodo handler is not defined');
        return;
      }

      const target = event.target;
      const todoItem = target.closest('li');
      if (!todoItem) return;

      const id = todoItem.dataset.id;
      if (target.classList.contains('destroy')) {
        this.onDeleteTodo(id);
      } else if (target.classList.contains('toggle')) {
        const label = todoItem.querySelector('label');
        const checkbox = todoItem.querySelector('.toggle');        
        this.onUpdateTodo(id, label.textContent, checkbox.checked);
      }
    });
    this.todoList.addEventListener('dblclick', event => {
      if (!this.onUpdateTodo) {
        console.warn('Warning: onUpdateTodo handler is not defined');
        return;
      }

      const target = event.target;
      const todoItem = target.closest('li');
      if (!todoItem) return;

      if (target.tagName === 'LABEL') {
        const id = todoItem.dataset.id;
        const label = todoItem.querySelector('label');
        const checkbox = todoItem.querySelector('.toggle');        
        const className = todoItem.className;

        const input = document.createElement("input");
        input.className = "edit";
        input.value = label.textContent;

        todoItem.className = `${className} editing`;
        todoItem.appendChild(input);
        input.focus();      

        input.addEventListener('blur', () => {
          todoItem.className = className;
          todoItem.removeChild(input);
        });   
        input.addEventListener('keyup', event => {
          if (event.key === ESCAPE_KEY) {
            todoItem.className = className;
            todoItem.removeChild(input);
          }         
        });
        input.addEventListener('keypress', event => {
          if (event.key === ENTER_KEY) {
            this.onUpdateTodo(id, input.value, checkbox.checked);
          }         
        });     
      }
    });

    this.filters.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        const selectedFilter = event.target.getAttribute('href').slice(2);
        const filters = document.querySelectorAll('.filters li a');
        filters.forEach(filter => {
          if (filter.getAttribute('href') === `#/${selectedFilter}`) {
            filter.classList.add('selected');
            this.filter = filter.textContent.toLowerCase();
          } else {
            filter.classList.remove('selected');
          }
        });
        this.renderTodos();
      }
    });

    this.clearCompletedButton.addEventListener('click', (event) => {
      if (!this.onClearCompletedTodos) {
        console.warn('Warning: onClearCompletedTodos handler is not defined');
        return;
      }

      this.onClearCompletedTodos();
    });    
  }

  onChangedTodos(todos) {
    this.todos = todos;
    this.renderTodos();
  }

  renderTodos() {
    const completedCount = this.todos.filter(todo => todo.completed).length;
    
    let filteredTodos;
    switch (this.filter) {
      case 'active':
        filteredTodos = this.todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = this.todos.filter(todo => todo.completed);
        break;
      default:
        filteredTodos = this.todos;
        break;
    }    

    this.todoList.innerHTML = filteredTodos.map(todo => 
      `<li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
          <label>${todo.text}</label>
          <button class="destroy"></button>
        </div>
      </li>`
    ).join('');
    this.todoCount.textContent = filteredTodos.length;
    this.clearCompletedButton.style.display = completedCount > 0 ? 'block' : 'none';
  }
}

export { TodoView };