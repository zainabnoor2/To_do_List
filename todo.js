document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const errorText = document.getElementById('errorText');
  const statsText = document.getElementById('statsText');
  const allBtn = document.getElementById('allBtn');
  const activeBtn = document.getElementById('activeBtn');
  const completedBtn = document.getElementById('completedBtn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  renderTasks();

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  allBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons();
    renderTasks();
  });

  activeBtn.addEventListener('click', () => {
    currentFilter = 'active';
    updateFilterButtons();
    renderTasks();
  });

  completedBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    updateFilterButtons();
    renderTasks();
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      showError('Please enter a task');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    hideError();
    renderTasks();
  }

  function toggleTaskComplete(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
        }
      }

  function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
      }


  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
  }

  function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No tasks ${currentFilter === 'all' ? 'added yet' : 'match this filter'}</p>
        </div>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item bg-white rounded-lg shadow p-4 flex items-center';
      taskElement.innerHTML = `
        <div class="flex items-center flex-grow">
          <input
            type="checkbox"
            ${task.completed ? 'checked' : ''}
            onchange="toggleTaskComplete(${task.id})"
            class="h-5 w-5 text-blue-600 rounded mr-3 focus:ring-blue-500"
          />
          <span class="${task.completed ? 'task-complete' : ''}">${task.text}</span>
        </div>
        <button
          onclick="deleteTask(${task.id})"
          class="delete-btn text-red-500 hover:text-red-700 ml-2"
        >
          🗑️
        </button>
      `;
      taskList.appendChild(taskElement);
    });
  }

  function showError(message) {
    errorText.textContent = message;
    errorText.classList.remove('hidden');
    taskInput.classList.add('border-red-500');
  }

  function hideError() {
    errorText.classList.add('hidden');
    taskInput.classList.remove('border-red-500');
  }

  function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    statsText.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
    statsText.className = "text-black";
  }

function updateFilterButtons() {
  allBtn.className = 'mr-2 text-black';
  activeBtn.className = 'mr-2 text-black';
  completedBtn.className = 'text-black';

  if (currentFilter === 'all') {
    allBtn.className += ' font-medium text-blue-600';
  } else if (currentFilter === 'active') {
    activeBtn.className += ' font-medium text-blue-600';
  } else if (currentFilter === 'completed') {
    completedBtn.className += ' font-medium text-blue-600';
  }
}
    
     window.toggleTaskComplete = toggleTaskComplete;
     window.deleteTask = deleteTask;

  updateStats();
  updateFilterButtons();
});
