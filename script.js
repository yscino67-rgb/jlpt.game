let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let tries = 0;
let matchedCount = 0;
let selectedWords = [];
let currentMode = "meaning";

const wordPage = document.getElementById("wordPage");
const gamePage = document.getElementById("gamePage");
const wordList = document.getElementById("wordList");
const grid = document.getElementById("grid");
const info = document.getElementById("info");

let wordStates = {};
let grammarStates = {};

function showWordList() {
  wordList.innerHTML = "";

  words.forEach((word) => {
    const div = document.createElement("div");
    div.className = "word-item";
    div.onclick = () => cycleColor(word.kanji, div);

    const state = wordStates[word.kanji] || 0;
    if (state === 1) div.classList.add("state-green");
    if (state === 2) div.classList.add("state-blue");
    if (state === 3) div.classList.add("state-red");

    div.innerHTML = `
      <div class="word-kanji">${word.kanji}</div>
      <div class="word-hira">${word.hira}</div>
      <div class="word-kr">${word.kr}</div>
    `;

    wordList.appendChild(div);
  });
}

function cycleColor(wordKey, div) {
  const current = wordStates[wordKey] || 0;
  const next = (current + 1) % 4;

  wordStates[wordKey] = next;

  div.classList.remove("state-green", "state-blue", "state-red");

  if (next === 1) div.classList.add("state-green");
  if (next === 2) div.classList.add("state-blue");
  if (next === 3) div.classList.add("state-red");
}

function showWordPage() {
  wordPage.classList.remove("hidden");
  gamePage.classList.add("hidden");
  grammarPage.classList.add("hidden");
}

const grammarPage = document.getElementById("grammarPage");
const grammarDiv = document.getElementById("grammarList");

function showGrammarPage() {
  wordPage.classList.add("hidden");
  gamePage.classList.add("hidden");
  grammarPage.classList.remove("hidden");
  renderGrammar();
}

function renderGrammar() {
  grammarDiv.innerHTML = "";

  grammarListData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "grammar-item";
    div.onclick = () => cycleGrammarColor(item.grammar, div);

    const state = grammarStates[item.grammar] || 0;
    if (state === 1) div.classList.add("state-green");
    if (state === 2) div.classList.add("state-blue");
    if (state === 3) div.classList.add("state-red");

    div.innerHTML = `
      <div class="grammar-title">${item.grammar}</div>
      <div class="grammar-meaning">${item.meaning}</div>
    `;

    grammarDiv.appendChild(div);
  });
}

function cycleGrammarColor(grammarKey, div) {
  const current = grammarStates[grammarKey] || 0;
  const next = (current + 1) % 4;

  grammarStates[grammarKey] = next;

  div.classList.remove("state-green", "state-blue", "state-red");

  if (next === 1) {
    div.classList.add("state-green");
    div.style.backgroundColor = "#8bc34a";
  } else if (next === 2) {
    div.classList.add("state-blue");
    div.style.backgroundColor = "#42a5f5";
  } else if (next === 3) {
    div.classList.add("state-red");
    div.style.backgroundColor = "#ef5350";
  } else {
    div.style.backgroundColor = "white";
  }
}

function startGame(mode = currentMode) {
  currentMode = mode;
  wordPage.classList.add("hidden");
  gamePage.classList.remove("hidden");

selectedWords = words
  .filter(word => wordStates[word.kanji] !== 3)
  .sort(() => Math.random() - 0.5)
  .slice(0, 6);

 cards = [];

selectedWords.forEach((item, index) => {

  cards.push({
    text: item.kanji,
    pairId: index
  });

  if (mode === "reading") {

    cards.push({
      text: item.hira,
      pairId: index
    });

  } else {

    cards.push({
      text: item.kr,
      pairId: index
    });

  }

});

cards.sort(() => Math.random() - 0.5);

  grid.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lock = false;
  tries = 0;
  matchedCount = 0;
  info.textContent = "시도 횟수: 0";

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = "?";
    div.onclick = () => openCard(div, card);
    grid.appendChild(div);
  });
}

function openCard(div, card) {
  if (lock) return;
  if (div.classList.contains("open")) return;
  if (div.classList.contains("matched")) return;

  div.textContent = card.text;
  div.classList.add("open");

  if (!firstCard) {
    firstCard = { div, card };
    return;
  }

  secondCard = { div, card };
  tries++;
  info.textContent = "시도 횟수: " + tries;
  if (tries >= 20) {

  setTimeout(() => {


    showWordPage();

  }, 300);

  return;
}

  if (firstCard.card.pairId === secondCard.card.pairId) {
    firstCard.div.classList.add("matched");
    secondCard.div.classList.add("matched");

    firstCard = null;
    secondCard = null;
    matchedCount++;

    if (matchedCount === selectedWords.length) {
      setTimeout(() => {
        alert("완료! 총 시도 횟수: " + tries);
      }, 300);
    }
  } else {
    lock = true;

    setTimeout(() => {
      firstCard.div.textContent = "?";
      secondCard.div.textContent = "?";
      firstCard.div.classList.remove("open");
      secondCard.div.classList.remove("open");

      firstCard = null;
      secondCard = null;
      lock = false;
    }, 350);
  }
}

function startGrammarGame() {
  alert("문법 순서 배열 게임은 아직 준비 중입니다.");
}

showWordList();