const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const userName = $$(".user_name");
const userPhone = $(".user_phone");
const userEmail = $(".user_email");
const userGender = $(".user_gender");
const userAvatar = $(".user_avatar");
const userAbout = $(".user_about");

const profileGenaral = document.querySelector(".profile-genaral");
const profileTitleBtn = document.querySelector(".profile-title button");
const profileGenaralEdit = document.querySelector(".profile-genaral-edit");
const profileSaveBtn = document.querySelector(".profile-save button");
const profileSaveP = document.querySelector(".profile-save p");

const btnUpdate = $(".profile_update");
const btnProfileCancel = $(".profile_cancel");
const inputUserName = $(".input-username");
const inputPhoneNumber = $(".input-phonenumber");
const inputEmail = $(".input-email");
const inputAbout = $(".form-bio");
const inputHobbies = $(".input-hobbies");
const inputGender = $("#input-gender");
var login = JSON.parse(window.localStorage.getItem("login"));
const avatar = document.querySelector(".avatar_user_header");
const targetProfileId = localStorage.getItem("target-profile-id");
const avatarInputFile = document.querySelector(".avatar-input-file");

const avatarRoomUpdate = document.querySelector(".file-update-avatar");
const inputRoomUpdateAvatar = document.querySelector(".file-update-room");
const formUpdateTour = document.querySelector(".form-update-room");
const inputNameRoomUpdate = document.querySelector(".room-name-update");
const inputNumberRoomUpdate = document.querySelector(".number-room-update");
const inputDescriptionRoomUpdate = document.querySelector(
  ".description-room-update"
);
const submitUpdateRoom = document.querySelector(".submit-room-update");
const cancelUpdateRoom = document.querySelector(".cancel-room-update");

const btnStartUpdate = document.querySelector(".btn-update-profile");
console.log(
  typeof targetProfileId,
  typeof login.user_info.user_profile[0].user_id
);
if (Number(targetProfileId) !== login.user_info.user_profile[0].user_id) {
  btnStartUpdate.style.display = "none";
}

avatar.onclick = () => {
  avatarInputFile.click();
};
avatarInputFile.onchange = (e) => {
  const formdata = new FormData();
  formdata.append("directory", "avatar");
  formdata.append("file", e.target.files[0]);
  fetch("http://localhost:3000/upload", {
    method: "post",
    body: formdata,
  })
    .then((res) => res.json())
    .then((data) => {
      avatar.src = data.data.fileUrl;
    });
};

// -------------------- render list tour ------------------------

function getListTour() {
  fetch(
    "http://127.0.0.1:8000/api/personal/tour/all/" + targetProfileId
    // login.user_info.user_profile[0].user_id
  )
    .then((res) => res.json())
    .then((data) => {
      window.localStorage.setItem("ListTour", JSON.stringify(data.all_tour));
      return;
    });
}

var sliderFind = $(".swiper-wrapper");
// console.log(api);

// const api = "http://127.0.0.1:8000/api/personal/tour/all/" + login.user_info.user_profile[0].user_id;
let htmls = "";

// ------------------------- render list tour of User ---------------------------------------

function renderListTour() {
  fetch(
    "http://127.0.0.1:8000/api/personal/tour/all/" + targetProfileId
    // login.user_info.user_profile[0].user_id
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const tours = data.all_tour;
      console.log(tours);
      window.localStorage.setItem(
        "dataPersonTour",
        JSON.stringify(data.all_tour)
      );

      const tourNames = document.querySelectorAll(
        ".blog-slider__item .blog-slider__content .profile-control .blog-slider__button"
      );
      tourNames.forEach((tourr) => {
        tourr.onclick = (e) => {
          localStorage.setItem("targetTourId", e.target.dataset.tourr);
          window.location.href = "http://localhost:3000/detailFind.html";
        };
      });
      htmls = tours.map((tour) => {
        return `
                <div class="blog-slider__item swiper-slide data-id='${tour.id}'">
                
                <div class="blog-slider__img">
                    <img class="imgTour" src="${tour.image}" alt="">
                </div>
                <div class="blog-slider__content">
                    <div class="blog-slider__title">${tour.name}</div>
                    <div class="blog-slider__trip">
                        <p><b>Đến:</b> ${tour.to_where}</p>
                        <p class="tao-them">${tour.from_date}</p>
                    </div>
                    <div class="blog-slider__host"><b>Người tạo: </b>${login.user_info.name}</div>
                    <div class="blog-slider__text"> ${tour.description} </div>
                    <div class="profile-control">
                        <div class="">
                            <a href="./detailFind.html" class="blog-slider__button" onclick="handle_detail_page(${tour.id},${tour.owner_id})" >CHI TIẾT</a>
                        </div>
                        <div class="profile-action">
                            <button type="button" style="background-color: white; border: none;" onclick="handleUpdateTours(${tour.id})">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button type="button" style="background-color: white; border: none;" onclick="handle_delete(${tour.id},${tour.owner_id})">
                              <i class="fa-solid fa-trash-can btn-delete"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
      });
      sliderFind.innerHTML = htmls.join("");
      if (sliderFind.innerHTML) {
        new Swiper(".blog-slider", {
          spaceBetween: 30,
          effect: "fade",
          loop: true,
          mousewheel: {
            invert: false,
          },
          pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
          },
        });
      }
    });
}

function handle_delete(e, v) {
  const listTour = JSON.parse(window.localStorage.getItem("dataPersonTour"));
  window.localStorage.setItem("page-detail", e);
  console.log(window.localStorage.getItem("page-detail"));
  fetch(
    "http://127.0.0.1:8000/api/personal/tour/delete/" + e + "?owner_id=" + v,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      createToast("success", "Delete tour success");
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    })
    .catch((error) => {
      createToast("error", "Delete tour error");
    });
}

function handle_detail_page(e) {
  const listTour = JSON.parse(window.localStorage.getItem("dataPersonTour"));
  window.localStorage.setItem("page-detail", e);
  console.log(window.localStorage.getItem("page-detail"));
  // e.href = 'http://localhost:3000/detailFind.html';
}

function handleUpdateTours(e) {
  localStorage.setItem("TourIdUpdate", e);
  location.href = "createTrip.html";
}

function start() {
  renderListTour();
}

start();

// // ---------------------------------------

profileTitleBtn.onclick = function () {
  if (profileGenaralEdit) {
    if (profileGenaralEdit.style.display === "block") {
      profileGenaralEdit.style.display = "none";
      profileGenaral.style.display = "block";
    } else {
      profileGenaralEdit.style.display = "block";
      profileGenaral.style.display = "none";
    }
  }
};

function edit() {
  profileGenaralEdit.style.display = "none";
  profileGenaral.style.display = "block";
}

btnProfileCancel.onclick = () => {
  if (profileGenaralEdit.style.display === "block") {
    profileGenaralEdit.style.display = "none";
    profileGenaral.style.display = "block";
  }
};

fetch(`http://localhost:8000/api/user/${targetProfileId}`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const user_info = data.user_info;
    userName[0].innerText = user_info[0].name;
    userName[1].innerText = user_info[0].name;
    userPhone.innerText = user_info[0].phone_number;
    userEmail.innerText = user_info[0].email;
    userGender.innerText = user_info[0].gender;
    userAbout.innerText = user_info[0].about;
    avatar.src = user_info[0].avatar;
  });

// if (login.status === 200) {
//   userName[0].innerText = login.user_info.name;
//   userName[1].innerText = login.user_info.name;
//   userPhone.innerText = login.user_info.phone_number;
//   userEmail.innerText = login.user_info.email;
//   userGender.innerText = login.user_info.user_profile[0].gender;
//   userAbout.innerText = login.user_info.about;
//   avatar.src = login.user_info.user_profile[0].avatar;
// } else {
//   userName[0].innerText = login.user_info.name;
//   userName[1].innerText = login.user_info.name;
//   userPhone.innerText = login.user_info.phone_number;
//   userEmail.innerText = login.user_info.email;
//   userGender.innerText = login.user_info.user_profile[0].gender;
//   userAbout.innerText = login.user_info.about;
// }

// // -----------------------  update profile user ------------------------------------

const apiUserProfile = "http://127.0.0.1:8000/api/user/profile/update";
let valid;

function getInfoUser() {
  var keyupEvent = new Event("keyup");
  controlList.forEach((control) => {
    control.dispatchEvent(keyupEvent);
  });
  if (valid) {
    fetch(apiUserProfile, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // id: login.user_info.user_profile[0].user_id,
        id: targetProfileId,
        name: inputUserName.value,
        phone_number: inputPhoneNumber.value,
        gender: inputGender.value,
        about: inputAbout.value,
        avatar: avatar.src,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data.user_info);
          window.localStorage.setItem("login", JSON.stringify(data));
          var datas = JSON.parse(window.localStorage.getItem("login"));
          console.log(datas);
          createToast("success");
          setTimeout(() => {
            window.location.reload();
            renderUserInfo(datas);
          }, 5000);
        }
      })
      .catch((error) => alert(error));
  }
}

var html_UserInfo = $(".profile-genaral");

// ----------------------- render user info ------------------------------

function renderUserInfo(obj) {
  const html = `
  <div class="profile-title">
  <h2>Hồ sơ của tôi</h2>
  <div class="profile-save">
      <button class="profile_update">Lưu</button>
      <p class="profile_cancel">Hủy</p>
  </div>
</div>
    <div class="form-profile-wraper">
    <form class="form-profile">
      <div class="form-profile-info">
          <label for="">Họ và tên</label>
          <div class="form-profile-content user_name">${
            obj.user_info.name
          }</div>
      </div>
      <div class="form-profile-info">
          <label for="">Số điện thoại</label>
          <div class="form-profile-conten user_phone">${
            obj.user_info.phone_number
          }</div>
      </div>
      <div class="form-profile-info">
          <label for="">Email</label>
          <div class="form-profile-content user_email">${
            obj.user_info.email
          }</div>
      </div>
      <div class="form-profile-info">
          <label for="">Giới tính/ Tuổi</label>
          <div class="form-profile-content user_gender">${"Male"}</div>
      </div>
      <div class="form-line"></div>
      <div class="form-profile-bio">
          <h2>About:</h2>
          <p class="user_about">${obj.user_info.about}</p>
      </div>
      <div class="form-line"></div>

      <div class="form-profile-hobbies form-profile-bio">
          <h2>Sở thích:</h2>
          <div class="profile-hobbies-list">
              <div class="tag hobbies-1">Cắm trại</div>
              <div class="tag hobbies-2">Cắm trại</div>
              <div class="tag hobbies-3">Cắm trại</div>
              <div class="tag hobbies-4">Cắm trại</div>
              <div class="tag hobbies-5">Cắm trại</div>
              <div class="tag hobbies-6">Cắm trại</div>
              <div class="tag hobbies-7">Cắm trại</div>
              <div class="tag hobbies-8">Cắm trại</div>
              <div class="tag hobbies-9">Cắm trại</div>
              <div class="tag hobbies-10">Cắm trại</div>
          </div>
      </div>
  </form>
</div> `;
  return (html_UserInfo.innerHTML = html);
}

// if (login.status === 200) {
btnUpdate.onclick = () => {
  getInfoUser();
  // window.location.reload(true);
};
// }

// ------------------------------------------------------------------

inputUserName.onchange = (e) => {
  console.log(e.target.value);
};
inputPhoneNumber.onchange = (e) => {
  console.log(e.target.value);
};
inputEmail.disabled = true;

if (login.msg === "Update thành công" || login.status === 200) {
  inputEmail.value = login.user_info.email;
} else {
  inputEmail.value = login.user_info.email;
}

inputGender.onchange = (e) => {
  console.log(e.target.value);
};

inputAbout.onchange = (e) => {
  console.log(e.target.value);
};

// // ------ lịch sử đặt tours------------------------------------------------

const historyTour = document.querySelector(".history-tour");
const supplierPages = document.querySelector(".supplierPages");
const profile = document.querySelector(".profileGenaral");

const newLocal = (historyTour.onclick = function () {
  supplierPages.style.display = "block";
  profile.style.display = "none";
});

// const TourID = $('.blog-slider__button');
// console.log(TourID);
// TourID.onclick = (tours) => {
//     console.dir(this.id);
// }

// const listTours = JSON.parse(window.localStorage.getItem("ListTour"));
// console.log(listTours);

const createGroup = $(".create-group");
createGroup.onclick = () => {
  window.location.href = "http://localhost:3000/group.html";
};

// ----------------------- toást message --------------------------------
const notifications = document.querySelector(".notifications"),
  buttons = document.querySelectorAll(".buttons .btn");
// Object containing details for different types of toasts
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: update profile success...",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: update profile error....",
  },
  warning: {
    icon: "fa-triangle-exclamation",
    text: "Warning: This is a warning toast.",
  },
  info: {
    icon: "fa-circle-info",
    text: "Info: This is an information toast.",
  },
};
const removeToast = (toast) => {
  toast.classList.add("hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
  setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
};
const createToast = (id, message) => {
  // Getting the icon and text for the toast based on the id passed
  const { icon, text } = toastDetails[id];
  const toast = document.createElement("li"); // Creating a new 'li' element for the toast
  toast.className = `toast ${id}`; // Setting the classes for the toast
  // Setting the inner HTML for the toast
  toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${message || text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
  notifications.appendChild(toast); // Append the toast to the notification ul
  // Setting a timeout to remove the toast after the specified duration
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};

const groups = document.querySelector(".myGroups .card-wrapper");

fetch(
  // `http://localhost:8000/api/personal/room/roomUserJoin?user_id=${login.user_info.user_profile[0].user_id}`
  `http://localhost:8000/api/personal/room/roomUserJoin?user_id=${targetProfileId}`
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const htmls = data.map(
      (item) => `<div class="card">
      <div class="image-content">
          <span class="overlay"></span>
          <div class="card-image">
              <img src="${
                item.image || "IMAGES/slides/slide-5.png"
              }" alt="" class="card-img">
          </div>
          </div>
          
          <div class="card-content">
            <h3 class="name-group">${item.name}</h3>
            <p>${item.members} thành viên</p>
            <p>Host: ${item.host_name}</p>
            <button onclick="updateHandler(${
              item.id
            })" style="border-radius: 10px; border: none; background-color: #4070F4; color: white; padding: 10px; cursor: pointer">Cập nhật</buton>
          </div>
  </div>`
    );

    groups.innerHTML += htmls.join("");
  });
function updateHandler(id) {
  fetch(`http://localhost:8000/api/personal/room/show/${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const updateRequest = {
        room_owner: login.user_info.user_profile[0].user_id,
        name: data.room.name,
        description: data.room.description,
        image: data.room.image,
        slot: data.room.slot,
      };
      avatarRoomUpdate.src = updateRequest.image;
      inputNameRoomUpdate.value = updateRequest.name;
      inputDescriptionRoomUpdate.value = updateRequest.description;
      inputNumberRoomUpdate.value = updateRequest.slot;
      formUpdateTour.style.display = "block";
      avatarRoomUpdate.onclick = () => {
        inputRoomUpdateAvatar.click();
        inputRoomUpdateAvatar.addEventListener("change", (e) => {
          const formdata = new FormData();
          formdata.append("directory", "avatar");
          formdata.append("file", e.target.files[0]);
          fetch("http://localhost:3000/upload", {
            method: "post",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              avatarRoomUpdate.src = data.data.fileUrl;
              updateRequest.image = data.data.fileUrl;
            });
        });
      };
      inputNameRoomUpdate.addEventListener("change", (e) => {
        updateRequest.name = e.target.value;
      });
      inputNumberRoomUpdate.addEventListener("change", (e) => {
        updateRequest.slot = e.target.value;
      });
      inputDescriptionRoomUpdate.addEventListener("change", (e) => {
        updateRequest.description = e.target.value;
      });
      submitUpdateRoom.onclick = () => {
        fetch(`http://localhost:8000/api/personal/room/update/${id}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRequest),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            location.reload();
          });
      };
      cancelUpdateRoom.onclick = () => {
        formUpdateTour.style.display = "none";
      };
    });
}

// ----------------------------------------------------------------------------

const controlList = document.querySelectorAll(".form-profile-text");
controlList.forEach((control) => {
  control.onkeyup = (e) => {
    console.log(e.target.classList[1]);
    switch (e.target.classList[1]) {
      case "input-username": {
        validateForm(e.target, ["required"]);
        break;
      }
      case "form-bio": {
        validateForm(e.target, ["required"]);
        break;
      }
      case "input-phonenumber": {
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
      warning.push("Email k hợp lệ");
      return false;
    }
    return true;
  });
  document.querySelector(
    `.${[...control.classList].join(".")} ~ small`
  ).innerText = warning.join(", ");
}
