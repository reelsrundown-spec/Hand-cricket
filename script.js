// --- Audio Path Configuration ---
// Make sure the filenames match exactly what you uploaded to GitHub
// ശരിയായ പാത്ത് ഇതാണ്
const bgMusic = new Audio('music/sounds/handcricket.mp3'); 
bgMusic.loop = true;

// --- Music Control Logic ---

/**
 * Handles playing and pausing the background music 
 * based on user settings in localStorage.
 */
function handleBackgroundMusic() {
    const isMusicEnabled = localStorage.getItem('musicEnabled') !== 'false';
    
    if (isMusicEnabled) {
        // Browsers block autoplay, so we use a promise catch
        bgMusic.play().catch(error => {
            console.log("Autoplay prevented. Music will start after first interaction.");
        });
    } else {
        bgMusic.pause();
    }
}

/**
 * Global click listener to start music on first user interaction.
 * Modern browsers require this to allow audio playback.
 */
document.addEventListener('click', () => {
    handleBackgroundMusic();
}, { once: true });

// Check and update music status whenever a page loads
window.addEventListener('DOMContentLoaded', () => {
    handleBackgroundMusic();
});

// l--- Game State Variables ---
let userChoiceNum = -1;
let userScoreNum = 0;
let cpuScoreNum = 0;
let playerLife = 3; 

// Loads the role (BATTING/BOWLING) from Toss page
let currentInnings = localStorage.getItem("userRole") === "BATTING" ? "USER" : "CPU"; 
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

// Updates the Heart Icons (Life)
function updateLifeDisplay() {
    const lifeDisp = document.getElementById("life-icons");
    if (lifeDisp) {
        lifeDisp.innerText = "❤️".repeat(playerLife) + "🖤".repeat(3 - playerLife);
    }
}

// Starts the 3-second countdown

    function startClock() {
    userChoiceNum = -1;
    // പഴയ ചിത്രങ്ങൾ മാറ്റി ലോഗോയോ ഡിഫോൾട്ട് ചിത്രമോ കാണിക്കാൻ:
    if (document.getElementById("user-hand-img")) document.getElementById("user-hand-img").src = "assets/6.png";
    if (document.getElementById("cpu-hand-img")) document.getElementById("cpu-hand-img").src = "assets/6.png";

    // ബാക്കി കോഡുകൾ പഴയതുപോലെ...
        
    if (uChoiceDisp) uChoiceDisp.innerText = "-";
    if (cChoiceDisp) cChoiceDisp.innerText = "-";
    
    if (statusTxt) {
        statusTxt.innerText = currentInnings === "USER" ? "YOU ARE BATTING" : "CPU IS BATTING";
    
    
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

// Captures user button click (1-6)
function play(n) { 
    userChoiceNum = n; 
    const uChoiceDisp = document.getElementById("user-choice");
    if (uChoiceDisp) uChoiceDisp.innerText = n; 
}
// --- Main Game Logic ---
function processResult() {
    const uScoreDisp = document.getElementById("user-score");
    const cScoreDisp = document.getElementById("cpu-score");
    const uHandImg = document.getElementById("user-hand-img"); // പുതിയത്
    const cHandImg = document.getElementById("cpu-hand-img"); // പുതിയത്

    if (userChoiceNum === -1) {
        playerLife--;
        updateLifeDisplay();
        if (playerLife <= 0) { 
            showResult("GAME OVER", "You missed too many chances!", "RETRY", () => location.reload());
            return; 
        }
        setTimeout(startClock, 1000); 
        return;
    }

    let cpuMove = Math.floor(Math.random() * 6) + 1;
    
    // --- ചിത്രങ്ങൾ മാറ്റുന്ന വരികൾ ---
    if (uHandImg) uHandImg.src = "assets/" + userChoiceNum + ".png";
    if (cHandImg) cHandImg.src = "assets/" + cpuMove + ".png";
    // ----------------------------

    if (userChoiceNum === cpuMove) {
        if (currentInnings === "USER") {
            targetScore = userScoreNum + 1;
            currentInnings = "CPU";
            showResult("OUT!", "You scored " + userScoreNum + ". CPU needs " + targetScore + " to win.", "START BOWLING", startClock);
        } else {
            if (cpuScoreNum < targetScore - 1) {
                showResult("VICTORY!", "CPU is OUT! You won.", "PLAY AGAIN", () => location.reload());
            } else {
                showResult("MATCH TIED!", "Both scored same!", "PLAY AGAIN", () => location.reload());
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
                showResult("DEFEAT", "CPU won!", "TRY AGAIN", () => location.reload());
                return; 
            }
        }
        setTimeout(startClock, 1500);
    }
}
        

// Reset Game Data
function resetGame() {
    localStorage.clear();
    location.reload();
}

// Initial Page Load
document.addEventListener("DOMContentLoaded", () => { 
    updateLifeDisplay(); 
    if (document.getElementById("user-score")) {
        startClock(); 
    }
});
                
