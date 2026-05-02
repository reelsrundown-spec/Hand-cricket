// --- Game State Variables ---
let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
let currentInnings = localStorage.getItem("userRole") || "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

// --- UI Functions ---

// Shows Professional Modal/Popup
function showResult(title, message, btnText, callback) {
    const modal = document.getElementById("game-modal");
    if (!modal) {
        alert(title + "\n" + message);
        if (callback) callback();
        return;
    }
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-msg").innerText = message;
    
    const btn = modal.querySelector(".modal-btn") || modal.querySelector("button");
    btn.innerText = btnText;
    btn.onclick = () => {
        modal.classList.add('hidden');
        if (callback) callback();
    };
    modal.classList.remove('hidden');
}

// Updates the Heart Icons
function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) {
        lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
    }
}

// Starts the 3-second countdown
function startClock() {
    userChoiceNum = -1;
    const uChoiceDisp = document.getElementById("user-choice");
    const cChoiceDisp = document.getElementById("cpu-choice");
    const statusTxt = document.getElementById("status");
    const timerTxt = document.getElementById("timer");

    if (uChoiceDisp) uChoiceDisp.innerText = "-";
    if (cChoiceDisp) cChoiceDisp.innerText = "-";
    
    if (statusTxt) {
        statusTxt.innerText = currentInnings === "USER" ? "YOU ARE BATTING" : "CPU IS BATTING";
    }
    
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

// Captures user button click
function play(n) { 
    userChoiceNum = n; 
    const uChoiceDisp = document.getElementById("user-choice");
    if (uChoiceDisp) uChoiceDisp.innerText = n; 
}

// --- Main Game Logic ---
function processResult() {
    const uScoreDisp = document.getElementById("user-score");
    const cScoreDisp = document.getElementById("cpu-score");
    const cChoiceDisp = document.getElementById("cpu-choice");

    // 1. Timeout Check
    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showResult("GAME OVER", "You missed too many chances! CPU Wins.", "RETRY", () => location.reload());
            return; 
        }
        setTimeout(startClock, 1000); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    if (cChoiceDisp) cChoiceDisp.innerText = cpuMove;

    // 2. Out Logic (When numbers match)
    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            // User was batting and got out
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showResult("OUT!", "Your Final Score: " + userScoreNum + ". CPU needs " + targetScore + " to win.", "START BOWLING", startClock);
        } else {
            // CPU was batting and got out
            if (cpuScoreNum < targetScore - 1) {
                const winMargin = (targetScore - 1) - cpuScoreNum;
                showResult("VICTORY!", "CPU is OUT! You won the match by " + winMargin + " runs.", "PLAY AGAIN", () => location.reload());
            } else {
                showResult("MATCH TIED!", "It's a draw! Both scored the same.", "PLAY AGAIN", () => location.reload());
            }
        }
    } 
    // 3. Scoring Logic (Numbers don't match)
    else {
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            
            // Check if CPU chased the target
            if (cpuScoreNum >= targetScore) { 
                showResult("DEFEAT", "CPU chased the target and won the match!", "TRY AGAIN", () => location.reload());
                return; 
            }
        }
        // Wait 1.5 seconds and start next round
        setTimeout(startClock, 1500);
    }
}

// Reset everything
function resetGame() {
    localStorage.clear();
    location.reload();
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    if (document.getElementById("user-score")) {
        startClock(); 
    }
});
                
