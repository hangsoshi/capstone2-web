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
console.log(inputUserName);
console.log(inputPhoneNumber);
const inputEmail = $(".input-email");
const login = JSON.parse(window.localStorage.getItem("login"));
inputEmail.placeholder = login.userEmail;
// const inputAbout = $(".form-bio");
// const inputHobbies = $(".input-hobbies");
// const inputGender = $("#input-gender");
console.log(login);
const avatar = document.querySelector(".avatar_user_header");
const avatarInputFile = document.querySelector('.avatar-input-file')
avatar.onclick = () => {
  avatarInputFile.click()
}
avatarInputFile.onchange = (e) => {
  const formdata = new FormData()
  formdata.append('directory', 'avatar')
  formdata.append('file', e.target.files[0])
  fetch('http://localhost:3000/upload', {
    method: 'post',
    body: formdata
  })
    .then(res => res.json())
    .then(data => {
      avatar.src = data.data.fileUrl;
      login.user_info.user_profile[0].avatar = data.data.fileUrl;
    })
}


avatar.src = login.user_info.user_profile[0].avatar;

// ----- my trip----------
// new Swiper(".blog-slider", {
//     spaceBetween: 30,
//     effect: "fade",
//     loop: true,
//     mousewheel: {
//         invert: false,
//     },
//     // autoHeight: true,
//     pagination: {
//         el: ".blog-slider__pagination",
//         clickable: true,
//     },
// });

// -------------------- render list tour ------------------------

function getListTour() {
  fetch(
    "http://127.0.0.1:8000/api/personal/tour/all/" +
    login.user_info.user_profile[0].user_id
  )
    .then((res) => res.json())
    .then((data) => {
      window.localStorage.setItem("ListTour", JSON.stringify(data.all_tour));
      return;
    });
}

var tours;
var sliderFind = $(".swiper-wrapper");
const api = "http://127.0.0.1:8000/api/ts/tour/all/" + login.user_info.user_profile[0].id;
let htmls = "";
function renderListTour() {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      tours = data.all_tour;
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
          window.location.href =
            "http://127.0.0.1:5500/CAPSTONE2/FrontEnd/HTML/detailFind.html";
        };
      });
      console.log(tours);
      htmls = tours.map((tour) => {
        return `
                <div class="blog-slider__item swiper-slide data-id='${tour.id}'">
                
                <div class="blog-slider__img">

                    <img src="https://images.unsplash.com/photo-1512633017083-67231aba710d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
                        alt="">
                </div>
                <div class="blog-slider__content">
                    <div class="blog-slider__title">${tour.name}</div>
                    <div class="blog-slider__trip">
                        <p><b>Từ:</b> ${tour.address} - <b>Đến:</b> ${tour.name}</p>
                        <p class="tao-them">${tour.from_date}</p>
                    </div>
                    <div class="blog-slider__host"><b>Người tạo: </b>${login.user_info.name}</div>
                    <div class="blog-slider__text"> ${tour.description} </div>
                    <div class="profile-control">
                        <div class="">
                            <button onclick="handleClickDetail(${tour.id})" class="blog-slider__button">CHI TIẾT</button>
                        </div>
                        <div class="profile-action">
                            <a href="./createTrip.html">
                                <i class="fa-solid fa-pencil"></i>
                            </a>
                            <i class="fa-solid fa-trash-can" onclick="handle_detail_page(${tour.id},${tour.ts_id})"></i>
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
          // autoHeight: true,
          pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
          },
        });
      }
    });
}

const handleClickDetail = (id) => {
  localStorage.setItem("page-detail", id);
  window.location.href = "detailFind.html";
};

// const handle_detail_page = $(".blog-slider__button");
// -------------------------- delete ----------------------------------------------
function handle_detail_page(e) {
  console.log(e);
  window.localStorage.setItem("page-detail", e);
  console.log(window.localStorage.getItem("page-detail"));
  const params = { ts_id: `${login.user_info.user_profile[0].user_id}` };
  fetch(
    "http://127.0.0.1:8000/api/ts/tour/delete/" +
    e +
    "?owner_id=" +
    params.ts_id,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function start() {
  renderListTour();
}

start();

const names = $(".header-name1");
const avatarUser = $("#avatar_user");
const avatarUser1 = $(".avatar_user_header");


// // ---------------------------------------



function edit() {
  profileGenaralEdit.style.display = "none";
  profileGenaral.style.display = "block";
}

// // -----------------------  update profile user ------------------------------------
// var profile;

var html_UserInfo = $(".profile-genaral");
console.log(html_UserInfo);

// ----------------------- render user info ------------------------------

function renderTSInfo(obj) {
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
        <div class="form-profile-content user_name">${obj.user_info.name}</div>
    </div>
    <div class="form-profile-info">
        <label for="">Số điện thoại</label>
        <div class="form-profile-content user_phone">${obj.user_info.phone_number}</div>
    </div>
    <div class="form-profile-info">
        <label for="">Email</label>
        <div class="form-profile-content user_email">${obj.user_info.email}</div>
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
  return html_UserInfo.innerHTML = html;
}

function getInfoTS() {
  fetch("http://127.0.0.1:8000/api/ts/profile/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: login.user_info.user_profile[0].user_id,
      name: inputUserName.value,
      phone_number: inputPhoneNumber.value,
      avatar: login.user_info.user_profile[0].avatar,
    }),
    data: {
      id: login.user_info.user_profile[0].user_id,
      name: inputUserName.value,
      phone_number: inputPhoneNumber.value,
      avatar: login.user_info.user_profile[0].avatar,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const data1 = data;
      // window.localStorage.removeItem("login");
      window.localStorage.setItem("login", JSON.stringify(data));
      // const profile = JSON.parse(window.localStorage.getItem("dataa"));
      renderTSInfo(data1);
      console.log("Cập nhật thông tin thành công");
      window.location.reload();
    })
    .catch(error => {
      alert(error)
    });
}

btnUpdate.onclick = () => {
  getInfoTS();
};

// ------------------------------------------------------------------

// inputUserName.onchange = (e) => {
//     console.log(e.target.value);
// }
// inputPhoneNumber.onchange = (e) => {
//     console.log(e.target.value);
// }
// inputEmail.disabled = true;

if (login.msg === "Update thành công" || login.status === 200) {
  inputEmail.value = login.user_info.email;
} else {
  inputEmail.value = login.user_info.email;
}

// inputGender.onchange = (e) => {
//     console.log(e.target.value);
// }

// inputAbout.onchange = (e) => {
//     console.log(e.target.value)
// }

// // // ------ lịch sử đặt tours------------------------------------------------

// const historyTour = document.querySelector('.history-tour')
// const supplierPages = document.querySelector('.supplierPages')
// const profile = document.querySelector('.profileGenaral')

// const newLocal = historyTour.onclick = function () {
//     supplierPages.style.display = 'block';
//     profile.style.display = 'none';
// };

// const TourID = $('.blog-slider__button');
// console.log(TourID);
// TourID.onclick = (tours) => {
//     console.dir(this.id);
// }

// const listTours = JSON.parse(window.localStorage.getItem("ListTour"));
// console.log(listTours);

const tourNames = document.querySelectorAll(
  ".blog-slider__item .blog-slider__content .profile-control .profile-action .fa-trash-can"
);
// console.log(4);
tourNames.forEach((tourr) => {
  tourr.onclick = (e) => {
    alert(e.target.dataset.tourr);
    localStorage.setItem("targetTourId", e.target.dataset.tourr);
  };
});

const createGroup = $(".create-group");
createGroup.onclick = () => {
  window.location.href = "http://localhost:3000/TS-postTour.html";
};
