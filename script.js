let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
let currentInnings = "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log("SW error", err));
}

// Custom Modal കാണിക്കാനുള്ള ഫംഗ്ഷനുകൾ
function showModal(title, message) {
    const modal = document.getElementById("game-modal");
    const mTitle = document.getElementById("modal-title");
    const mMsg = document.getElementById("modal-msg");
    
    if (modal && mTitle && mMsg) {
        mTitle.innerText = title;
        mMsg.innerText = message;
        modal.style.display = "flex";
    }
}

function closeModal() {
    const modal = document.getElementById("game-modal");
    if (modal) modal.style.display = "none";
}

function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) {
        lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
    }
}

function startClock() {
    userChoiceNum = -1;
    const uMove = document.getElementById("user-gesture");
    const cMove = document.getElementById("cpu-gesture");
    const statusTxt = document.getElementById("status-txt");
    const timerTxt = document.getElementById("timer-txt");

    if (uMove) uMove.innerText = "✊";
    if (cMove) cMove.innerText = "✊";
    if (statusTxt) statusTxt.innerText = currentInnings === "USER" ? "YOU BAT" : "CPU BAT";
    
    let time = 3;
    if (timerTxt) timerTxt.innerText = time;
    
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        time--;
        if (time > 0) {
            if (timerTxt) timerTxt.innerText = time;
        } else { 
            clearInterval(gameTimer); 
            processResult(); 
        }
    }, 1000);
}

function runMove(n) { 
    userChoiceNum = n; 
    const uMove = document.getElementById("user-gesture");
    if (uMove) uMove.innerText = hands[n]; 
}

function processResult() {
    const uScoreDisp = document.getElementById("user-score");
    const cScoreDisp = document.getElementById("cpu-score");
    const cMove = document.getElementById("cpu-gesture");

    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showModal("GAME OVER", "You missed 3 times!");
            setTimeout(() => { location.reload(); }, 3000);
            return; 
        }
        setTimeout(startClock, 1500); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    if (cMove) cMove.innerText = hands[cpuMove];

    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showModal("OUT!", "CPU needs " + targetScore + " to win.");
            setTimeout(() => { closeModal(); startClock(); }, 2500);
        } else {
            showModal("VICTORY!", "YOU WON THE MATCH! 🎉");
            setTimeout(() => { location.reload(); }, 4000);
        }
    } else {
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            if (cpuScoreNum >= targetScore) { 
                showModal("DEFEAT", "CPU WON THE MATCH!");
                setTimeout(() => { location.reload(); }, 4000);
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    if (document.getElementById("timer-txt")) {
        startClock(); 
    }
});
