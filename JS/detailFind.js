const headerNavForm = document.querySelector(".header-nav-form");
const headerForm = document.querySelector(".header-form");
const headerFormLogin = headerNavForm.querySelector(".header-form-login");
const headerFormLogout = document.querySelector(".header-form-logout");
const login = JSON.parse(window.localStorage.getItem("login"));
const pageDetail = window.localStorage.getItem("page-detail");
const z = document.querySelector.bind(document);
const zz = document.querySelectorAll.bind(document);

if (login) {
  headerNavForm.onclick = function () {
    if (headerForm.style.display === "none") {
      headerForm.style.display = "block";
      headerFormLogout.style.display = "block";
      headerFormLogin.style.display = "none";
    } else {
      headerForm.style.display = "none";
      headerFormLogout.style.display = "none";
    }
  };
} else {
  headerNavForm.onclick = function () {
    if (headerForm.style.display === "none") {
      headerForm.style.display = "block";
      headerFormLogin.style.display = "block";
      headerFormLogout.style.display = "none";
    } else {
      headerForm.style.display = "none";
      headerFormLogin.style.display = "none";
    }
  };
}
const names = z(".header-name1");
const avatarUser = z(".header-form-avatar #avatar_user");
console.log(avatarUser);
if (login) {
  names.innerText = login.user_info.name;
  avatarUser.src = login.user_info.user_profile[0].avatar;
}

//   ----------------------------------------------------------------------
const logout = document.getElementsByClassName("form-logout");
logout.onclick = () => {
  alert("Bạn chắc chắn muốn thoát ?");
  window.localStorage.clear();
  window.location.reload(true);
  window.location.href = "http://localhost:3000/login-register.html";
};
// ---------------------------------------

const apiPersonTourDetail = "http://127.0.0.1:8000/api/personal/tour/show/";
var htmlPersonTour = z(".detail-container");

function RenderTourDetail(obj) {
  const target = obj[0];
  console.log(target);
  const from_date = new Date(target.from_date).getTime();
  const to_date = new Date(target.to_date).getTime();
  const now = new Date().getTime();
  const compare = now < from_date || now < to_date;
  const htmls = `
    <div class="detail-inf-tour">
    <div class="detail-inf-wraper">
        <div class="detail-inf">
            <h1>${target.name}</h1>
            <div class="detail-inf-all detail-inf-time">
            </div>
            <div class="detail-inf-all detail-inf-time">
                <i class="fa-solid fa-location-dot"></i>
                <p><b>Điểm đến: </b>${target.to_where}</p>
            </div>
            <div class="detail-inf-all detail-inf-time">
                <i class="fa-solid fa-person"></i>
                <p><b>Số thành viên: </b>${target.member_list.length}</p>
            </div>
            <div class="detail-inf-all detail-inf-time">
                <i class="fa-solid fa-calendar-days"></i>
                <p>${target.from_date} - ${target.to_date}</p>
            </div>
        </div>
        <div class="detail-trip">
            <h4>Mô tả chuyến đi</h4>
            <p>${target.description}</p>
        </div>

        <div class="detail-host">
            <h4 style="font-size: 22px; display: flex; align-items: center;">Chuyến đi được tạo bởi: <span style="color: #000; margin-left: 10px;">${
              target.owner_name
            }</span></h4>
            <div class="detail-host-inf">
                <div class="detail-host-img" data-id="${target.owner_id}">
                    <img src="${
                      target.owner_avatar
                    }" alt="avatar" style="border-radius: 50%;">
                </div>
                <div class="detail-confirm" style="position: relative">
                    <div class="detail-confirm-icon detail-confirm-email">
                        <i class="fa-solid fa-fingerprint"></i>
                        <p>Xác minh qua email</p>
                    </div>
                    <div class="detail-confirm-icon detail-confirm-facebook">
                        <i class="fa-solid fa-fingerprint"></i>
                        <p>Xác minh qua facebook</p>
                    </div>
                    <div class="add-friend">
                        <button onclick="handleAddFriend(${target.owner_id})">
                            <i class="fa-solid fa-user-plus" style="color: #ffffff;"></i>
                            Theo dõi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="detail-map">
        <div id="map" style="height: 250px">
            
        </div>
        <div class="detail-inf-action" style="padding-bottom: 25px">
            <div class="detail-action detail-book">
                <button style="font-size: 18px; ${
                  compare || "display: none"
                }" class="join-button">Tham gia</button>
            </div>
        </div>

        <div style="padding: 20px;"><h4>Thành viên đã tham gia</h4></div>
        <div class="detail-member">
            
        </div>
    </div>
</div>
  `;
  const socketRoom = io("http://localhost:3002/room", {
    auth: {
      token: localStorage.getItem("id"),
    },
  });

  htmlPersonTour.innerHTML = htmls;
  const hostAvatar = document.querySelector(".detail-host-img");
  hostAvatar.addEventListener("click", () => {
    const id = hostAvatar.dataset.id;
    localStorage.setItem("target-profile-id", id);
    location.href = "profile.html";
  });

  const memberContainer = document.querySelector(".detail-member");

  const mapDOM = document.querySelector("#map");
  const map = L.map(mapDOM).setView(
    [
      Number(target.lat.replaceAll(",", ".")),
      Number(target.lon.replaceAll(",", ".")),
    ],
    5
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([
    Number(target.lat.replaceAll(",", ".")),
    Number(target.lon.replaceAll(",", ".")),
  ]).addTo(map);
  memberContainer.innerHTML = target.member_list
    .map(
      (member) => `<div class="detail-member-wraper">
          <div class="detail-member-img">
              <img src="../IMAGES/slides/slide-0.png" alt="">
          </div>
          <div class="detail-member-name">
              <p>${member.name}</p>
          </div>
        </div>`
    )
    .join("");

  const joinButton = document.querySelector(".join-button");
  function joinRoom(idRoom) {
    //     createToast("success", val.msg);
    socketRoom.emit("join-room", {
      roomId: idRoom,
      joiner: login.user_info.user_profile[0].user_id,
    });
  }
  joinButton.onclick = () => {
    joinRoom(target.room_id);
  };
  socketRoom.on("join-room-response", (response) => {
    createToast(response.status, response.message);
  });
}

const handleAddFriend = (id) => {
  fetch(
    `http://127.0.0.1:8000/api/friend/create?user_id=${localStorage.getItem(
      "id"
    )}&friend_id=${id}`,
    {
      method: "post",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      createToast("success", data.msg);
    });
};

fetch("http://127.0.0.1:8000/api/personal/tour/show/" + pageDetail)
  .then((res) => res.json())
  .then((data) => {
    RenderTourDetail(data);
  });

const notifications = document.querySelector(".notifications");
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: Create Room success...",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: Create Room error....",
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
