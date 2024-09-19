document.querySelector('form').addEventListener('submit', handleSubmitForm);
document.querySelector('ul').addEventListener('click', handleClickDeleteOrCheck);
document.getElementById('clearAll').addEventListener('click', handleClearAll);
document.getElementById('clearAll').insertAdjacentHTML('afterend', '<span id="totalLevel"> Total Level: 0</span>');

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    createDropdown();
});

document.querySelector('ul').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('ul').addEventListener('touchmove', handleTouchMove, false);
document.querySelector('ul').addEventListener('touchend', handleTouchEnd, false);

let touchStartX = 0;
let touchEndX = 0;
let touchStartTime = 0;
let touchEndTime = 0;
let swipedItem = null;

function createDropdown() {
    let select = document.createElement("select"); 
    select.id = "mySelect"; 
    
    let option1 = document.createElement("option"); 
    option1.value = "Barbarian"; 
    option1.text = "Barbarian"; 
    select.appendChild(option1); 
    
    let option2 = document.createElement("option"); 
    option2.value = "lard"; 
    option2.text = "lard"; 
    select.appendChild(option2); 

    let option3 = document.createElement("option"); 
    option3.value = "Cleric"; 
    option3.text = "Cleric"; 
    select.appendChild(option3); 
    
    let option4 = document.createElement("option"); 
    option4.value = "Druid"; 
    option4.text = "Druid"; 
    select.appendChild(option4); 

    let option5 = document.createElement("option"); 
    option5.value = "Fighter"; 
    option5.text = "Fighter"; 
    select.appendChild(option5); 
    
    let option6 = document.createElement("option"); 
    option6.value = "Monk"; 
    option6.text = "Monk"; 
    select.appendChild(option6); 
    
    let option7 = document.createElement("option"); 
    option7.value = "Paladin"; 
    option7.text = "Paladin"; 
    select.appendChild(option7); 
    
    let option8 = document.createElement("option"); 
    option8.value = "Ranger"; 
    option8.text = "Ranger"; 
    select.appendChild(option8); 

    let option9 = document.createElement("option"); 
    option9.value = "Rogue"; 
    option9.text = "Rogue"; 
    select.appendChild(option9); 
    
    let option10 = document.createElement("option"); 
    option10.value = "Sorcerer"; 
    option10.text = "Sorcerer"; 
    select.appendChild(option10); 

    let option11 = document.createElement("option"); 
    option11.value = "Warlock"; 
    option11.text = "Warlock"; 
    select.appendChild(option11); 
    
    let option12 = document.createElement("option"); 
    option12.value = "Wizard"; 
    option12.text = "Wizard"; 
    select.appendChild(option12); 

    let levelInput = document.createElement("input");
    levelInput.type = "number";
    levelInput.id = "levelInput";
    levelInput.placeholder = "level";
    levelInput.style.width = "50px"; 


    let form = document.querySelector('form');
    form.appendChild(select);
    form.appendChild(levelInput);
}

function handleSubmitForm(e) {
    e.preventDefault();
    let input = document.querySelector('input');
    let select = document.getElementById('mySelect');
    let levelInput = document.getElementById('levelInput');

    if (input.value != '' & levelInput.value != '' ) {
        let todoWithDetails = `${input.value} (${select.value}, ${levelInput.value+" level"})`;
        addTodo(todoWithDetails);
        saveTodo(todoWithDetails);
    }
    input.value = '';
    levelInput.value = '';
}

function addTodo(todo, isChecked) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    
    li.innerHTML = `
        <span class="todo-item">${todo}</span>
        <button name="checkButton"><i class="fas fa-check-square"></i></button>
        <button name="deleteButton"><i class="fas fa-trash"></i></button>
    `;
    
    li.classList.add('todo-list-item');
    if (isChecked) {
        li.style.textDecoration = 'line-through';
    }
    ul.appendChild(li);
    updateTotalLevel();

}

function handleClickDeleteOrCheck(e) {
    if (e.target.name == 'checkButton')
        checkTodo(e);

    if (e.target.name == 'deleteButton')
        deleteTodo(e);
}

function checkTodo(e) {
    let item = e.target.parentNode;
    let isChecked = item.style.textDecoration == 'line-through';
    if (isChecked) {
        item.style.textDecoration = 'none';
        updateTodoStatus(item.textContent.trim(), false);
    } else {
        item.style.textDecoration = 'line-through';
        updateTodoStatus(item.textContent.trim(), true);
    }
    updateTotalLevel(); 
}

function updateTodoStatus(todoText, isChecked) {
    let character = JSON.parse(localStorage.getItem('character'));
    let todo = character.find(t => t.text === todoText);
    if (todo) {
        todo.checked = isChecked;
        localStorage.setItem('character', JSON.stringify(character));
    }
}

function deleteTodo(e) {
    let item = e.target.parentNode;
    
    item.addEventListener('transitionend', function () {
        item.remove(); 
        removeTodo(item);
        updateTotalLevel();
    });

    item.classList.add('todo-list-item-fall');
}

function handleClearAll(e) {
    document.querySelector('ul').innerHTML = '';
    localStorage.clear();
    updateTotalLevel();
}

function saveTodo(todo, isChecked) {
    let character;
    if(localStorage.getItem('character') === null) {
        character = [];
    } else {
        character = JSON.parse(localStorage.getItem('character'));
    }
    character.push({ text: todo, checked: isChecked });
    localStorage.setItem('character', JSON.stringify(character));
}

function loadTodos() {
    let character;
    if(localStorage.getItem('character') === null) {
        character = [];
    } else {
        character = JSON.parse(localStorage.getItem('character'));
    }
    character.forEach(function(todo) {
        addTodo(todo.text, todo.checked);
    });
}

function removeTodo(item) {
    let character = JSON.parse(localStorage.getItem('character'));
    let todoText = item.querySelector('.todo-item').textContent.trim();

    let todoIndex = character.findIndex(t => t.text === todoText);

    if (todoIndex !== -1) {
        character.splice(todoIndex, 1);
        localStorage.setItem('character', JSON.stringify(character));
    }
}
function updateTotalLevel() {
    let totalLevel = 0;
    let listItems = document.querySelectorAll('ul .todo-list-item');

    listItems.forEach(item => {
        if (item.style.textDecoration === 'line-through') {
            let match = item.textContent.match(/(\d+) level/); // this part is from chatgpt i could't find a way to this is and asked
            if (match) {
                totalLevel += parseInt(match[1], 10);
            }
        }
    });

    document.getElementById('totalLevel').textContent = ` Total Level: ${totalLevel}`;
}

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartTime = new Date().getTime();
    swipedItem = event.target.closest('li');
  }
  
  function handleTouchMove(event) {
    touchEndX = event.changedTouches[0].screenX;
  }
  
  function handleTouchEnd() {
    touchEndTime = new Date().getTime();
    const deltaX = touchStartX - touchEndX;
    const deltaTime = touchEndTime - touchStartTime;
    const velocity = Math.abs(deltaX / deltaTime);
  
    if (deltaX > 100 && velocity > 0.3) {
        deleteTodoBySwipe(swipedItem);
    }
  }

function deleteTodoBySwipe(item) {
  if (item) {
      item.classList.add('todo-list-item-fall');
      item.addEventListener('transitionend', function () {
          item.remove(); 
          removeTodo(item);
          updateTotalLevel();
      });
  }
}
