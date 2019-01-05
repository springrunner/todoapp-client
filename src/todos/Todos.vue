<template>
  <div>
    <header class="header">
      <h1>todos</h1>
      <user-profile v-if="featureToggles.auth"></user-profile>
      <input v-model="newTodo" v-tooltip="newTodoTooltip" @keyup.enter="addTodo" class="new-todo" placeholder="What needs to be done?" autofocus="on" autocomplete="off">
    </header>
    <section class="main" :class="{'loading-mask': fetching}">
      <input id="toggle-all" class="toggle-all" type="checkbox">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{completed: todo.completed, editing: todo.id == editedTodo.id}">
          <div class="view">
            <input v-model="todo.completed" @change="completTodo(todo)" class="toggle" type="checkbox">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button @click="removeTodo(todo, true)" class="destroy"></button>
          </div>
          <input v-model="todo.title" v-todo-focus="todo.id == editedTodo.id" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" class="edit">
        </li>
      </ul>
    </section>
    <footer class="footer">
      <div>
        <span class="todo-count"><strong>{{todos.length}}</strong> item left</span>
        <ul class="filters">
          <li><a :class="{selected: filter === ''}" @click="filtering('')" href="#/">All</a></li>
          <li><a :class="{selected: filter == 'active'}" @click="filtering('active')" href="#/active">Active</a></li>
          <li><a :class="{selected: filter == 'completed'}" @click="filtering('completed')" href="#/completed">Completed</a></li>
        </ul>
        <button @click="clearCompleted" class="clear-completed">Clear completed</button>
      </div>
      <div>
        <online-users-counter v-bind:activity="featureToggles.onlineUsersCounter"></online-users-counter>
        <button @click="downloadTodos" class="clear-completed">Download todos</button>
      </div>
    </footer>
    <flash-message class="todo-notification"></flash-message>
  </div>
</template>

<script>
import commons from '../commons'
import UserProfile from './UserProfile'
import OnlineUsersCounter from './OnlineUsersCounter'

export default {
  data() {
    return {
      featureToggles: {
        auth: false,
        onlineUsersCounter: false
      },
      newTodo: '',
      newTodoTooltip: {
        content: '',
        show: false,
        trigger: 'manual', 
        placement: 'bottom'
      },
      editedTodo: {id: 0},
      fetching: false,
      todos: [],
      filter: ''
    }
  },
  mounted() {
    this.$http.get(`/api/feature-toggles`).then(response => { 
      this.featureToggles = Object.assign(this.featureToggles, response.data)
    }).catch(() => {
      console.log('Feature Toggles 정보를 획득하지 못했습니다. 기본 설정을 사용합니다.')
    })
    this.fetch()
  },
  components: { UserProfile, OnlineUsersCounter },
  computed: {
    filteredTodos: function() {
      const filter = this.filter
      
      if (filter === '') {
          return this.todos
      }
      return this.todos.filter(function(todo) {
        if (filter === 'completed') {
          return todo.completed
        }
        return !todo.completed
      })
    }
  },
  methods: {
    addTodo() {
      this.newTodo = this.newTodo.trim()
      if (commons.isBlank(this.newTodo)) {
        return
      }
      this.$http.post(`/api/todos`, {
        id: Date.now(),
        title: this.newTodo,
        completed: false
      }).then(() => { 
        this.newTodo = ''
        this.fetch()
      }).catch(error => {
        if (commons.containsKey(error.response.data, "errors")) {
          setTimeout(() => Object.assign(this.newTodoTooltip, { content: '', show: false }), 3000)
          Object.assign(this.newTodoTooltip, {
            content: error.response.data.errors.map(it => typeof it === 'string' ? it : it.defaultMessage).join('\n'),
            show: true
          })
        }
        this.handleErrorResponse(error)
      })
    },
    completTodo(todo) {
      this.$http.put(`/api/todos/${todo.id}`, todo).catch(this.handleErrorResponse)
    },
    editTodo(todo) {
      this.editedTodo = Object.assign({}, todo, { beforeTitle: todo.title })
    },
    doneEdit(todo) {
      if (!this.editedTodo || commons.isBlank(todo.title.trim()) || this.fetching) {
        return
      }
      todo.title = todo.title.trim()
      this.fetching = true
      this.$http.put(`/api/todos/${todo.id}`, todo).then(() => {
        this.fetch()
      }).catch(this.handleErrorResponse).finally(() => {
        this.editedTodo = {id: 0}
        this.fetching = false
      })
    },
    cancelEdit(todo) {
      todo.title = this.editedTodo.beforeTitle
      this.editedTodo = {id: 0}
    },
    removeTodo(todo, refresh) {
      this.$http.delete(`/api/todos/${todo.id}`).then(() => {
        if (refresh) this.fetch()
      }).catch(this.handleErrorResponse)
    },    
    clearCompleted() {
      const candidates = this.todos.filter(todo => todo.completed)
      if (candidates.length > 0) {
        candidates.forEach(todo => this.removeTodo(todo, false))
        this.fetch()
      }
    },
    downloadTodos() {
      this.$http({
        url: '/todos',
        method: 'GET',
        headers: { 'Accept': 'text/csv' },
        responseType: 'blob'
      }).then(response => {
        const blob = new Blob([response.data], {type: response.data.type})
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        const contentDisposition = response.headers['content-disposition']
        let fileName = 'unknown'
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
            if (fileNameMatch && fileNameMatch.length === 2) {
              fileName = fileNameMatch[1]
            }
        }
        document.body.appendChild(link)
        link.href = url
        link.setAttribute('download', fileName)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
    },
    fetch() {
      this.fetching = true
      this.$http.get(`/api/todos`).then(response => { 
        this.todos = response.data
      }).catch(error => {
        this.todos = []
        this.handleErrorResponse(error)
      }).finally(() => this.fetching = false)
    },
    filtering(filter) {
      this.filter = filter
    },
    handleErrorResponse(error) {
      // this.flashWarning(commons.getErrorMessage(error))
      this.flashError(commons.getErrorMessage(error))
    }
  },
  directives: {
    'todo-focus'(el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
</script>

<style>
@import '../assets/tooltip.css';
@import '../assets/loading-mask.css';
@import '../../node_modules/vue-flash-message/dist/vue-flash-message.min.css';

.footer {
  height: 48px;
}
.footer > div:last-child {
  margin-top: 28px;
  border-top: 1px dotted #f1f1f1;
}

.dimmed {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
  opacity: .1;
  filter: alpha(opacity=80);
  z-index: 999;
}

.todo-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.todo-notification .flash__message {
  border-radius: 0;
  margin-bottom: 5px;
}

@media (max-width: 430px) {
	.footer {
		height: 78px;
	}
  .footer > div:last-child {
    margin-top: 24px;
  }

	.filters {
		bottom: 10px;
	}
}
</style>
