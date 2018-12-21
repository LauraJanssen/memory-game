// Define the variables needed globally
let counter = 0;
let amountOfStars = 3;
let cardsToMatch = [];
let gameStarted = false;

// Allow user to reset the game at any time
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
  window.location.reload();
})

// call function which will do everything needed before the game can start (e.g. create logo's, shuffle them, and assign them to the cards in the deck)
prepareTheGame();

function prepareTheGame() {
  const logos = [
    'fa-futbol',
    'fa-futbol',
    'fa-dove',
    'fa-dove',
    'fa-feather-alt',
    'fa-feather-alt',
    'fa-music',
    'fa-music',
    'fa-shopping-cart',
    'fa-shopping-cart',
    'fa-tree',
    'fa-tree',
    'fa-toilet-paper',
    'fa-toilet-paper',
    'fa-cat',
    'fa-cat'
  ];
  const randomLogos = shuffle(logos);
  // select all the spans of the cards and assign random logos to them
  const cardSpans = document.querySelectorAll('.cards span');
  cardSpans.forEach((card, index) => {
    const classToAdd = randomLogos[index];
    card.classList.add(classToAdd);
  })
  const section = document.getElementById('cards');
  // Add event listener for the section containing all the cards
  section.addEventListener('click', toggleCard);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function toggleCard(e) {
  // Only start the timer after the first card is flipped
  if (gameStarted === false) {
    gameStarted = true;
    startTheGame();
  }

  const card = e.target;
  // select the span or when the span itself is clicked, use the span because the target will be null
  const cardLogo = card.querySelector('span') || card;
  // Don't do anything if the card clicked is part of an already matched pair
  if (cardLogo.classList.contains('rotate-scale-up')) {
    return;
  }
  if (cardLogo.classList.contains('card-closed') || cardLogo.classList.contains('puff-out-center') ) {
    cardLogo.classList.remove('card-closed');
    cardLogo.classList.remove('puff-out-center');
    cardsToMatch.push(cardLogo);
    if (cardsToMatch.length === 2) {
      updateCounter();
      console.log('updated counter', counter);
      checkForMatch();
    }
  } else {
    cardLogo.classList.add('card-closed');
    cardsToMatch = [];
  }
}

function updateCounter() {
  const counterElement = document.getElementById('counter');
  counter++;
  counterElement.innerHTML = counter;
  // check if star should be removed after updating counter
  removeStars();
}

function checkForMatch() {
  if (cardsToMatch[0].classList.item(1) === cardsToMatch[1].classList.item(1)) {
    console.log('Match!');
    cardsToMatch.forEach((card) => {
      card.classList.add('rotate-scale-up');
    })
    cardsToMatch = [];
    checkIfWon();
  } else {
    console.log('No match :(');
    cardsToMatch.forEach((card) => {
      setTimeout(function() {
        card.classList.add('puff-out-center');
      }, 600);
    })
    cardsToMatch = [];
  }
}

function checkIfWon() {
  const spans = Array.from(document.querySelectorAll('.fas'));
  const hasClosedCards = spans.some((span) => {
    return span.classList.contains('card-closed') || span.classList.contains('puff-out-center');
  });
  if (hasClosedCards) {
    console.log('user did not win yet');
  } else {
    clearTimeout(t);
    console.log('user has won, opening modal');
    openWinningModal();
  }
}

function openWinningModal() {
  // Invoke modal constructor
  const modal = new Modal(document.querySelector('.modal-overlay'), hours, minutes, seconds);
  modal.open();
}

// Modified this example from a later class which refers to https://lowrey.me/modals-in-pure-es6-javascript/
class Modal {
  constructor(overlay, hours, minutes, seconds) {
    this.overlay = overlay;
    // Cancel button closes the modal without resetting the game
    const cancelButton = overlay.querySelector('#cancel');
    cancelButton.addEventListener('click', this.close.bind(this));
    // Allow user to reset the game from the modal
    const resetButtonModal = overlay.querySelector('#reset-button-modal');
    resetButtonModal.addEventListener('click', function() {
      window.location.reload();
    })
    const dialogCounterElement = overlay.querySelector('#amount-of-moves');
    const dialogTimeElement = overlay.querySelector('#time-elapsed');
    const dialogStarsElement = overlay.querySelector('#stars-received');

    dialogCounterElement.innerHTML = 'You have used ' + counter + ' moves to win';
    dialogTimeElement.innerHTML = 'It took you a whopping ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds';
    dialogStarsElement.innerHTML = getStarsMessage();
  }
  open() {
    this.overlay.classList.remove('is-hidden');
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }
}

// Declare timer units globally because function needs to be repeated and else it would be reset and never count past 1 second
let seconds = 0;
let minutes = 0;
let hours = 0;
let t = 0;

function add() {
  // Display elapsed time to the player
  let timerElement = document.getElementsByTagName('time')[0];
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  timerElement.textContent = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0' + seconds);

  timer();
}

function timer() {
  // Add a second everytime timer is called
  t = setTimeout(add, 1000);
}

function startTheGame() {
  timer();
}

// Keep track of amount of moves and delete stars if certain treshholds are reached
function removeStars () {
  if (counter === 10) {
    const starThree = document.getElementById('star-3');
    starThree.remove();
    amountOfStars = 2;
  } else if (counter === 16) {
    const starTwo = document.getElementById('star-2');
    starTwo.remove();
    amountOfStars = 1;
  } else if (counter === 22) {
    const starOne = document.getElementById('star-1');
    starOne.remove();
    amountOfStars = 0;
  } else {
    return;
  }
}

function getStarsMessage() {
  if (amountOfStars === 3 || amountOfStars === 2 || amountOfStars === 0) {
    return 'I will award you ' + amountOfStars + ' stars for this achievement';
  } else {
    return 'I will award you ' + amountOfStars + ' star for this achievement';
  }
}
