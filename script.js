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

/* -------------- Shuffling cards ----------------- */

// let arrayCards = ["sun", "rain", "snow"];
let $cardSun = document.querySelector("#card0");
let $cardRain = document.querySelector("#card1");
let $cardSnow = document.querySelector("#card2");

let arrayCards = [$cardSun, $cardRain, $cardSnow];

arrayCards.sort(
  () => {
    if (Math.random() > 0.5) {
      return 1;
    } else {
      return -1;
    }
  }
  // (Math.random() > 0.5 ? 1 : -1)
);

console.log(arrayCards);
