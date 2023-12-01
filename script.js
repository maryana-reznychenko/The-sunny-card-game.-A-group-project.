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

let cardEl0 = document.querySelector("#cardDiv0");
let cardEl1 = document.querySelector("#cardDiv1");
let cardEl2 = document.querySelector("#cardDiv2");

const cardIndexes = [cardEl0, cardEl1, cardEl2];

let cardTypes = ["Sun", "Rain", "Snow"];
let scrambledCardArray = [];

let points = 0;
let roundsPlayed = 0;

setListners();
gameLoop();

function gameLoop() {
  if (roundsPlayed < 3) {
    scrambleCards();
    drawCards();
    roundsPlayed++;
  } else {
    console.log(`Game over. You scored ${points} out of 3!`);
    removeButtons();
  }
}

function setListners() {
  cardIndexes.forEach(function (card, i) {
    card.addEventListener("click", function () {
      handleClick(card);
    });
  });
}

function removeButtons() {
  cardEl0.style.display = "none";
  cardEl1.style.display = "none";
  cardEl2.style.display = "none";
}

function handleClick(checkedCard) {
  if (checkedCard.textContent.toUpperCase() === "SUN") {
    points++;
    console.log("Correct guess!");
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

function scrambleCards() {
  scrambledCardArray = scramble(cardTypes);
}

function scramble(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
