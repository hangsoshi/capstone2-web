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
  console.log(e.target.classList);
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
// const nameUser = document.querySelector(".nameUser");
// const emailUser = document.querySelector(".emailUser");
// const passwordUser = document.querySelector(".passwordUser");
// const phoneUser = document.querySelector(".phoneUser");

// function emptyValue(e) {
//   if (e.target.value == "") {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = `Bạn không được để trống`;
//   } else {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = "";
//   }
// }

// function checkEmail(e) {
//   console.log(e.target.classList);
//   const regexEmail =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   emailUser.onchange = function (e) {
//     if (!regexEmail.test(e.target.value)) {
//       document.querySelector(
//         `.${[...e.target.classList].join(".")} ~ small`
//       ).innerText = `Trường này phải là email`;
//     } else {
//       document.querySelector(
//         `.${[...e.target.classList].join(".")} ~ small`
//       ).innerText = "";
//     }
//   };
// }

// function checkPassword(e) {
//   if (e.target.value.length < 6) {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = `Vui lòng nhập tối thiểu 6 kí tự`;
//   } else {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = "";
//   }
// }

// function checkPhone(e) {
//   const phoneRegex =
//     /^\(?[0]{1}?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
//   if (!phoneRegex.test(e.target.value)) {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = `Trường này phải là số điện thoại`;
//   } else {
//     document.querySelector(
//       `.${[...e.target.classList].join(".")} ~ small`
//     ).innerText = "";
//   }
// }

// nameUser.onchange = (e) => emptyValue(e);
// emailUser.onchange = (e) => checkEmail(e);
// passwordUser.onchange = (e) => checkPassword(e);
// passwordLogin.onchange = (e) => checkPassword(e);
// phoneUser.onchange = (e) => checkPhone(e);

const controlList = document.querySelectorAll('.form-input')
controlList.forEach((control) => {
  control.onkeyup = (e) => {
    switch (e.target.classList[1]) {
      case 'nameUser': {
        validateForm(e.target, ["required"]);
        break;
      }
      case 'emailUser': {
        validateForm(e.target, ["required", "email"]);
        break;
      }
      case 'passwordUser': {
        validateForm(e.target, ["required"]);
        break;
      }
      case 'phoneUser': {
        validateForm(e.target, ["required", "phone"]);
        break;
      }
      default: break;
    }
  }
})
const phoneRegex =
  /^\(?[0]{1}?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const listError = ["required", "maxLength", "phone", "email", "emoji", "specialCharacter"]
let valid;
function validateForm(control, listError) {
  let warning = [];
  valid = listError.every((error) => {
    if (error === 'required' && !control.value) {
      warning.push('Không được để trống');
      return false;
    }
    if (error === 'phone' && !phoneRegex.test(control.value)) {
      warning.push('sdt không hợp lệ');
      return false;
    }
    if (error === 'email' && !regexEmail.test(control.value)) {
      warning.push('Email k hợp lệ');
      return false;
    }
    return true;
  })
  // console.log(valid);
  document.querySelector(
    `.${[...control.classList].join(".")} ~ small`
  ).innerText = warning.join(', ');
}

document.querySelector('.resgister-1').onclick = (e) => {
  e.preventDefault();
  valid = true;
  var keyupEvent = new Event('keyup');
  controlList.forEach((control) => {
    control.dispatchEvent(keyupEvent);
  })
  console.log(valid);
} 