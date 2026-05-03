// --- Audio Configuration ---
const bgMusic = new Audio('music/sounds/handcricket.mp3');
bgMusic.loop = true;

function handleBackgroundMusic() {
    const isMusicEnabled = localStorage.getItem('musicEnabled') !== 'false';
    if (isMusicEnabled) {
        bgMusic.play().catch(() => console.log("Music interaction needed"));
    } else {
        bgMusic.pause();
    }
}

document.addEventListener('click', () => handleBackgroundMusic(), { once: true });

// --- Game Variables ---
let userChoiceNum = 0; // Default 0 (✊)
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3;
let currentInnings = localStorage.getItem("userRole") === "BATTING" ? "USER" : "CPU";
let targetScore = Infinity;
let gameTimer = null;

// --- UI Elements ---
const uScoreDisp = document.getElementById("user-score");
const cScoreDisp = document.getElementById("cpu-score");
const statusTxt = document.getElementById("game-status");
const uHandImg = document.getElementById("user-hand-img");
const cHandImg = document.getElementById("cpu-hand-img");

// --- Game Logic ---

function startClock() {
    userChoiceNum = 0; // Reset choice for next ball
    // തുടക്കത്തിൽ രണ്ട് പേരും 0 (✊) കാണിക്കട്ടെ
    uHandImg.src = "assets/0.png";
    cHandImg.src = "assets/0.png";

    statusTxt.innerText = currentInnings === "USER" ? "YOU ARE BATTING" : "CPU IS BATTING";
    
    let time = 3;
    statusTxt.innerText = `READY... ${time}`;
    
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        time--;
        if (time > 0) {
            statusTxt.innerText = `READY... ${time}`;
        } else {
            clearInterval(gameTimer);
            processResult();
        }
    }, 1000);
}

function play(n) {
    userChoiceNum = n;
    // നീ അമർത്തുന്ന നമ്പറിന്റെ പടം അപ്പോൾ തന്നെ കാണിക്കും
    uHandImg.src = `assets/${n}.png`;
}

function processResult() {
    let cpuMove = Math.floor(Math.random() * 6) + 1;
    cHandImg.src = `assets/${cpuMove}.png`;

    if (userChoiceNum === 0) {
        // ഒന്നും അമർത്തിയില്ലെങ്കിൽ
        playerLife--;
        updateLifeDisplay();
        statusTxt.innerText = "MISSED! -1 LIFE";
        if (playerLife <= 0) {
            showResult("GAME OVER", "You missed too many balls!", "RETRY", () => location.reload());
            return;
        }
        setTimeout(startClock, 1500);
        return;
    }

    if (userChoiceNum === cpuMove) {
        // --- OUT LOGIC ---
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showResult("OUT!", `You scored ${userScoreNum}. CPU needs ${targetScore} to win.`, "START BOWLING", () => {
                cpuScoreNum = 0; // കമ്പ്യൂട്ടറിന്റെ സ്കോർ റീസെറ്റ് ചെയ്യുന്നു
                startClock();
            });
        } else {
            // CPU Out
            if (cpuScoreNum < targetScore - 1) {
                showResult("VICTORY!", "CPU is OUT! You won the match!", "PLAY AGAIN", () => location.reload());
            } else {
                showResult("MATCH TIED!", "Scores are level!", "PLAY AGAIN", () => location.reload());
            }
        }
    } else {
        // --- SCORING LOGIC ---
        if (currentInnings === "USER") {
            userScoreNum += userChoiceNum;
            uScoreDisp.innerText = userScoreNum;
        } else {
            cpuScoreNum += cpuMove;
            cScoreDisp.innerText = cpuScoreNum;
            if (cpuScoreNum >= targetScore) {
                showResult("DEFEAT", "CPU chased the target!", "TRY AGAIN", () => location.reload());
                return;
            }
        }
        setTimeout(startClock, 1500);
    }
}

function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) {
        lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
    }
}

function showResult(title, message, btnText, callback) {
    const modal = document.getElementById("game-modal");
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

// Initial Load
window.onload = () => {
    updateLifeDisplay();
    startClock();
};
                    
