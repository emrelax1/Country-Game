let userList = JSON.parse(localStorage.getItem("users")) ?? [];

function saveUser() {
  const loginBtn = document.getElementById("siginBtn");
  const userNameInput = document.getElementById("username");
  const password = document.getElementById("userPassword");

  userList = JSON.parse(localStorage.getItem("users")) ?? [];
  //console.log(userList);

  sameUserName = userList.find((x) => x.userName === userNameInput.value);
  //console.log("samusername", sameUserName);
  if (sameUserName) {
    alert(
      "Bu kullanıcı adı daha önce kullanılmış.Lütfen başka bir kullanıcı adı giriniz"
    );
  } else {
    var user = {
      userName: userNameInput.value,
      password: password.value,
      remember: true,
    };
    userList.unshift(user);
    localStorage.setItem("users", JSON.stringify(userList));

    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    window.location.href = "loginpage.html";
  }

  //console.log(user);

  localStorage.setItem("users", JSON.stringify(userList));
}
function login() {
  userList = JSON.parse(localStorage.getItem("users")) ?? [];
  const userNameInput = document.getElementById("usernameLogin");
  const password = document.getElementById("userPasswordLogin");

  const currentUser = userList.find(
    (x) => x.userName === userNameInput.value && x.password === password.value
  );

  console.log("currentUser", currentUser);

  if (currentUser) {
    let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];

    activeUsers.push(currentUser);

    localStorage.setItem("activeUser", JSON.stringify(activeUsers));
    let currentGame = JSON.parse(localStorage.getItem("currentGame")) || {
      index: 0,
      user: "",
      totalPoint: 0,
      questions: [],
    };
    currentGame.user = currentUser.userName;
    localStorage.setItem("currentGame", JSON.stringify(currentGame));
    window.location.href = "index.html";

    console.log("Active users:", activeUsers);
  } else {
    console.log("Kullanıcı bulunamadı veya şifre hatalı!");
  }

  /* if (currentUser) {
    let currentGame = JSON.parse(localStorage.getItem("currentGame")) || {
      index: 0,
      user: "",
      totalPoint: 0,
      questions: [],
    };
    currentGame.user = currentUser.userName;
    localStorage.setItem("currentGame", JSON.stringify(currentGame));
    window.location.href = "index.html";
  } else {
    alert("Kullanıcı adı veya şifre hatalı");
  } */
}
