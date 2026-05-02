let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 
// ടോസ് അനുസരിച്ച് ബാറ്റിംഗ് ആണോ ബൗളിംഗ് ആണോ എന്ന് തീരുമാനിക്കുന്നു
let currentInnings = localStorage.getItem("userRole") || "USER"; 
let targetScore = Infinity;
let gameTimer = null;

const hands = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️", 6: "👍" };

function showResult(title, message, btnText, callback) {
    const modal = document.getElementById("game-modal");
    if (!modal) return;
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-msg").innerText = message;
    const btn = modal.querySelector(".modal-btn");
    btn.innerText = btnText;
    btn.onclick = () => {
        modal.classList.add('hidden');
        if (callback) callback();
    };
    modal.classList.remove('hidden');
}

function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
}

function startClock() {
    userChoiceNum = -1;
    const uChoiceDisp = document.getElementById("user-choice");
    const cChoiceDisp = document.getElementById("cpu-choice");
    const statusTxt = document.getElementById("status");
    const timerTxt = document.getElementById("timer");

    if (uChoiceDisp) uChoiceDisp.innerText = "-";
    if (cChoiceDisp) cChoiceDisp.innerText = "-";
    
    // സ്റ്റാറ്റസ് മാറ്റുന്നു
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

function play(n) { 
    userChoiceNum = n; 
    const uChoiceDisp = document.getElementById("user-choice");
    if (uChoiceDisp) uChoiceDisp.innerText = n; 
}

function processResult() {
    const uScoreDisp = document.getElementById("user-score");
    const cScoreDisp = document.getElementById("cpu-score");
    const cChoiceDisp = document.getElementById("cpu-choice");

    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showResult("GAME OVER", "Too many misses! CPU Wins.", "RETRY", () => location.reload());
            return; 
        }
        setTimeout(startClock, 1000); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    if (cChoiceDisp) cChoiceDisp.innerText = cpuMove;

    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU"; // ബാറ്റിംഗ് കഴിഞ്ഞു, ഇനി ബൗളിംഗ്
            showResult("OUT!", "You scored " + userScoreNum + ". CPU needs " + targetScore + " to win.", "START BOWLING", startClock);
        } else {
            // CPU ബൗളിംഗിൽ ഔട്ട് ആയി
            if (cpuScoreNum < targetScore - 1) {
                showResult("VICTORY!", "CPU is OUT! You won the match!", "PLAY AGAIN", () => location.reload());
            } else {
                showResult("MATCH TIED!", "Scores are equal!", "PLAY AGAIN", () => location.reload());
            }
        }
    } else {
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            if (uScoreDisp) uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            if (cScoreDisp) cScoreDisp.innerText = cpuScoreNum;
            
            if (cpuScoreNum >= targetScore) { 
                showResult("DEFEAT", "CPU reached the target!", "TRY AGAIN", () => location.reload());
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    if (document.getElementById("user-score")) startClock(); 
});
