// To-Do List Application with Local Storage

class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.storageKey = 'todos_app_data';
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Add button and input
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');

    addBtn.addEventListener('click', () => this.addTodo());
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });

    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', () => {
      this.clearCompleted();
    });
  }

  addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
      alert('Please enter a task');
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };

    this.todos.push(todo);
    input.value = '';
    input.focus();

    this.saveToStorage();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToStorage();
      this.render();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
  }

  clearCompleted() {
    const completedCount = this.todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      alert('No completed tasks to clear');
      return;
    }

    if (confirm(`Clear ${completedCount} completed task(s)?`)) {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveToStorage();
      this.render();
    }
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  updateStats() {
    const totalCount = this.todos.length;
    const completedCount = this.todos.filter(t => t.completed).length;
    const activeCount = totalCount - completedCount;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('activeCount').textContent = activeCount;

    // Show/hide clear button
    const clearBtn = document.getElementById('clearAllBtn');
    clearBtn.style.display = completedCount > 0 ? 'block' : 'none';
  }

  render() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = this.getFilteredTodos();

    this.updateStats();

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>
            ${this.currentFilter === 'all' 
              ? 'No tasks yet. Add one to get started!' 
              : `No ${this.currentFilter} tasks`
            }
          </p>
        </div>
      `;
      return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="checkbox" 
          ${todo.completed ? 'checked' : ''} 
          onchange="app.toggleTodo(${todo.id})"
        >
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <span class="todo-date">${todo.createdAt}</span>
        <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.todos = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      this.todos = [];
    }
  }
}

// Initialize the app
const app = new TodoApp();
