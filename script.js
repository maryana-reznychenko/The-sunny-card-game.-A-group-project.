// 1. create the user (input name)
// 2. Create a object of icons (max 10) (id 01: 😀, id 02: 😇 )
// User = icons + name --> 😀 Carmela - 😇 Maryana - 🤪 Marcus

//Show cards from existing divs (pictures)
// create three cards (back and front)
// three picture : sun - rain - snow

// Show the cards in front
// flip cards in back
// mix thouse cards

// add click to the each card
// turn (flip) the card

// if it is the right card is The Sun card --> 1 point

//------------------------------------------------
// Here we get form from, select and input from html document
let playerFormEl = document.querySelector("#playerName");
let playerIconsEl = document.querySelector("#playerIcons");
let inputPlayerEl = document.querySelector(".input-player");
let playerInfo = {};
let leaderBoardEl = document.querySelector("#leaderBoard");

function getPlayer() {
  playerInfo = {
    icons: playerIconsEl.querySelector(`option[value=${playerIconsEl.value}]`)
      .textContent,
    name: inputPlayerEl.value,
    score: 0,
  };
  return playerInfo;
}

playerFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  getPlayer();
  playerFormEl.classList.add("hide-input");
});

function getLeaderboard() {
  let players = [];
  if (localStorage.getItem("players")) {
    // usiamo try per evitare che in caso ci sia qualcosa di non corretto in localstorage
    // il gioco non crash
    try {
      const playersInLocalStorage = JSON.parse(localStorage.getItem("players"));
      if (
        // qui controlliamo che localstorage contiene un array
        Array.isArray(playersInLocalStorage)
      ) {
        players = playersInLocalStorage;
      }
    } catch (err) {}
  }
  return players;
}

function savePlayerScore() {
  playerInfo.score = points;
  let players = getLeaderboard();

  players.push(playerInfo);
  localStorage.setItem("players", JSON.stringify(players));
}

function showLeaderBoard() {
  // prendi i giocatori
  let playersArray = getLeaderboard();

  // ordinare per punti
  playersArray.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      return 0;
    }
  });

  // limitare 4 / 5
  playersArray = playersArray.slice(0, 4);
  console.log(playersArray);
  leaderBoardEl.innerHTML = "";
  // ciclo nell'oggetto
  // mi prendo gli elementi
  // per ogni elemento aggiungo un nodo al dom
  for (let player of playersArray) {
    // non fare cosi perchè https://owasp.org/www-community/attacks/xss/
    // const li = `<li><span class="icon">${player.icons}</span><span class="name">${player.name}</span><span class="score">${player.score}</span></li>`;
    // leaderBoardEl.innerHTML += li;
    const li = document.createElement("li");
    const spanIcon = document.createElement("span");
    spanIcon.textContent = player.icons;
    spanIcon.className = "leaderBoard-icon";
    li.appendChild(spanIcon);
    const spanName = document.createElement("span");
    spanName.textContent = player.name;
    spanName.className = "leaderBoard-name";
    li.appendChild(spanName);
    const spanScore = document.createElement("span");
    spanScore.textContent = player.score;
    spanScore.className = "leaderBoard-score";
    li.appendChild(spanScore);

    leaderBoardEl.appendChild(li);
  }
}

//------------------------------------------------
// Here we get the id from each card div and assign it to a
// respective element.

let cardEl0 = document.querySelector("#cardDiv0");
let cardEl1 = document.querySelector("#cardDiv1");
let cardEl2 = document.querySelector("#cardDiv2");

// To make it a bit easier to handle these elements, we assign
// each element to a slot in an array, so that we can write
// cardIndex[0] instead of the name of the element, and so
// that we can use the elements in for-loops.

const cardIndexes = [cardEl0, cardEl1, cardEl2];

// We create an array with the different types that a card can have:

let cardTypes = ["Sun", "Rain", "Snow"];

// Because we want to be able to re-use the array above,
// we create an entirely new array that we can scramble
// as we like:

let scrambledCardArray = [];

// Here we define the variables that count points and the number of rounds
// played:

let points = 0;
let roundsPlayed = 0;

// We want the divs in our HTML to be clickable, so we set up
// event listners for each of the divs by calling the
// setListners() function.

setListners();

// When we have set up the event listners for the cards, we
// start the main game loop:
showLeaderBoard();
gameLoop();

// Here is the main game loop. When the game loop runs,
// it first checks to see if the player has already played
// 3 rounds. If this is the case, it will post game over and the score.
// Then it hides the divs so the player can't click them.
// If the player still as rounds to play, the game loop begins
// by scrambling the cards. It then assigns a card type to each
// of the card elements (cardDiv0 etc.)
// After this is done, it adds one to the rounds played tracker.

function gameLoop() {
  if (roundsPlayed < 3) {
    scrambleCards();
    drawCards();
    roundsPlayed++;
  } else {
    console.log(`Game over. You scored ${points} out of 3!`);
    savePlayerScore();
    removeButtons();
    // show leaderBoard
    showLeaderBoard();
  }
}

// Here is the function to set up the event listeners for the
// card divs:

function setListners() {
  // Remember that cardIndexes holds the elements that we have assigned
  // to point to the different divs, for example cardDiv0. So here,
  // we go through each of these divs and assign an event listener to them,
  // which calls the function handleClick().
  //    In the anonymous function, "card" represents whatever div (cardDiv0 etc.)
  // that the loop is handling in that instance. So if we are on the second
  // iteration of the loop, for example, "card" will equal "cardDiv1",
  // and the "i" will be the number of that index, so in this case 1 [because 0, 1, 2].

  cardIndexes.forEach(function (card, i) {
    card.addEventListener("click", function () {
      // When the button/card is clicked, the handleClick function is called,
      // and we send it whichever div happens to be assigned to that respective card.
      // So if we click for example cardDiv0, we run handleClick(cardDiv0);

      handleClick(card);
    });
  });
}

// Here is the handleClick function. This function takes whatever text has been
// randomly assigned to a div, and compares it to the string "SUN" when the
// div is clicked. .

function handleClick(checkedCard) {
  // If it is "SUN", then we add one point to the points variable.
  // After either of these is done, we execute gameLoop(); again. This is what
  // creates the function inside a function (because right now, the previous gameLoop is
  // still running.) The reason for this is that if we had put everything in a for-loop,
  // the for-loop wouldn't stop to wait and see if the event listeners had been clicked. It
  // would just finish running until the game is over, before the player even has a chance to
  // do anything.

  if (checkedCard.textContent.toUpperCase() === "SUN") {
    points++;
    console.log("Correct guess!");

    // If cardDiv0, for example, has been assigned the string
    // "Rain", handleClick will receive "cardDiv0", and see if cardDiv0.textContent === "SUN".
    // Because this returns false, it will console.log "Wrong!"
  } else {
    console.log("Wrong!");
  }

  gameLoop();
}

function drawCards() {
  cardIndexes.forEach(function (card, i) {
    card.textContent = scrambledCardArray[i];
  });
}

// When we have completed the game, we want to make sure the player
// cannot click the buttons anymore. But because the gameLoop() function
// ends up being a function inside a function inside a function, we can't
// use removeEventListner (because if we do this in the last function, the
// event listners of the previous function will still be active.)
// So instead we just hide the div elements when the game is done.

function removeButtons() {
  cardEl0.style.display = "none";
  cardEl1.style.display = "none";
  cardEl2.style.display = "none";
}

// This is the function for scrambling an array:

function scramble(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// This function gets the cardTypes array, scrambles it, and
// assigns it to the scrambledCardsArray.

function scrambleCards() {
  scrambledCardArray = scramble(cardTypes);
}
