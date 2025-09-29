const users = [
  {
    userName: "Emre",
  },
];
localStorage.getItem("users");
function saveUserName() {
  const loginBtn = document.getElementById("loginBtn");
  const userNameInput = document.getElementById("username");
  const rememberMe = document.getElementById("rememberMe");
  const password = document.getElementById("userPassword");

  userList = JSON.parse(localStorage.getItem("users")) ?? [];
  var user = {
    userName: userNameInput.value,
    password: password.value,
    remember: rememberMe.checked,
  };
  console.log(user);

  userList.unshift(user);
  localStorage.setItem("users", JSON.stringify(userList));
}

function uniqueUserName() {}
