const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// kuvien ja arvojen rivi
const items = [
  { name: "walter", image: "lataus.jpg" },
  { name: "smiley", image: "smiley.jpg  " },
  { name: "manface", image: "manface.jpg" },
  { name: "chad", image: "chad.jpg" },
  { name: "smiley2", image: "free-smileys-faces-de-emoji.gif" },
  { name: "cola", image: "cola.png" },
  { name: "burger", image: "burger.jpg" },
  { name: "heavy", image: "heavy.png" },
];

//Ajastimen asetus
let seconds = 0,
  minutes = 0;
//Siirtojen ja voittojen lukemat
let movesCount = 0,
  winCount = 0;

//Ajastin
const timeGenerator = () => {
  seconds += 1;
  //Kun 60 sekunttia menee, muodostuu 1 minuutti
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //asettaa ajan oikein stringiin
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Aika:</span>${minutesValue}:${secondsValue}`;
};

//Yritysten lasku
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Yritykset:</span>${movesCount}`;
};

//Valitsee satunnaisen arvon items rivistä
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  let cardValues = [];
  //Luo rivistä 4*4 taulukon
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Luo kortit
        ennen => etupuoli (näyttää kysymysmerkkiä)
        jälkeen => takapuoli (näyttää items riviin syötetyn kuvan);
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Gridi
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Kortit
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Jos valittua korttia ei vielä täsmää, suorita vain (eli jo napsautettu kortti jätetään huomioimatta)
      if (!card.classList.contains("matched")) {
        //Kääntää klikatun kortin
        card.classList.add("flipped");
        //Jos se on ensimmäinen kortti (!firstCard koska firstCard on alun perin epätosi)
        if (!firstCard) {
          //joten ensimmäisestä kortista tulee firstCard
          firstCard = card;
          //ensimmäisen kortin arvoksi tulee firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //lisää siirron, kun pelaaja on kääntänyt toisen kortin
          movesCounter();
          //secondCard ja arvo
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //jos firstCard ja secondCard on samat, nämä kortit jätetään huomioimatta seuraavalla kerralla
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //asettaa firstCard falseksi, koska seuraava kortti on ensimmäinen
            firstCard = false;
            //voittolaskurin lisääminen, kun pelaaja löytää samat kortit
            winCount += 1;
            //tarkista jos winCount on puolet cardValuesta
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Voitit!</h2>
            <h4>Yritykset: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //jos kortit eivät ole samat
            //kääntää kortit takaisin normaaleiksi
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Aloita peli nappi aloittaa pelin
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //nappien näkyvyys
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Aloittaa ajastimen
  interval = setInterval(timeGenerator, 1000);
  //Yritykset
  moves.innerHTML = `<span>Yritykset:</span> ${movesCount}`;
  initializer();
});

//Lopeta Peli nappi lopettaa pelin
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Ottaa ylös arvot
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
