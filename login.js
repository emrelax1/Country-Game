let userList = JSON.parse(localStorage.getItem("users")) ?? [];

function saveUser() {
  const userNameInput = document.getElementById("username");
  const password = document.getElementById("userPassword");

  if (!userNameInput.value.trim()) {
    alert("Kullanıcı adı boş olamaz!");
    userNameInput.focus();
    return;
  }
  if (!password.value.trim() || password.value.length < 6) {
    alert("Şifre boş olamaz ve en az 6 karakter olmalı!");
    password.focus();
    return;
  }

  let userList = JSON.parse(localStorage.getItem("users")) ?? [];
  let sameUserName = userList.find(
    (x) => x.userName === userNameInput.value.trim()
  );

  if (sameUserName) {
    alert(
      "Bu kullanıcı adı daha önce kullanılmış. Lütfen başka bir kullanıcı adı giriniz."
    );
    return;
  }

  let user = {
    userName: userNameInput.value.trim(),
    password: password.value,
    remember: true,
  };
  userList.unshift(user);
  localStorage.setItem("users", JSON.stringify(userList));

  alert("Kayıt başarılı! Giriş yapabilirsiniz.");
  window.location.href = "loginpage.html";
}
function login() {
  userList = JSON.parse(localStorage.getItem("users")) ?? [];
  const userNameInput = document.getElementById("usernameLogin");
  const password = document.getElementById("userPasswordLogin");
  if (!userNameInput.value.trim() || !password.value.trim()) {
    alert("Kullanıcı adı ve şifre boş olamaz!");
    return;
  }

  const currentUser = userList.find(
    (x) => x.userName === userNameInput.value && x.password === password.value
  );

  console.log("currentUser", currentUser);

  if (currentUser) {
    let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];

    activeUsers = activeUsers.filter(
      (u) => u.userName !== currentUser.userName
    );

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
    alert("Kullanıcı adı veya şifre hatalı!");
  }
}
