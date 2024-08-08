document.addEventListener('DOMContentLoaded', () => {
    let isRunning = false;
    let isWorkTime = true;
    let timer;
    let workDuration = 25 * 60;
    let breakDuration = 5 * 60;
    let timeLeft = workDuration;
    const tasks = [];

    const timerDisplay = document.getElementById('timer-display');
    const startStopButton = document.getElementById('start-stop-button');
    const resetButton = document.getElementById('reset-button');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const workDurationValue = document.getElementById('work-duration-value');
    const breakDurationValue = document.getElementById('break-duration-value');
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    document.getElementById('save-tasks').addEventListener('click', saveTasks);
    document.getElementById('load-tasks').addEventListener('click', loadTasks);

    function saveTasks() {
        // const taskList = document.getElementById('task-list');

        // taskList.querySelectorAll('li').forEach(task => {
        //     tasks.push(task.textContent);
        // });
    
        localStorage.setItem('tasks', JSON.stringify(tasks));
        showMessage('Tasks saved successfully!');
    }
    
    function loadTasks() {
        // const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
    
        loadTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.length = 0;
        tasks.push(...loadTasks);

        // tasks.forEach(taskText => {
        //     const li = document.createElement('li');
        //     li.textContent = taskText;
        //     taskList.appendChild(li);
        // });
        renderTasks();
        showMessage('Tasks loaded successfully!');
    }

    function showMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.classList.add('show');
        messageContainer.classList.remove('hide');
        setTimeout(() => {
            messageContainer.classList.add('hide');
            setTimeout(() => {
                messageContainer.classList.remove('show');
            }, 500); // Match the transition duration
        }, 800);
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? workDuration : breakDuration;
                alert(isWorkTime ? 'Work time!' : 'Break time!');
                startTimer();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        isRunning = false;
    }

    function resetTimer() {
        stopTimer();
        isWorkTime = true;
        workDuration = parseInt(workDurationInput.value) * 60;
        breakDuration = parseInt(breakDurationInput.value) * 60;
        timeLeft = workDuration;
        updateDisplay();
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        tasks.push(taskText);
        taskInput.value = '';
        renderTasks();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Del';
            removeButton.addEventListener('click', () => removeTask(index));
            li.appendChild(removeButton);
            taskList.appendChild(li);
        });
        taskList.scrollTop = taskList.scrollHeight; // Auto scroll to the bottom
    }

    workDurationInput.addEventListener('input', () => {
        workDurationValue.textContent = workDurationInput.value;
        if (!isRunning) {
            workDuration = parseInt(workDurationInput.value) * 60;
            timeLeft = workDuration;
            updateDisplay();
        }
    });

    breakDurationInput.addEventListener('input', () => {
        breakDurationValue.textContent = breakDurationInput.value;
        if (!isRunning) {
            breakDuration = parseInt(breakDurationInput.value) * 60;
        }
    });

    startStopButton.addEventListener('click', () => {
        if (isRunning) {
            stopTimer();
            startStopButton.textContent = 'Start';
        } else {
            startTimer();
            startStopButton.textContent = 'Stop';
        }
    });

    resetButton.addEventListener('click', resetTimer);
    addTaskButton.addEventListener('click', addTask);

    updateDisplay();
});