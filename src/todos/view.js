const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';

class UserSessionView {
  constructor() {
    this.userSessionContainer = document.querySelector('.user-session-container');
    this.loginGuide = document.querySelector('.login-guide-text');
    this.loginLink = document.querySelector('.login-link');
    this.userProfile = document.querySelector('.user-profile');
    this.username = document.querySelector('.user-profile strong');
    this.userProfilePicture = document.querySelector('.user-profile img');
    this.updateProfilePictureLink = document.querySelector('.update-profile-picture-link');
    this.logoutLink = document.querySelector('.logout-link');

    this.onLogin = null;
    this.onUpdateProfilePicture = null;
    this.onLogout = null;

    this.userSession = { userProfile: null };

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.loginLink.addEventListener('click', event => {
      if (!this.onLogin) {
        console.warn('Warning: onLogin handler is not defined');
        return;
      }

      this.onLogin();
    });

    this.updateProfilePictureLink.addEventListener('click', event => {
      if (!this.onUpdateProfilePicture) {
        console.warn('Warning: onUpdateProfilePicture handler is not defined');
        return;
      }

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      document.body.appendChild(fileInput);
      fileInput.click();

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.onUpdateProfilePicture(file);
        }

        document.body.removeChild(fileInput);
      });
    });

    this.logoutLink.addEventListener('click', event => {
      if (!this.onLogout) {
        console.warn('Warning: onLogout handler is not defined');
        return;
      }

      this.onLogout();
    });
  }

  onChangedUserSession(userSession) {
    if (userSession === null || userSession.userProfile === null) {
      this.userSession = { userProfile: null };
      this.loginGuide.style.display = 'block';
      return;
    }

    this.userSession = userSession;
    this.userProfile.style.display = 'block';
    this.username.textContent = this.userSession.userProfile.name;
    this.userProfilePicture.src = this.userSession.userProfile.profilePictureUrl;
  }
}

class TodoView {
  constructor() {
    this.newTodoInput = document.querySelector('.new-todo');
    this.toggleAllCheckbox = document.querySelector('.toggle-all');
    this.toggleAll = document.querySelector('.toggle-all-label');
    this.todoList = document.querySelector('.todo-list');  
    this.todoCount = document.querySelector('.todo-count strong');
    this.filters = document.querySelector('.filters');
    this.clearCompletedButton = document.querySelector('.clear-completed');
    this.onlineUserCount = document.querySelector('.online-user-count strong');
    this.downloadTodosButton = document.querySelector('.download-todos');
    
    this.onToggleAll = null;
    this.onCreateTodo = null;
    this.onUpdateTodo = null;
    this.onDeleteTodo = null;
    this.onClearCompletedTodos = null;
    this.onDownloadTodos = null;

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

    this.downloadTodosButton.addEventListener('click', (event) => {
      if (!this.onDownloadTodos) {
        console.warn('Warning: onDownloadTodos handler is not defined');
        return;
      }

      this.onDownloadTodos((content, contentType, fileName) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }

  onChangedTodos(todos) {
    this.todos = todos;
    this.renderTodos();
  }

  onChangedOnlineUserCount(count) {
    this.onlineUserCount.textContent = count;
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

export { UserSessionView, TodoView };