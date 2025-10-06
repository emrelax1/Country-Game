let countries = [];
window.addEventListener("onload", function () {
  let activeUser = [];
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
});
let gameType = [];
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
  syncCurrentGameUser(); // Önce sync et
  let currentGame = JSON.parse(localStorage.getItem("currentGame")); // Yeniden yükle
  currentGame.index = 0;
  currentGame.totalPoint = 0;
  currentGame.questions = [];
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
  window.location.href = "game.html";
}
function getGameTypeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  modal.innerHTML = `
  <div class="modal-content">
      <div class="card">
        <form class="category" id="category">
          <h3>Zorluk Seviyesi Seçin</h3>
          <button type="button" id="easy" value ="easy"  onclick="selectedGameType(this) ">Kolay</button>
          <button type="button" id="medium" value ="medium" onclick="selectedGameType(this)">Orta</button>
          <button type="button" id="hard" value ="hard" onclick="selectedGameType(this)">Zor</button>
        </form>
      </div>
    </div>
  `;

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
function selectedGameType(element) {
  gameTypeList = JSON.parse(localStorage.getItem("gameType")) ?? [];

  gameTypebtn = element.getAttribute("id");
  console.log("gameTypebtn", gameTypebtn);

  var item = {
    gameType: gameTypebtn,
  };
  gameTypeList.push(item);
  localStorage.setItem("gameType", JSON.stringify(gameTypeList));
  window.location.href = "game.html";
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

  currentGame.index++;
  if (currentGame.index < 3) {
    viewCountries();
  } else {
    saveHistory();
    viewSkorboardOnlyUser();
    viewSkorboard();

    alert(
      `Oyun bitti! ${currentGame.user}, toplam puanınız: ${currentGame.totalPoint}`
    );
    document.getElementById("main").style.display = "none";
    document.getElementById("logodiv").style.display = "block";
  }
}
function saveHistory() {
  syncCurrentGameUser(); // Son kez sync
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
    questions: currentGameData.questions, // Düz array
    totalPoint: currentGameData.totalPoint,
  };
  historyList.push(gameToSave);
  localStorage.setItem("history", JSON.stringify(historyList));
  console.log("History saved with user:", gameToSave.user);
}
function viewSkorboard() {
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
    <li><span class="user">${element.user}</span><span class="score">${element.totalPoint}</span></li>
          
    `;
  });
}
function viewSkorboardOnlyUser() {
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
        <li><span class="user">${element.user}</span><span class="score">${element.totalPoint}</span></li>
          
    `;
      }
    });
  });
}
function logOut() {
  let activeUsers = JSON.parse(localStorage.getItem("activeUser"));
  activeUsers = [];
  localStorage.setItem("activeUser", JSON.stringify(activeUsers));
  localStorage.removeItem("currentGame");
  window.location.href = "loginpage.html";
}

let start = document.querySelector("#logodiv");
let ex = 10;
function swing(element) {
  function update(time) {
    const x = Math.sin(time / 1231) * ex;
    const y = Math.sin(time / 1458) * ex;

    element.style.transform = [`rotateX(${x}deg)`, `rotateY(${y}deg)`].join(
      " "
    );

    requestAnimationFrame(update);
  }
  update(0);
}

swing(start);
function checkLogin() {
  let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];
  if (activeUsers.length === 0) {
    alert("Giriş yapmadan oyuna erişemezsiniz!");
    window.location.href = "loginpage.html";
    return false;
  }
  return true;
}

window.addEventListener("load", function () {
  if (checkLogin()) {
    viewSkorboard();
    viewSkorboardOnlyUser();
  }
});
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
window.addEventListener("load", function () {
  syncCurrentGameUser();
  if (checkLogin()) {
    viewSkorboard();
    viewSkorboardOnlyUser();
  }
});
