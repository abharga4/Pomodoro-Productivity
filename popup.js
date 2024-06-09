document.addEventListener('DOMContentLoaded', () => {
    // Timer elements
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');

    // Task manager elements
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Settings elements
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const saveSettingsButton = document.getElementById('save-settings');
    const settingsSavedAlert = document.getElementById('settings-saved-alert');

    let timer;
    let timerType = 'work'; // 'work', 'shortBreak', 'longBreak'
    let isRunning = false;
    let remainingTime = 25 * 60; // Default to 25 minutes

    // Load settings from storage
    chrome.storage.sync.get(['workDuration', 'shortBreakDuration', 'longBreakDuration'], (result) => {
        workDurationInput.value = result.workDuration || 25;
        shortBreakDurationInput.value = result.shortBreakDuration || 5;
        longBreakDurationInput.value = result.longBreakDuration || 15;
        remainingTime = (result.workDuration || 25) * 60;
        updateTimeDisplay();
    });

    // Update time display
    function updateTimeDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Start timer
    startButton.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timer);
            startButton.textContent = 'Start';
        } else {
            timer = setInterval(() => {
                if (remainingTime > 0) {
                    remainingTime--;
                    updateTimeDisplay();
                } else {
                    clearInterval(timer);
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon128.png',
                        title: 'Pomodoro Timer',
                        message: 'Time to switch!',
                        priority: 2
                    });
                    switchTimerType();
                }
            }, 1000);
            startButton.textContent = 'Pause';
        }
        isRunning = !isRunning;
    });

    // Reset timer
    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = 'Start';
        chrome.storage.sync.get(['workDuration'], (result) => {
            remainingTime = (result.workDuration || 25) * 60;
            updateTimeDisplay();
        });
    });

    // Switch timer type
    function switchTimerType() {
        switch (timerType) {
            case 'work':
                timerType = 'shortBreak';
                chrome.storage.sync.get(['shortBreakDuration'], (result) => {
                    remainingTime = (result.shortBreakDuration || 5) * 60;
                    updateTimeDisplay();
                });
                break;
            case 'shortBreak':
                timerType = 'longBreak';
                chrome.storage.sync.get(['longBreakDuration'], (result) => {
                    remainingTime = (result.longBreakDuration || 15) * 60;
                    updateTimeDisplay();
                });
                break;
            case 'longBreak':
                timerType = 'work';
                chrome.storage.sync.get(['workDuration'], (result) => {
                    remainingTime = (result.workDuration || 25) * 60;
                    updateTimeDisplay();
                });
                break;
        }
    }

    // Add task
    addTaskButton.add
