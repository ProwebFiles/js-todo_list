const todo = {
  action(e) {
    const target = e.target;
    if (target.classList.contains('todo__action')) {
      const action = target.dataset.todoAction;
      const elemItem = target.closest('.todo__item');
      if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
        elemItem.remove();
      } else {
        elemItem.dataset.todoState = action;
      }
      this.save();
    } else if (target.classList.contains('todo__add')) {
      this.add();
      this.save();
    }
  },
  add() {
    const elemText = document.querySelector('.todo__text');
    if (elemText.disabled || !elemText.value.length) {
      return;
    }
    document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
    elemText.value = '';
  },
  create(text) {
    return `<li class="todo__item" data-todo-state="active">
      <span class="todo__task">${text}</span>
      <span class="todo__action todo__action_restore" data-todo-action="active"></span>
      <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
      <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
  },
  init() {
    const fromStorage = localStorage.getItem('todo');
    if (fromStorage) {
      document.querySelector('.todo__items').innerHTML = fromStorage;
    }
    document.querySelector('.todo__options').addEventListener('change', this.update);
    document.addEventListener('click', this.action.bind(this));
  },
  update() {
    const option = document.querySelector('.todo__options').value;
    document.querySelector('.todo__items').dataset.todoOption = option;
    document.querySelector('.todo__text').disabled = option !== 'active';
  },
  save() {
    localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
  }
}

todo.init();

document.querySelector('#save').addEventListener('click', (e) => {
  var a = document.createElement('a');
  a.download = 'tasks.txt';
  let content = '1. Активные задачи';
  let items = document.querySelectorAll('.todo__item[data-todo-state="active"]');
  items.forEach((item, index) => {
    content += '\n1.' + (index + 1) + '. ' + item.querySelector('.todo__task').textContent;
  });
  content += '\n\n2. Завершённые задачи';
  items = document.querySelectorAll('.todo__item[data-todo-state="completed"]');
  items.forEach((item, index) => {
    content += '\n2.' + (index + 1) + '. ' + item.querySelector('.todo__task').textContent;
  });
  content += '\n\n3. Удалённые задачи';
  items = document.querySelectorAll('.todo__item[data-todo-state="deleted"]');
  items.forEach((item, index) => {
    content += '\n3.' + (index + 1) + '. ' + item.querySelector('.todo__task').textContent;
  });
  a.href = window.URL.createObjectURL(new Blob([content], {
    type: 'text/plain'
  }));
  a.click();
});