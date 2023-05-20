const registerButton1 = document.getElementById("register");
const loginButton1 = document.getElementById("login");
const loginButton = document.getElementById("login-1");
const container = document.getElementById("container");
const names = document.getElementsByClassName("header-name1");
const $ = document.querySelector.bind(document);

registerButton1.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton1.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll("input.form-control");
  const requestValues = {};

  inputs.forEach((item) => {
    requestValues[item.attributes.name.value] = item.value;
  });
  console.log(requestValues);
  fetch("http://127.0.0.1:8000/api/auth/loginUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestValues),
  })
    .then((response) => response.json())
    .then((data) => {
      window.localStorage.setItem("login", JSON.stringify(data));
      window.localStorage.setItem("access_token", data.token);
      window.localStorage.setItem(
        "id",
        JSON.stringify(data.user_info.user_profile[0].user_id)
      );
      window.location.href = "home.html";
    })
    .catch((error) => console.log(error));
});

// --------------------------------------------------------------------

const registerButton = $(".resgister-1");

registerButton.onclick = (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll("input.form-input");
  const requestValues = {};

  inputs.forEach((item) => {
    requestValues[item.attributes.name.value] = item.value;
  });
  fetch("http://127.0.0.1:8000/api/auth/userRegister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestValues),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        alert("success......");
        window.location.reload();
      } else {
        alert(data.message);
      }
    });
};

// --------- Validate form login -----------
const emailLogin = document.querySelector(".emailLogin");
const passwordLogin = document.querySelector(".passwordLogin");

function checkEmailLogin(e) {
  const regexEmailLogin =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexEmailLogin.test(e.target.value)) {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = `Trường này phải là email`;
  } else {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = "";
  }
}

emailLogin.onchange = (e) => checkEmailLogin(e);

// --------- Validate form register -----------
const nameUser = document.querySelector(".nameUser");
const emailUser = document.querySelector(".emailUser");
const passwordUser = document.querySelector(".passwordUser");
const phoneUser = document.querySelector(".phoneUser");

function emptyValue(e) {
  if (e.target.value == "") {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = `Bạn không được để trống`;
  } else {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = "";
  }
}

function checkEmail(e) {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailUser.onchange = function (e) {
    if (!regexEmail.test(e.target.value)) {
      document.querySelector(
        `.${[...e.target.classList].join(".")} ~ small`
      ).innerText = `Trường này phải là email`;
    } else {
      document.querySelector(
        `.${[...e.target.classList].join(".")} ~ small`
      ).innerText = "";
    }
  };
}

function checkPassword(e) {
  if (e.target.value.length < 6) {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = `Vui lòng nhập tối thiểu 6 kí tự`;
  } else {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = "";
  }
}

function checkPhone(e) {
  const phoneRegex =
    /^\(?[0]{1}?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!phoneRegex.test(e.target.value)) {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = `Trường này phải là số điện thoại`;
  } else {
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ small`
    ).innerText = "";
  }
}

nameUser.onchange = (e) => emptyValue(e);
emailUser.onchange = (e) => checkEmail(e);
passwordUser.onchange = (e) => checkPassword(e);
passwordLogin.onchange = (e) => checkPassword(e);
phoneUser.onchange = (e) => checkPhone(e);
