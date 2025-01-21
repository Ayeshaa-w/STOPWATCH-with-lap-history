let startTime = null;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapHistory = [];
let sessionHistory = [];

const display = document.getElementById("display");
const lapHistoryDiv = document.getElementById("lap-history");
const sessionHistoryDiv = document.getElementById("session-history");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100); // Get tenths of a second
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
    const currentTime = Date.now() - startTime + elapsedTime;
    display.textContent = formatTime(currentTime);

    // Add vibrational effect every second
    if (Math.floor(currentTime / 1000) !== Math.floor((currentTime - 100) / 1000)) {
        display.classList.add("vibrating");
        setTimeout(() => display.classList.remove("vibrating"), 100); // Remove vibration after 100ms
    }
}

function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 100); // Update every 100ms
        isRunning = true;
        document.getElementById("start").textContent = "Pause";
    } else {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        isRunning = false;
        document.getElementById("start").textContent = "Start";
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    startTime = null;
    display.textContent = "00:00:00.0";
    isRunning = false;
    document.getElementById("start").textContent = "Start";

    storeSessionHistory();
}

function storeSessionHistory() {
    const session = {
        lapTimes: [...lapHistory],
        sessionTime: formatTime(elapsedTime)
    };
    sessionHistory.push(session);
    lapHistory = [];
    renderLapHistory();
    renderSessionHistory();
}

function renderLapHistory() {
    lapHistoryDiv.innerHTML = "";
    lapHistory.forEach((lap, lapIndex) => {
        const lapDiv = document.createElement("div");
        lapDiv.classList.add("lap-item");
        lapDiv.innerHTML = `<span class="lap-number">Lap ${lapIndex + 1}:</span> ${lap}`;
        lapHistoryDiv.appendChild(lapDiv);
    });
}

function renderSessionHistory() {
    sessionHistoryDiv.innerHTML = "";
    sessionHistory.forEach((session, index) => {
        const sessionDiv = document.createElement("div");
        sessionDiv.classList.add("session-item");

        let sessionHtml = `<strong>Session ${index + 1}:</strong> ${session.sessionTime}`;
        sessionHtml += "<div>";
        session.lapTimes.forEach((lap, lapIndex) => {
            sessionHtml += `<div class="lap-item">Lap ${lapIndex + 1}: ${lap}</div>`;
        });
        sessionHtml += "</div>";
        sessionDiv.innerHTML = sessionHtml;

        sessionHistoryDiv.appendChild(sessionDiv);
    });
}

function addLap() {
    const lapTime = display.textContent;
    lapHistory.push(lapTime);
    renderLapHistory();
}

function clearSessionHistory() {
    sessionHistory = [];
    renderSessionHistory();
}

document.getElementById("start").addEventListener("click", startStopwatch);
document.getElementById("reset").addEventListener("click", resetStopwatch);
document.getElementById("lap").addEventListener("click", addLap);
document.getElementById("clear-laps").addEventListener("click", clearSessionHistory);