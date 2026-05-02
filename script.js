let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
let currentInnings = "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

// ബ്യൂട്ടിഫുൾ പോപ്പപ്പ് കാണിക്കാൻ
function showResult(title, message, btnText, callback) {
    const modal = document.getElementById("game-modal");
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-msg").innerText = message;
    const btn = modal.querySelector(".modal-btn") || modal.querySelector("button");
    btn.innerText = btnText;
    
    // പഴയ ക്ലിക്ക് ഇവന്റുകൾ കളയാൻ
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

    // 1. ടൈം ഔട്ട് ലോജിക്
    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showResult("GAME OVER", "3 Misses! CPU Won.", "RETRY", () => location.reload());
            return; 
        }
        setTimeout(startClock, 1000); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    if (cMove) cMove.innerText = hands[cpuMove];

    // 2. ഔട്ട് ലോജിക്
    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showResult("OUT!", "Target Score: " + targetScore, "CONTINUE", startClock);
        } else {
            // CPU ഔട്ട് ആയി, നീ ജയിച്ചു
            showResult("VICTORY!", "You bowled out CPU!", "PLAY AGAIN", () => location.reload());
        }
    } else {
        // 3. സ്കോറിംഗ് ലോജിക്
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            
            // CPU ടാർഗെറ്റ് മറികടന്നോ എന്ന് നോക്കാം
            if (cpuScoreNum >= targetScore) { 
                showResult("DEFEAT", "CPU chased the target!", "TRY AGAIN", () => location.reload());
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    if (document.getElementById("timer-txt")) startClock(); 
});
