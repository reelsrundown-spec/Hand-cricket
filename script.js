let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
let currentInnings = "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

// Function to show game result in a modal/popup
function showResult(title, message, btnText, callback) {
    const modal = document.getElementById("game-modal");
    if (!modal) {
        alert(title + "\n" + message);
        if (callback) callback();
        return;
    }
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-msg").innerText = message;
    
    const btn = modal.querySelector("button");
    btn.innerText = btnText;
    btn.onclick = () => {
        modal.style.display = "none";
        if (callback) callback();
    };
    modal.style.display = "flex";
}

function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
}

function startClock() {
    userChoiceNum = -1;
    const uMove = document.getElementById("user-choice");
    const cMove = document.getElementById("cpu-choice");
    const statusTxt = document.getElementById("status");
    const timerTxt = document.getElementById("timer");

    if (uMove) uMove.innerText = "-";
    if (cMove) cMove.innerText = "-";
    if (statusTxt) statusTxt.innerText = currentInnings === "USER" ? "YOU ARE BATTING" : "CPU IS BATTING";
    
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

// Function called when you press 1-6 buttons
function play(n) { 
    userChoiceNum = n; 
    const uChoiceDisp = document.getElementById("user-choice");
    if (uChoiceDisp) uChoiceDisp.innerText = n; 
}

function processResult() {
    const uScoreDisp = document.getElementById("user-score");
    const cScoreDisp = document.getElementById("cpu-score");
    const cChoiceDisp = document.getElementById("cpu-choice");

    // 1. Timeout Check
    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showResult("GAME OVER", "You missed 3 times! CPU Wins.", "RETRY", () => location.reload());
            return; 
        }
        setTimeout(startClock, 1000); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    if (cChoiceDisp) cChoiceDisp.innerText = cpuMove;

    // 2. Out Logic
    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showResult("OUT!", "Target Score for CPU: " + targetScore, "START BOWLING", startClock);
        } else {
            showResult("VICTORY!", "You bowled out CPU! You Won!", "PLAY AGAIN", () => location.reload());
        }
    } else {
        // 3. Scoring Logic
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            
            if (cpuScoreNum >= targetScore) { 
                showResult("DEFEAT", "CPU chased the target!", "TRY AGAIN", () => location.reload());
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}

function resetGame() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    // Only start clock if we are on the game page
    if (document.getElementById("user-score")) startClock(); 
});
