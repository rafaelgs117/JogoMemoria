
let cards = [];
let flippedCards = [];
let matchedCards = 0;

const imageUrls = [
  'img/halo.png',
  'img/minecraft.png',
  'img/halflife.png',
  'img/gta.png',
  'img/fortnite.png',
  'img/zelda.png',
  'img/reddead.png',
  'img/amongus.png',
  'img/sun.png',
  'img/bf1.png',
];

function startGame(difficulty) {
  const combinations = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
  cards = [];
  matchedCards = 0;
  flippedCards = [];
  document.getElementById('game-board').innerHTML = '';
  window.lastDifficulty = difficulty;

  const selectedImages = imageUrls.slice(0, combinations);
  const gameImages = [...selectedImages, ...selectedImages]; // Duplicar para pares
  cards = gameImages.sort(() => 0.5 - Math.random());

  cards.forEach((image) => {
    const card = document.createElement('div');
    card.classList.add('card');
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
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const img1 = firstCard.getAttribute('data-image');
  const img2 = secondCard.getAttribute('data-image');

  if (img1 === img2) {
    matchedCards += 2;
    if (matchedCards === cards.length) {
      alert('Parabéns! Você ganhou!');
    }
  } else {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
  }
  flippedCards = [];
}

function restartGame() {
  // Reinicia com a última dificuldade escolhida ou 'easy' por padrão
  const difficulty = window.lastDifficulty || 'easy';
  startGame(difficulty);
}
