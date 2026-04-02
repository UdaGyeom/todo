const STORAGE_KEY = 'todos';

let todos = loadTodos();
let filter = 'all';

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// ── 데이터 ──────────────────────────────────────────────

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodo(text) {
  return { id: Date.now(), text: text.trim(), completed: false };
}

// ── 렌더링 ──────────────────────────────────────────────

function getFilteredTodos() {
  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  list.innerHTML = '';

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent =
      filter === 'completed' ? '완료된 항목이 없습니다.' :
      filter === 'active'    ? '진행 중인 항목이 없습니다.' :
                               '할 일을 추가해보세요!';
    list.appendChild(empty);
  } else {
    filtered.forEach(todo => list.appendChild(createItem(todo)));
  }

  const remaining = todos.filter(t => !t.completed).length;
  remainingCount.textContent = `${remaining}개 남음`;
}

function createItem(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const check = document.createElement('button');
  check.className = 'todo-check';
  check.setAttribute('aria-label', todo.completed ? '완료 취소' : '완료');
  check.addEventListener('click', () => toggleTodo(todo.id));

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const del = document.createElement('button');
  del.className = 'delete-btn';
  del.setAttribute('aria-label', '삭제');
  del.textContent = '✕';
  del.addEventListener('click', () => deleteTodo(todo.id));

  li.append(check, text, del);
  return li;
}

// ── 액션 ──────────────────────────────────────────────

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.unshift(createTodo(text));
  input.value = '';
  saveTodos();
  render();
  input.focus();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}

function setFilter(f) {
  filter = f;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === f);
  });
  render();
}

// ── 이벤트 ──────────────────────────────────────────────

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// ── 초기 렌더 ───────────────────────────────────────────

render();
