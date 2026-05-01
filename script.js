let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
let currentInnings = "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

// Service Worker Registration (ഇൻസ്റ്റാൾ ബട്ടൺ വരാൻ ഇത് നിർബന്ധമാണ്)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log("SW error", err));
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
            alert("Game Over! 3 Misses."); 
            location.reload(); 
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
            alert("OUT! CPU needs " + targetScore + " to win.");
            setTimeout(startClock, 2000);
        } else {
            alert("CPU OUT! YOU WON!");
            location.reload();
        }
    } else {
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            if (cpuScoreNum >= targetScore) { 
                alert("CPU WON!"); 
                location.reload(); 
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    // game.html-ൽ മാത്രമേ ക്ലോക്ക് തുടങ്ങാവൂ എന്ന് ഉറപ്പാക്കാൻ
    if (document.getElementById("timer-txt")) {
        startClock(); 
    }
});

