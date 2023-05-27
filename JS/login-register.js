const registerButton1 = document.getElementById("register");
const loginButton1 = document.getElementById("login");
const loginButton = document.getElementById("login-1");
const container = document.getElementById("container");
const names = document.getElementsByClassName("header-name1");
const $ = document.querySelector.bind(document);
const currentUser = localStorage.getItem("id");

if (currentUser) {
  location.href = "home.html";
}

registerButton1.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton1.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// ----------------------------------------------------------------------

const controlList = document.querySelectorAll(".form-input");
controlList.forEach((control) => {
  control.onkeyup = (e) => {
    switch (e.target.classList[1]) {
      case "nameUser": {
        validateForm(e.target, ["required", "maxLength"]);
        break;
      }
      case "emailUser": {
        validateForm(e.target, ["required", "email"]);
        break;
      }
      case "passwordUser": {
        validateForm(e.target, ["required"]);
        break;
      }
      case "phoneUser": {
        validateForm(e.target, ["required", "phone"]);
        break;
      }
      default:
        break;
    }
  };
});
const phoneRegex = /^\(?[0]{1}?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const listError = [
  "required",
  "maxLength",
  "phone",
  "email",
  "emoji",
  "specialCharacter",
];
let valid;
function validateForm(control, listError) {
  let warning = [];
  valid = listError.every((error) => {
    if (error === "required" && !control.value) {
      warning.push("Không được để trống");
      return false;
    }
    if (error === "phone" && !phoneRegex.test(control.value)) {
      warning.push("sdt không hợp lệ");
      return false;
    }
    if (error === "email" && !regexEmail.test(control.value)) {
      warning.push("Email không hợp lệ");
      return false;
    }
    if (error === "maxLength" && control.value.length > 100) {
      warning.push("Không được quá 100 ký tự");
    }
    return true;
  });
  document.querySelector(
    `.${[...control.classList].join(".")} ~ small`
  ).innerText = warning.join(", ");
}

// ----------------------------------------------------------------------

const emailLogin = document.querySelector(".emailLogin");
const passwordLogin = document.querySelector(".passwordLogin");

var controlLists = document.querySelectorAll(".form-control");
controlLists.forEach((control) => {
  control.onkeyup = (e) => {
    switch (e.target.classList[1]) {
      case "emailLogin": {
        validateForm(e.target, ["required", "email"]);
        break;
      }
      case "passwordLogin": {
        validateForm(e.target, ["required"]);
        break;
      }
    }
  };
});
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  var keyupEvent = new Event("keyup");
  controlLists.forEach((control) => {
    control.dispatchEvent(keyupEvent);
  });
  if (valid) {
    e.preventDefault();
    const inputs = document.querySelectorAll("input.form-control");
    const requestValues = {};

    inputs.forEach((item) => {
      requestValues[item.attributes.name.value] = item.value;
    });
    fetch("http://127.0.0.1:8000/api/auth/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestValues),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          window.localStorage.setItem("login", JSON.stringify(data));
          window.localStorage.setItem("access_token", data.token);
          window.location.href = "http://localhost:3000/home.html";
          window.localStorage.setItem(
            "id",
            JSON.stringify(data.user_info.user_profile[0].user_id)
          );
        }
      })
      .catch((error) => alert(error.msg));
  }
});

// --------------------------------------------------------------------

const registerButton = $(".resgister-1");

// --------- Validate form register -----------
const nameUser = document.querySelector(".nameUser");
const emailUser = document.querySelector(".emailUser");
const passwordUser = document.querySelector(".passwordUser");
const phoneUser = document.querySelector(".phoneUser");

document.querySelector(".resgister-1").onclick = (e) => {
  e.preventDefault();
  var keyupEvent = new Event("keyup");
  controlList.forEach((control) => {
    control.dispatchEvent(keyupEvent);
  });
  if (valid) {
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
        console.log(data);
        if (data.status === 200) {
          alert(data.msg);
          window.location.href = "http://localhost:3000/login-register.html";
        } else if (data.data.status === 401) {
          alert(data.msg);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
};
