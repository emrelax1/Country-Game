let countries = [];
window.addEventListener("onload", function () {
  let activeUser = [];
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
});

let randomCountery = 0;
let currentGame = JSON.parse(localStorage.getItem("currentGame")) || {
  index: 0,
  user: "",
  totalPoint: 0,
  questions: [],
};
let history = [];

function GetCountries() {
  return fetch(
    "https://restcountries.com/v3.1/all?fields=cca2,name,capital,population,flags"
  )
    .then((response) => response.json())
    .then((data) => {
      const shuffled = data.sort(() => 0.5 - Math.random());
      countries = shuffled.slice(0, 10);
    })
    .catch((error) => console.error("Ülke verileri alınamadı:", error));
}

function viewCountries() {
  if (countries.length === 0) return;
  const randomCountery = Math.floor(Math.random() * countries.length);
  const selectedCountry = countries[randomCountery];
  //console.log("countries", countries);
  currentGame.questions.push({
    flag: selectedCountry.flags.png,
    name: selectedCountry.name.common,
    capital: selectedCountry.capital ? selectedCountry.capital[0] : "",
    population: selectedCountry.population,
    point: 0,
  });
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
  document.getElementById(
    "flag"
  ).innerHTML = `<img id="countryFlag" src="${selectedCountry.flags.png}" alt="bayrak">`;
  document.getElementById("countaryName").innerText =
    selectedCountry.name.common;

  document.getElementById("countaryNameInput").value = "";
  document.getElementById("countaryCapitalInput").value = "";
  document.getElementById("countaryPopulationInput").value = "";
}
GetCountries();
function startGame() {
  currentGame = {
    index: 0,
    user: currentGame.user,
    totalPoint: 0,
    questions: [],
  };
  localStorage.setItem("currentGame", JSON.stringify(currentGame));

  window.location.href = "game.html";

  GetCountries();
}

function control(value) {
  let point = 0;
  const currentQuestion = currentGame.questions[currentGame.index];

  const countaryNameInput = document
    .getElementById("countaryNameInput")
    .value.trim()
    .toUpperCase();
  const countaryCapitalInput = document
    .getElementById("countaryCapitalInput")
    .value.trim()
    .toUpperCase();
  const countaryPopulationInput = parseInt(
    document.getElementById("countaryPopulationInput").value.trim()
  );

  if (countaryNameInput === currentQuestion.name.toUpperCase()) {
    point += 10;

    //alert("10 puan kazandın");
  }

  if (
    currentQuestion.capital &&
    countaryCapitalInput === currentQuestion.capital.toUpperCase()
  ) {
    point += 10;
  }

  if (
    countaryPopulationInput &&
    Math.abs(countaryPopulationInput - currentQuestion.population) <=
      currentQuestion.population * 0.1
  ) {
    point += 10;
  }

  currentGame.questions[currentGame.index].point = point;
  currentGame.totalPoint += point;
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
  console.log(point);

  alert(
    `Bu sorudan ${point} puan kazandınız! Toplam puan: ${currentGame.totalPoint}`
  );
  document.getElementById("score").textContent =
    "Score : " + currentGame.totalPoint;

  currentGame.index++;
  if (currentGame.index < 3) {
    viewCountries();
  } else {
    saveHistory();

    alert(
      `Oyun bitti! ${currentGame.user}, toplam puanınız: ${currentGame.totalPoint}`
    );
    window.location.href = "index.html";
  }
}
function saveHistory() {
  historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  var id = historyList.length ? historyList[historyList.length - 1].id : 0;
  currentGame = JSON.parse(localStorage.getItem("currentGame"));
  currentGame = {
    id: id + 1,
    index: currentGame.index,
    user: currentGame.user,
    questions: [currentGame.questions],
    totalPoint: currentGame.totalPoint,
  };
  historyList.push(currentGame);
  localStorage.setItem("history", JSON.stringify(historyList));
  console.log("currentGame", currentGame);
}
/* function viewSkorboard() {
  historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  var skorboardList = document.getElementById("skorboard");
  console.log("historyList", historyList);
  skorboardList.innerHTML = "<h2>En İyiler</h2>";
  let count = 0;
  let sortedHistory = historyList.sort((a, b) => b.totalPoint - a.totalPoint);
  sortedHistory?.forEach((element) => {
    count += 1;

    if (count <= 5)
      skorboardList.innerHTML += `
          <li>${element.user} -- ${element.totalPoint}</li>
          
    `;
  });
} */
/* function viewSkorboardOnlyUser() {
  historyList = JSON.parse(localStorage.getItem("history")) ?? [];
  let activeUsers = JSON.parse(localStorage.getItem("activeUser"));
  var skorboardListUser = document.getElementById("skorboardUser");
  console.log("historyList", historyList);
  console.log("currentGame.user", currentGame.user);
  skorboardListUser.innerHTML = "<h2>En İyi Skorların</h2>";
  let count = 0;
  let sortedHistory = historyList.sort((a, b) => b.totalPoint - a.totalPoint);
  sortedHistory?.forEach((element) => {
    console.log("element", element.user);
    console.log("activeusers.user", activeUsers);
    activeUsers.forEach((activeuser) => {
      console.log(activeuser);

      if (element.user == activeuser.userName) {
        count += 1;
        if (count <= 5)
          skorboardListUser.innerHTML += `
          <li>${element.user} -- ${element.totalPoint}</li>
          
    `;
      }
    });
  });
} */
