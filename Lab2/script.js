// Funkcja do walidacji daty
function isDateValid(deadline) {
    if (!deadline) {
        return true; // Data może być pusta
    }
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate > currentDate; // Data musi być w przyszłości
}

// Funkcja do walidacji zadania
function isTaskValid(taskText, deadline) {
    if (taskText.length < 3 || taskText.length > 255) {
        alert('Zadanie musi zawierać od 3 do 255 znaków.');
        return false;
    }

    if (!isDateValid(deadline)) {
        alert('Data musi być w przyszłości lub pusta.');
        return false;
    }

    return true;
}

// Funkcja do zapisywania zadań do LocalStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        const taskText = task.querySelector('.task-text').getAttribute('data-original-text');
        const taskDate = task.querySelector('.task-date').textContent.replace('Termin: ', '');
        tasks.push({ text: taskText, date: taskDate });
    });
    console.log('Zapisuję do LocalStorage:', tasks); // Logowanie do konsoli
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkcja do odczytywania zadań z LocalStorage
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');
    console.log('Ładowanie z LocalStorage:', savedTasks); // Logowanie do konsoli
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.date);
    });
}

// Funkcja do filtrowania zadań i podświetlania tekstu
function filterTasks(searchText) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        const taskTextElement = task.querySelector('.task-text');
        const originalText = taskTextElement.getAttribute('data-original-text');

        if (originalText.toLowerCase().includes(searchText.toLowerCase())) {
            task.style.display = ''; // Pokaż, jeśli pasuje
            taskTextElement.innerHTML = highlightText(originalText, searchText); // Podświetl
        } else {
            task.style.display = 'none'; // Ukryj, jeśli nie pasuje
        }
    });
}

// Funkcja do podświetlania wyszukiwanej frazy
function highlightText(text, query) {
    if (!query) return text; // Jeśli nie ma zapytania, nie podświetlaj
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>'); // Podświetl wyszukiwany fragment
}

// Funkcja do dodawania zadania na listę
function addTaskToList(taskText, deadlineText) {
    const taskList = document.getElementById('task-list');

    const newTask = document.createElement('li');
    newTask.setAttribute('data-editable', 'true');

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = taskText;
    taskTextElement.setAttribute('data-original-text', taskText); // Zapisz oryginalny tekst do atrybutu

    const taskDateElement = document.createElement('small');
    taskDateElement.classList.add('task-date');
    taskDateElement.textContent = deadlineText ? `Termin: ${deadlineText}` : 'Termin: brak';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-task');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';

    deleteButton.addEventListener('click', function() {
        newTask.remove();
        saveTasksToLocalStorage();
    });

    newTask.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-task') || event.target.tagName === 'I') return;
        editTask(newTask, taskTextElement, taskDateElement);
    });

    newTask.appendChild(taskTextElement);
    newTask.appendChild(taskDateElement);
    newTask.appendChild(deleteButton);

    taskList.appendChild(newTask);
}

// Obsługa dodawania nowego zadania
document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskDeadline = document.getElementById('task-deadline');

    const taskText = taskInput.value.trim();
    const deadlineText = taskDeadline.value ? taskDeadline.value : 'brak';

    // Sprawdzanie walidacji zadania
    if (!isTaskValid(taskText, taskDeadline.value)) {
        return;
    }

    // Dodaj zadanie na listę
    addTaskToList(taskText, deadlineText);

    // Zapisz zadania do LocalStorage
    saveTasksToLocalStorage();

    // Wyczyść pola formularza
    taskInput.value = '';
    taskDeadline.value = '';
});

// Funkcja do edycji zadania (tekst i data)
function editTask(taskItem, taskTextElement, taskDateElement) {
    const originalText = taskTextElement.textContent.trim();
    const originalDate = taskDateElement.textContent.replace('Termin: ', '').trim();

    // Stwórz pole tekstowe do edycji nazwy zadania
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = originalText;
    textInput.classList.add('edit-input');

    // Stwórz pole do edycji daty
    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.value = originalDate !== 'brak' ? new Date(originalDate).toISOString().slice(0, 16) : '';
    dateInput.classList.add('edit-date');

    // Zastąp tekst zadania i datę polami tekstowymi
    taskTextElement.replaceWith(textInput);
    taskDateElement.replaceWith(dateInput);
    textInput.focus();

    // Funkcja do zapisania zmian
    function saveTask() {
        const newText = textInput.value.trim();
        const newDate = dateInput.value;

        if (!isTaskValid(newText, newDate)) {
            return;
        }

        // Przywróć zaktualizowany tekst zadania i datę
        taskTextElement.textContent = newText;
        taskDateElement.textContent = newDate ? `Termin: ${newDate}` : 'Termin: brak';
        textInput.replaceWith(taskTextElement);
        dateInput.replaceWith(taskDateElement);
        document.removeEventListener('click', outsideClickListener);
        saveTasksToLocalStorage(); // Zapisz zadania po edycji
    }

    // Funkcja sprawdzająca kliknięcie poza polem edycji (poza zadaniem)
    function outsideClickListener(event) {
        if (!taskItem.contains(event.target)) {
            saveTask();
        }
    }

    // Nasłuchuj na kliknięcie poza zadaniem
    document.addEventListener('click', outsideClickListener);

    // Używaj Enter do zapisania
    textInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveTask();
        }
    });

    dateInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveTask();
        }
    });
}

// Ładowanie zadań z LocalStorage po załadowaniu strony
window.addEventListener('load', function() {
    loadTasksFromLocalStorage();
});

// Obsługa wyszukiwania
document.getElementById('search').addEventListener('input', function() {
    const searchText = this.value.trim();
    filterTasks(searchText);
});
