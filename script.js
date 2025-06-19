let cards = [];
let flippedCards = [];
let matchedCards = 0;
let lockBoard = false;
let isGameRunning = false;

let timerInterval;
let secondsElapsed = 0;

// Lista de áudios de acerto e erro
const acertoAudios = [
  new Audio('audio/acerto1.mp3'),
  new Audio('audio/acerto2.mp3'),
  new Audio('audio/acerto3.mp3')
];

const erroAudios = [
  new Audio('audio/erro1.mp3'),
  new Audio('audio/erro2.mp3'),
  new Audio('audio/erro3.mp3')
];

const vitoriaAudio = new Audio('audio/vitoria.mp3');
vitoriaAudio.preload = 'auto';

const imageUrls = [
  'img/halo.png', 'img/minecraft.png', 'img/halflife.png', 'img/gta.png',
  'img/fortnite.png', 'img/zelda.png', 'img/reddead.png', 'img/amongus.png',
  'img/sun.png', 'img/bf1.png', 'img/doom.png', 'img/cath.png', 'img/danji.png',
  'img/fallout.png', 'img/forza.png', 'img/mario.png', 'img/pgr.png',
  'img/skyrim.png', 'img/vargil.png', 'img/truk.png'
];

function tocarAudioAleatorio(listaAudios) {
  const index = Math.floor(Math.random() * listaAudios.length);
  const audio = listaAudios[index];
  audio.currentTime = 0;
  audio.play();
  return audio;
}

function startGame(difficulty) {
  isGameRunning = true;
  const combinations = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
  cards = [];
  matchedCards = 0;
  flippedCards = [];
  lockBoard = false;
  document.getElementById('game-board').innerHTML = '';
  document.getElementById('message').style.display = 'none';
  window.lastDifficulty = difficulty;

  clearInterval(timerInterval);
  secondsElapsed = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);

  const shuffledImages = [...imageUrls].sort(() => 0.5 - Math.random());
  const selectedImages = shuffledImages.slice(0, combinations);
  const gameImages = [...selectedImages, ...selectedImages];
  cards = gameImages.sort(() => 0.5 - Math.random());

  cards.forEach((image) => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (difficulty === 'medium') card.classList.add('medium');
    if (difficulty === 'hard') card.classList.add('hard');

    card.setAttribute('data-image', image);

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.style.backgroundImage = `url(${image})`;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', flipCard);
    document.getElementById('game-board').appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || flippedCards.length >= 2 || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const img1 = firstCard.getAttribute('data-image');
  const img2 = secondCard.getAttribute('data-image');

  if (img1 === img2) {
    matchedCards += 2;
    const acertoAudio = tocarAudioAleatorio(acertoAudios);

    acertoAudio.onended = () => {
      flippedCards = [];

      if (matchedCards === cards.length) {
        document.getElementById('message').textContent = '🎉 Parabéns! Você ganhou!';
        document.getElementById('message').style.display = 'block';
        clearInterval(timerInterval);
        isGameRunning = false;

        vitoriaAudio.currentTime = 0;
        vitoriaAudio.play();
        vitoriaAudio.onended = () => {
          lockBoard = false;
        };
      } else {
        lockBoard = false;
      }
    };
  } else {
    const erroAudio = tocarAudioAleatorio(erroAudios);

    erroAudio.onended = () => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    };
  }
}

function restartGame() {
  const board = document.getElementById('game-board');
  board.style.opacity = 0;

  setTimeout(() => {
    const difficulty = window.lastDifficulty || 'easy';
    isGameRunning = false;
    startGame(difficulty);
    board.style.opacity = 1;
  }, 500);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
  const seconds = String(secondsElapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `⏱ Tempo: ${minutes}:${seconds}`;
}
