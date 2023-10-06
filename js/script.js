const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const gameOverOptions = document.getElementById('gameOverOptions');
const playAgainYes = document.getElementById('playAgainYes');
const playAgainNo = document.getElementById('playAgainNo');
const endGameImage = document.getElementById('endGameImage');
const startScreen = document.getElementById('startScreen');
const startGameImage = document.getElementById('startGameImage');

let score = 0;
let level = 1;
let pipeAnimationDuration = 1.5;
let loop = null;
let gameStarted = false;

if (window.innerWidth <= 768) {
    pipeAnimationDuration = 2;
}

document.body.style.overflow = 'hidden';

const sounds = {
    jump: new Audio('sounds/jump.wav'),
    gameOver: new Audio('sounds/gameOver.wav'),
    ohYes: new Audio('sounds/ohYes.wav'),
    ohNo: new Audio('sounds/ohNo.wav'),
    letsGo: new Audio('sounds/letsGo.wav'),
    backgroundMusic: new Audio('sounds/backgroundMusic.mp3')
}

const jump = () => {
    if (!gameStarted) return;

    sounds.jump.play();

    if (!mario.classList.contains('jump')) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

const updatePipeAnimation = () => {
    pipe.style.animation = `pipe-animation ${pipeAnimationDuration}s infinite linear`;
}

const resetPipeAnimation = () => {
    pipe.style.animation = 'none';
    void pipe.offsetWidth;
    pipe.style.animation = `pipe-animation ${pipeAnimationDuration}s infinite linear`;
}

const restartGame = () => {
    score = 0;
    level = 1;
    gameStarted = true;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    mario.src = 'images/mario.gif';
    mario.removeAttribute('style');
    mario.classList.remove('mario-dead');
    endGameImage.style.display = 'none';
    updatePipeAnimation();

    sounds.backgroundMusic.currentTime = 0;
    sounds.backgroundMusic.play();

    gameLoop();
}

playAgainYes.addEventListener('click', () => {
    sounds.ohYes.play();
    gameOverOptions.style.display = 'none';
    restartGame();
});

playAgainNo.addEventListener('click', () => {
    sounds.ohNo.play();
    gameOverOptions.style.display = 'none';
    gameStarted = false;
    sounds.backgroundMusic.pause();
});

const gameLoop = () => {
    if (!gameStarted) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 70 && marioPosition > 80) {
        score++;
        scoreDisplay.textContent = score;

        if (score % 20 === 0) {
            level++;
            levelDisplay.textContent = level;
            pipeAnimationDuration -= 0.2;
            updatePipeAnimation();
            resetPipeAnimation();
        }
    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        sounds.gameOver.play();
        sounds.backgroundMusic.pause();

        pipe.style.animation = 'none';
        mario.src = './images/game-over.png';
        mario.classList.add('mario-dead');
        endGameImage.style.display = 'block';
        gameOverOptions.style.display = 'block';
        gameStarted = false;
        cancelAnimationFrame(loop);
        return;
    }

    loop = requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
    }
});

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startGameImage.addEventListener('click', () => {
    sounds.letsGo.play();
    sounds.backgroundMusic.play();

    startScreen.style.display = 'none';
    
    pipe.style.animation = 'none';
    void pipe.offsetWidth;
    pipe.style.animation = `pipe-animation ${pipeAnimationDuration}s infinite linear`;
    
    gameStarted = true;
    gameLoop();
});

// Adicionando controle de volume
document.getElementById('musicVolume').addEventListener('input', (event) => {
    sounds.backgroundMusic.volume = event.target.value;
});

document.getElementById('sfxVolume').addEventListener('input', (event) => {
    let volume = event.target.value;
    for (let sound in sounds) {
        if (sound !== 'backgroundMusic') {
            sounds[sound].volume = volume;
        }
    }
});

