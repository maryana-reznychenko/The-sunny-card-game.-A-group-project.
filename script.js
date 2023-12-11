const CARD_WIDTH = 200;
const CARD_SPACING = 25;
const AMOUNT_OF_SHUFFLES = 10;
const MAX_ROUNDS = 6;
let SHUFFLE_SPEED = 250;

const CARD_SPREAD_PAUSE = 1000;

const FLIP_ANIMATION_TIME = 500;
const FLIP_PAUSE = 500;

const CARD_FLIP_TIMEOUT = FLIP_ANIMATION_TIME * 2 + FLIP_PAUSE;

const SHUFFLE_TIMEOUT = CARD_FLIP_TIMEOUT + FLIP_ANIMATION_TIME * 2;
// Needs to be 1000 ms less than SHUFFLE_TIMEOUT
// to allow the cards time to flip (500 ms forward and backward).

const TOTAL_SHUFFLE_TIME = SHUFFLE_TIMEOUT + SHUFFLE_SPEED * AMOUNT_OF_SHUFFLES;

const GAME_OVER_PAUSE = 1500;

let cardEls = document.querySelectorAll(".card");
let buttonStart = document.querySelector(".button-start");

let points = 0;
let roundsPlayed = 0;
let cards = [0, 1, 2];

/*------------------------------------------------
 CREATE PLAYER AND SAVE IN LEADERBOARD
------------------------------------------------*/
// Get HTML elements for player form, select, input, and leaderboard
let playerFormEl = document.querySelector("#playerName");
let playerIconsEl = document.querySelector("#playerIcons");
let inputPlayerEl = document.querySelector(".input-player");
let playerInfo = {};
let leaderBoardEl = document.querySelector("#leaderBoard");

// Function to retrieve player information from the form
function getPlayer() {
  // Extract player information from the form elements
  playerInfo = {
    icons: playerIconsEl.querySelector(`option[value=${playerIconsEl.value}]`)
      .textContent,
    name: inputPlayerEl.value,
    score: 0,
  };
  return playerInfo;
}

// Event listener for player form submission
playerFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  getPlayer(); // Get player info
  playerFormEl.classList.add("hide-input");
  showLeaderBoard(); // This line is added to display the leaderboard before the game starts
  // Hide the player input form

  speedButtons();
  setTimeout(shuffleCardsOnce, CARD_SPREAD_PAUSE);
});

// Function to retrieve leaderboard data from local storage
function getLeaderboard() {
  let players = [];

  if (localStorage.getItem("players")) {
    // Use try-catch to prevent crashes if local storage data is not valid JSON
    try {
      const playersInLocalStorage = JSON.parse(localStorage.getItem("players"));

      // Check if the data in local storage is an array
      if (Array.isArray(playersInLocalStorage)) {
        players = playersInLocalStorage;
      }
    } catch (err) {}
  }
  return players;
}

// Function to save player's score to the leaderboard in local storage
function savePlayerScore() {
  playerInfo.score = points; // Assuming 'points' is a global variable
  let players = getLeaderboard();

  // Add the current player's info to the leaderboard
  players.push(playerInfo);
  localStorage.setItem("players", JSON.stringify(players));
}

// Function to display the leaderboard on the webpage
function showLeaderBoard() {
  // Retrieve players from the leaderboard
  let playersArray = getLeaderboard();

  // Sort players by score in descending order
  playersArray.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      return 0;
    }
  });

  // Limit the displayed players to 5
  playersArray = playersArray.slice(0, 6);
  console.log("playersArray", playersArray);

  // Clear the existing leaderboard content
  leaderBoardEl.innerHTML = "";

  // Iterate through the player data and create HTML elements to display on the leaderboard
  for (let player of playersArray) {
    /*  non fare cosi perchÃ¨ https://owasp.org/www-community/attacks/xss/
    const li = `<li><span class="icon">${player.icons}</span><span class="name">${player.name}</span><span class="score">${player.score}</span></li>`;
    leaderBoardEl.innerHTML += li; */

    // Create li element for each player
    const li = document.createElement("li");
    // Create span element for player icon
    const spanIcon = document.createElement("span");
    spanIcon.textContent = player.icons;
    spanIcon.className = "leaderBoard-icon";
    li.appendChild(spanIcon);

    // Create span element for player name
    const spanName = document.createElement("span");
    spanName.textContent = player.name;
    spanName.className = "leaderBoard-name";
    li.appendChild(spanName);

    // Create span element for player score
    const spanScore = document.createElement("span");
    spanScore.textContent = player.score;
    spanScore.className = "leaderBoard-score";
    li.appendChild(spanScore);

    // Append the li element to the leaderboard
    leaderBoardEl.appendChild(li);
  }
}

// ---------------------------------------------
// ---------------------------------------------
// GAME FUNCTIONALITY
// ---------------------------------------------
// ---------------------------------------------

//

// Game Setup:

buttonStart.addEventListener("click", function () {
  buttonStart.classList.add("button-off"); // Button off after starting game.
  startGame();
});

cardsAddFlipped();
showLeaderBoard();

// Starts the game when clicking the START button:

function startGame() {
  //
  // Add correctCard function to the right card:

  let correctEl = document.querySelector(".card--sun");
  correctEl.addEventListener("click", function () {
    correctCard();
  });

  // Add falseCard function to the wrong cards:

  let falseElBlue = document.querySelector(".card--snow");
  falseElBlue.addEventListener("click", function () {
    falseCard();
  });

  let falseElGreen = document.querySelector(".card--rain");
  falseElGreen.addEventListener("click", function () {
    falseCard();
  });

  // The first round is run here automatically when the player
  // presses START. Subsequent rounds run with the event listeners above.

  shuffleFunc();
}

// This function runs when the correct card is clicked:

function correctCard() {
  //
  // If rounds are maxed out, run end-game function:

  if (roundsPlayed === MAX_ROUNDS - 1) {
    console.log("max round-1", MAX_ROUNDS - 1);
    points += 1;
    roundsPlayed++;
    updateInfoCorrect();
    endGame();
    // Otherwise add one point and a round, and run the shuffle function:
  } else {
    roundsPlayed += 1;
    points += 1;
    updateInfoCorrect();
    shuffleFunc();
  }
}

// This function runs if the wrong card is picked:

function falseCard() {
  // If rounds are maxed out, run end function:
  if (roundsPlayed === MAX_ROUNDS - 1) {
    roundsPlayed++;
    updateInfoWrong();
    endGame();

    // Otherwise add point and round, and shuffle cards again:
  } else {
    roundsPlayed += 1;
    updateInfoWrong();
    shuffleFunc();
  }
}

// Functions for updating the game info:
let gameInfoEl = document.getElementById("game__info");

function updateInfoCorrect() {
  gameInfoEl.innerHTML = `<br>Correct!<br><br>Rounds played:<br>${roundsPlayed} of ${MAX_ROUNDS}.<br><br>Points: ${points}`;
}

function updateInfoWrong() {
  gameInfoEl.innerHTML = `<span>Wrong!</span><span>Rounds played:<br>${roundsPlayed} of ${MAX_ROUNDS}.</span><span>Points: ${points}</span>`;
}

// ---------------------------------------------
// ---------------------------------------------
// CARD FLIP FUNCTIONALITY
// ---------------------------------------------
// ---------------------------------------------

function flipCard(e) {
  const clickedCard = e.currentTarget;
  clickedCard.classList.toggle("flipCard");
}

// This function flips all cards once, and flips them back
// after a timeout:

function flipAllCards() {
  cardsRemoveFlipped();
  setTimeout(cardsAddFlipped, CARD_FLIP_TIMEOUT);
}

// Function for adding the card--flipped class to all the cards:

function cardsAddFlipped() {
  let cardEl1 = document.querySelector(".card--sun");
  let cardEl2 = document.querySelector(".card--snow");
  let cardEl3 = document.querySelector(".card--rain");

  cardEl1.classList.add("card--flipped");
  cardEl2.classList.add("card--flipped");
  cardEl3.classList.add("card--flipped");
}

// Function for removing it:

function cardsRemoveFlipped() {
  let cardEl1 = document.querySelector(".card--sun");
  let cardEl2 = document.querySelector(".card--snow");
  let cardEl3 = document.querySelector(".card--rain");

  cardEl1.classList.remove("card--flipped");
  cardEl2.classList.remove("card--flipped");
  cardEl3.classList.remove("card--flipped");
}

// ---------------------------------------------
// ---------------------------------------------
// CARD SHUFFLE FUNCTIONALITY
// ---------------------------------------------
// ---------------------------------------------

// This function runs the function disabling click possibility
// while the cards are shuffling. Then it flips the cards
// and shuffles them.

function shuffleFunc() {
  disableCardPointerEvents();
  flipAllCards();
  setTimeout(roundOfShuffles, SHUFFLE_TIMEOUT);
}

// Functionality for one instance of card shuffling:

function shuffleCardsOnce() {
  let cardShuffle;
  do {
    cardShuffle = cards.slice().sort(() => Math.random() - 0.5);
  } while (arraysEqual(cards, cardShuffle));

  cards = cardShuffle;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardEl = cardEls[card];

    cardEl.style.zIndex = Math.ceil(Math.random() * 5) + 1;
    cardEl.style.translate = `${i * (CARD_WIDTH + CARD_SPACING)}px`;
  }
}

// This function runs the shuffling instance a set number of times
// and then re-adds the pointer events (clickability):

function roundOfShuffles() {
  let count = 0;
  let interval = setInterval(function () {
    shuffleCardsOnce();
    count += 1;

    // Exit interval
    if (count === AMOUNT_OF_SHUFFLES) {
      enableCardPointerEvents();
      clearInterval(interval);
    }
  }, SHUFFLE_SPEED);
}

// ---------------------------------------------
// ---------------------------------------------
// DISABLE/ENABLE POINTER EVENTS
// ---------------------------------------------
// ---------------------------------------------

function disableCardPointerEvents() {
  cardEls.forEach((cardEl) => {
    cardEl.classList.add("shuffle-in-progress");
  });
}

function enableCardPointerEvents() {
  cardEls.forEach((cardEl) => {
    cardEl.classList.remove("shuffle-in-progress");
  });
}

// ---------------------------------------------
// ---------------------------------------------
// END-GAME SCREEN FUNCTIONALITY
// ---------------------------------------------
// ---------------------------------------------

function endGame() {
  savePlayerScore();
  showLeaderBoard();

  cardsRemoveFlipped();

  setTimeout(displayEndBoard, GAME_OVER_PAUSE);

  function displayEndBoard() {
    let endEl = document.querySelector(".game-over");
    endEl.style.display = "flex";

    let scoreEl = document.querySelector(".score");
    scoreEl.textContent = `You scored ${points} out of ${MAX_ROUNDS}!`;

    let button = document.querySelector(".restart__button");
    button.addEventListener("click", function () {
      location.reload();
    });
  }
}

// ---------------------------------------------
// ---------------------------------------------
// FUNCTION FOR COMPARING THE CARD ARRAYS
// ---------------------------------------------
// ---------------------------------------------

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function speedButtons() {
  let easyBtnEl = document.getElementById("easy");
  let mediumBtnEl = document.getElementById("medium");
  let hardBtnEl = document.getElementById("hard");

  easyBtnEl.addEventListener("click", function () {
    setSpeed(400);
    console.log("Speed set 400");
    deactivateSpeedButtons();
    easyBtnEl.classList.add("button-off-difficulty-selected");
  });

  mediumBtnEl.addEventListener("click", function () {
    setSpeed(300);
    console.log("Speed set 300");
    deactivateSpeedButtons();
    mediumBtnEl.classList.add("button-off-difficulty-selected");
  });

  hardBtnEl.addEventListener("click", function () {
    setSpeed(250);
    console.log("Speed set 250");
    deactivateSpeedButtons();
    hardBtnEl.classList.add("button-off-difficulty-selected");
  });
}

function setSpeed(speed) {
  SHUFFLE_SPEED = speed;
  const card = document.querySelector(".card");

  cardEls.forEach((cardEl) => {
    cardEl.style.transition = ""; // Resetting inline style
  });
  card.style.transition = `translate ${speed}ms linear, transform 500ms ease-out`;
}

function deactivateSpeedButtons() {
  let easyBtnEl = document.getElementById("easy");
  let mediumBtnEl = document.getElementById("medium");
  let hardBtnEl = document.getElementById("hard");

  easyBtnEl.classList.add("button-off-difficulty");
  mediumBtnEl.classList.add("button-off-difficulty");
  hardBtnEl.classList.add("button-off-difficulty");

  buttonStart.classList.remove("button-off");
}

// ---------------------------------------------
// ---------------------------------------------
// THE THIRD PART API https://rapidapi.com/zugravuandrei/api/sun-seeker-api
// ---------------------------------------------
// ---------------------------------------------

async function getTheSunData() {
  const url =
    "https://sun-seeker-api.p.rapidapi.com/sunposition?lat=59.301292&lon=18.090621";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ef46fd157msh1d075513f6e7d12p11a071jsn8ff171b91272",
      "X-RapidAPI-Host": "sun-seeker-api.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    let azimuthEl = document.querySelector("#azimuth");
    azimuthEl.textContent = `The sun azimuth --> ${result.azimuth}˚`;

    let elevationEl = document.querySelector("#elevation");
    elevationEl.textContent = `The sun elevation --> ${result.elevation}˚`;
  } catch (error) {
    console.error(error);
  }
}
getTheSunData();
