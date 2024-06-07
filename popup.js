document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const startButton = document.getElementById('start');
  const pauseButton = document.getElementById('pause');
  const resetButton = document.getElementById('reset');
  const taskInput = document.getElementById('task');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const pomodoroCountDisplay = document.getElementById('pomodoro-count');

  let timer;
  let pomodoroCount = 0;
  let timeRemaining = 25 * 60; // Time amounting to 25 minutes

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  }

  function startTimer() {
    timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        pomodoroCount++;
        pomodoroCountDisplay.textContent = pomodoroCount;
        new Notification('Pomodoro Complete!', { body: 'Time for a break!' });
      }
    }, 1000);
  }

  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', () => clearInterval(timer));
  resetButton.addEventListener('click', () => {
    clearInterval(timer);
    timeRemaining = 25 * 60;
    updateTimerDisplay();
  });

  addTaskButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
      const li = document.createElement('li');
      li.textContent = task;
      taskList.appendChild(li);
      taskInput.value = '';
    }
  });
});
