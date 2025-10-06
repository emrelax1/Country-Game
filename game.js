let countries = [];
window.addEventListener("onload", function () {
  let activeUser = [];
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
});
gameType = [];
let randomCountery = 0;
let currentGame = JSON.parse(localStorage.getItem("currentGame")) || {
  index: 0,
  user: "",
  totalPoint: 0,
  questions: [],
};
localStorage.setItem("currentGame", JSON.stringify(currentGame));
let history = [];
async function getData() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,capital,population,flags"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    return [];
  }
}

async function getCountry() {
  const countries = await getData();
  const gameModList = JSON.parse(localStorage.getItem("gameType"));

  if (!gameModList || gameModList.length === 0) {
    console.log("Game mode not found.");
    return;
  }

  if (!countries || countries.length === 0) {
    console.log("Country data could not be retrieved.");
    return;
  }

  const currentGameMod = gameModList[0];

  let filteredCountries;

  if (currentGameMod.gameType === "easy") {
    console.log("easy seçildi");

    filteredCountries = countries.filter(
      (country) => country.population > 50000000
    );
  } else if (currentGameMod.gameType === "medium") {
    console.log("medium seçildi");

    filteredCountries = countries.filter(
      (country) =>
        country.population <= 50000000 && country.population >= 15000000
    );
  } else if (currentGameMod.gameType === "hard") {
    console.log("hard seçildi");

    filteredCountries = countries.filter(
      (country) => country.population <= 15000000
    );
  } else {
    console.log("Invalid game mode:", currentGameMod.gameType);
    return;
  }
  const randomCountries = getRandomCountries(filteredCountries, 10);

  randomCountries.forEach((element) => {
    let item = {
      flag: element.flags.png,
      name: element.name.common,
      capital: element.capital[0],
      population: element.population,
    };
    let countryList = JSON.parse(localStorage.getItem("countries")) || [];

    countryList.push(item);
    localStorage.setItem("countries", JSON.stringify(countryList));
  });
}
getCountry();
function getRandomCountries(countries, counter) {
  const newList = [...countries].sort(() => 0.5 - Math.random());
  return newList.slice(0, counter);
}

let index = 0;

function viewCountries() {
  let countries = JSON.parse(localStorage.getItem("countries"));

  if (countries.length === 0) return;

  const selectedCountry = countries[currentGame.index];
  console.log("selectedCountry", selectedCountry);

  currentGame.questions.push({
    flag: selectedCountry.flag,
    name: selectedCountry.name,
    capital: selectedCountry.capital,
    population: selectedCountry.population,
    point: 0,
  });
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
  document.getElementById(
    "flag"
  ).innerHTML = `<img id="countryFlag" src="${selectedCountry.flag}" alt="bayrak">`;
  document.getElementById("countaryName").innerText = selectedCountry.name;

  document.getElementById("countaryNameInput").value = "";
  document.getElementById("countaryCapitalInput").value = "";
  document.getElementById("countaryPopulationInput").value = "";
  document.getElementById("countaryPopulationInput").readOnly = false;
  document.getElementById("countaryPopulationInput").type = "number";
  document.getElementById("answers").innerHTML = "";
  document.getElementById("index").textContent =
    currentGame.index + 1 + ".Soru";

  console.log(currentGame.index, "index");
}

function startGame() {
  window.location.href = "game.html";

  GetCountries();
}

function control(value) {
  let point = 0;
  const currentQuestion = currentGame.questions[currentGame.index];

  const nameInput = document.getElementById("countaryNameInput");
  const capitalInput = document.getElementById("countaryCapitalInput");
  const populationInput = document.getElementById("countaryPopulationInput");

  const countaryNameInput = nameInput.value.trim().toUpperCase();
  const countaryCapitalInput = capitalInput.value.trim().toUpperCase();
  const countaryPopulationInput = parseInt(populationInput.value.trim());

  [nameInput, capitalInput, populationInput].forEach((input) => {
    input.classList.remove("correct", "wrong");
  });

  let feedbackHtml = "";

  if (countaryNameInput === currentQuestion.name.toUpperCase()) {
    point += 10;
    nameInput.classList.add("correct");
    feedbackHtml += `<p><strong>Ülke Adı:</strong> Doğru! (+10 puan)</p>`;
  } else {
    nameInput.classList.add("wrong");
    feedbackHtml += `<p><strong>Ülke Adı:</strong> Yanlış. Tahminin: ${
      countaryNameInput || "Boş"
    } | Doğru: ${currentQuestion.name}</p>`;
  }

  if (
    currentQuestion.capital &&
    countaryCapitalInput === currentQuestion.capital.toUpperCase()
  ) {
    point += 10;
    capitalInput.classList.add("correct");
    feedbackHtml += `<p><strong>Başkent:</strong> Doğru! (+10 puan)</p>`;
  } else {
    capitalInput.classList.add("wrong");
    feedbackHtml += `<p><strong>Başkent:</strong> Yanlış. Tahminin: ${
      countaryCapitalInput || "Boş"
    } | Doğru: ${currentQuestion.capital || "Belirtilmemiş"}</p>`;
  }

  let populationClass = "wrong";
  let populationFeedback = "";
  const userPopStr = countaryPopulationInput
    ? countaryPopulationInput.toLocaleString()
    : "Boş";
  const correctPopStr = currentQuestion.population.toLocaleString();

  if (
    countaryPopulationInput &&
    Math.abs(countaryPopulationInput - currentQuestion.population) <=
      currentQuestion.population * 0.1
  ) {
    point += 10;
    populationClass = "correct";
    populationFeedback = `Doğru! (+10 puan)`;
  } else if (
    countaryPopulationInput &&
    Math.abs(countaryPopulationInput - currentQuestion.population) <=
      currentQuestion.population * 0.2
  ) {
    point += 7;
    populationFeedback = `Yakın (±%20) (+7 puan)`;
  } else if (
    countaryPopulationInput &&
    Math.abs(countaryPopulationInput - currentQuestion.population) <=
      currentQuestion.population * 0.3
  ) {
    point += 5;
    populationFeedback = `Orta (±%30) (+5 puan)`;
  } else if (
    countaryPopulationInput &&
    Math.abs(countaryPopulationInput - currentQuestion.population) <=
      currentQuestion.population * 0.5
  ) {
    point += 3;
    populationFeedback = `Uzak (±%50) (+3 puan)`;
  } else if (countaryPopulationInput) {
    populationFeedback = `Çok uzak (0 puan)`;
  } else {
    populationFeedback = `Boş bırakılmış (0 puan)`;
  }
  populationInput.classList.add(populationClass);
  feedbackHtml += `<p><strong>Nüfus:</strong> Tahminin: ${userPopStr} | ${populationFeedback} | Doğru: ${correctPopStr}</p>`;

  document.getElementById("answers").innerHTML = feedbackHtml;

  currentGame.questions[currentGame.index].point = point;
  currentGame.totalPoint += point;
  localStorage.setItem("currentGame", JSON.stringify(currentGame));

  document.getElementById("score").textContent =
    "Score : " + currentGame.totalPoint;

  currentGame.index++;
  localStorage.setItem("currentGame", JSON.stringify(currentGame));

  if (currentGame.index < 10) {
    startProgress(viewCountries);
  } else {
    saveHistory();
    viewSkorboard();
    viewSkorboardOnlyUser();
    startProgress(showGameEnd);
  }
}

function showGameEnd() {
  const currentGameData = JSON.parse(localStorage.getItem("currentGame"));
  const questions = currentGameData.questions;

  let correctCount = 0;
  let totalQuestions = questions.length;
  questions.forEach((q) => {
    if (q.point > 0) correctCount++;
  });
  const wrongCount = totalQuestions - correctCount;
  const percentage = ((correctCount / totalQuestions) * 100).toFixed(1);
  const avgPoint = (currentGameData.totalPoint / totalQuestions).toFixed(1);

  document.getElementById("result").innerHTML = `
    <div class="end-game-wrapper">
      <div id="skorboard"></div>
      
      <div class="end-game-card">
        <h2>Oyun Bitti!</h2>
        <p>Tebrikler, ${currentGameData.user}!</p>
        <ul class="stats-list">
          <li>Toplam Puan: <span>${currentGameData.totalPoint}</span></li>
        </ul>
        <div class="end-buttons">
          <button id="playAgainBtn">Tekrar Oyna</button>
          <button id="goHomeBtn">Anasayfaya Dön</button>
        </div>
      </div>
      
      <div id="skorboardUser"></div>
    </div>
  `;

  document.getElementById("playAgainBtn").addEventListener("click", playAgain);
  document.getElementById("goHomeBtn").addEventListener("click", goHome);

  viewSkorboard();
  viewSkorboardOnlyUser();

  document.getElementById("main").style.display = "none";
  document.getElementById("result").style.display = "flex";
}
function playAgain() {
  localStorage.removeItem("countries");
  localStorage.removeItem("currentGame");
  window.location.reload();
}

function goHome() {
  clearSelectedGameType();
}

function saveHistory() {
  syncCurrentGameUser();
  let currentGameData = JSON.parse(localStorage.getItem("currentGame"));
  if (!currentGameData.user) {
    console.error("User not found in currentGame! Aborting save.");
    return;
  }
  let historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  let id = historyList.length ? historyList[historyList.length - 1].id : 0;
  let gameToSave = {
    id: id + 1,
    index: currentGameData.index,
    user: currentGameData.user,
    questions: currentGameData.questions,
    totalPoint: currentGameData.totalPoint,
  };
  historyList.push(gameToSave);
  localStorage.setItem("history", JSON.stringify(historyList));
  console.log("History saved with user:", gameToSave.user);
}

function viewSkorboard() {
  let historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  let skorboardList = document.getElementById("skorboard");
  skorboardList.innerHTML = "<h2>En İyiler</h2><ol></ol>";
  let ol = skorboardList.querySelector("ol");
  let count = 0;
  let sortedHistory = [...historyList].sort(
    (a, b) => b.totalPoint - a.totalPoint
  );
  sortedHistory.forEach((element) => {
    count += 1;
    if (count <= 5) {
      ol.innerHTML += `<li>${element.user} - ${element.totalPoint} puan </li>`;
    }
  });
  if (count === 0) ol.innerHTML += "<li>Henüz skor yok!</li>";
}

function viewSkorboardOnlyUser() {
  let historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];
  let skorboardListUser = document.getElementById("skorboardUser");
  skorboardListUser.innerHTML = "<h2>En İyi Skorların</h2><ol></ol>";
  let ol = skorboardListUser.querySelector("ol");
  let count = 0;
  let userHistory = historyList.filter((h) =>
    activeUsers.some((u) => u.userName === h.user)
  );
  let sortedUserHistory = [...userHistory].sort(
    (a, b) => b.totalPoint - a.totalPoint
  );
  sortedUserHistory.forEach((element) => {
    count += 1;
    if (count <= 5) {
      ol.innerHTML += `<li>${element.user} -- ${element.totalPoint} puan </li>`;
    }
  });
  if (count === 0) ol.innerHTML += "<li>Henüz skorun yok!</li>";
}

function startProgress(callback) {
  const progressContainer = document.querySelector(".progress-container");
  const progressBar = document.getElementById("progressBar");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";

  let width = 0;
  const interval = setInterval(() => {
    width += 100 / 30;
    progressBar.style.width = width + "%";
    if (width >= 100) {
      clearInterval(interval);
      progressContainer.style.display = "none";
      const nameInput = document.getElementById("countaryNameInput");
      const capitalInput = document.getElementById("countaryCapitalInput");
      const populationInput = document.getElementById(
        "countaryPopulationInput"
      );
      if (nameInput) nameInput.classList.remove("correct", "wrong");
      if (capitalInput) capitalInput.classList.remove("correct", "wrong");
      if (populationInput) populationInput.classList.remove("correct", "wrong");
      document.getElementById("answers").innerHTML = "";
      callback();
    }
  }, 100);
  index++;
}

function onayla() {
  control();
}

function clearSelectedGameType() {
  let gameType = JSON.parse(localStorage.getItem("gameType"));
  gameType = [];
  localStorage.setItem("gameType", JSON.stringify(gameType));
  localStorage.removeItem("countries");
  localStorage.removeItem("currentGame");
  window.location.href = "index.html";
}
function syncCurrentGameUser() {
  let currentGame = JSON.parse(localStorage.getItem("currentGame")) || {
    index: 0,
    user: "",
    totalPoint: 0,
    questions: [],
  };
  let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];

  if (activeUsers.length > 0) {
    currentGame.user = activeUsers[activeUsers.length - 1].userName;
    localStorage.setItem("currentGame", JSON.stringify(currentGame));
    console.log("User synced to currentGame:", currentGame.user);
  } else {
    window.location.href = "loginpage.html";
  }
}
function initGame() {
  syncCurrentGameUser();
}
