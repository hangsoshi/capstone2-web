const login = JSON.parse(window.localStorage.getItem("login"));
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

console.log(login);

const socketRoom = io("http://localhost:3002/room", {
  auth: {
    token: login.user_info.user_profile[0].user_id,
  },
});

socketRoom.on("connect", () => {
  localStorage.setItem("socketId", socketRoom.id);
});
const createGroup = {
  owner_id: login.user_info.user_profile[0].user_id,
  name: "",
  description: "",
  image: "",
  slot: 0,
};
const avatar = document.querySelector(".CR-room-image");
const avatarInputFile = document.querySelector(".avatar-input-file");
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
      const image = avatar.querySelector("img");
      image.src = data.data.fileUrl;
      createGroup.image = data.data.fileUrl;
    });
};

// ----------- ẩn hiện create group-----------
const group = document.querySelector(".group");
const CRBody = document.querySelector("#CR-body");
const roomClose = document.querySelector(".room-close i");
const classC = document.querySelector(".class");
roomClose.onclick = function () {
  CRBody.style.display = "none";
  classC.style.display = "none";
};
group.onclick = function () {
  if (!login) {
    createToast("warn", "Bạn chưa đăng nhập");
    return;
  } else {
    CRBody.style.display = "block";
    classC.style.display = "block";
  }
};

// --------------- create room ------------------

const createRoom = $(".btn-create");
const roomName = $("#name-room");
roomName.onblur = (e) => {
  createGroup.name = e.target.value;
};
const slotInput = $("#slot-room");
slotInput.onblur = (e) => {
  createGroup.slot = Number(e.target.value);
};
const roomDescription = $("#description-room");
roomDescription.onblur = (e) => {
  createGroup.description = e.target.value;
};
if (login) {
  createRoom.onclick = (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".form-control");
    const requestValues = {};

    inputs.forEach((item) => {
      requestValues[item.attributes.name.value] = item.value;
    });
    fetch("http://127.0.0.1:8000/api/personal/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createGroup),
    })
      .then((response) => response.json())
      .then((val) => {
        createToast("success");
        setTimeout(() => {
          window.location.reload(true);
        }, 5000);
      })
      .catch((error) => {
        createToast("error");
      });
  };
}

// ------------------------- render room --------------------------------------

const api = "http://127.0.0.1:8000/api/personal/room/all";

var sliderFind = $(".group-content");

var htmlss = "";
function getTours() {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const tours = data.allRoom;
      console.log(tours);
      htmlss = tours
        .map((tour) => {
          return `<div class="group-item">
           <div class="group-img">
               <img src="../IMAGES/slides/slide-5.png" alt="">
           </div>
           <div class="group-info">
               <h4 class="group-info-name">${tour.name}</h4>
               <p>30 thành viên</p>
               <p class="host">host:${tour.room_owner_name}</p>
               <button onclick="joinRoom(${tour.id})">Tham gia</button>
           </div>
       </div>`;
        })
        .join("");
      return (sliderFind.innerHTML = htmlss);
    });
}

getTours();

function joinRoom(idRoom) {
  console.log(1);
  socketRoom.emit("join-room", {
    roomId: idRoom,
    joiner: login.user_info.user_profile[0].user_id,
  });
}

socketRoom.on("join-room-response", (response) => {
  createToast(response.status, response.message);
});

socketRoom.on("join-room", (users) => {
  console.log(users);
});

// -=-------------------- message toast ----------------------------
const notifications = document.querySelector(".notifications"),
  buttons = document.querySelectorAll(".buttons .btn");
// Object containing details for different types of toasts
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

// --------- validate ---------
const numberPeople = document.querySelector(".numberPeople");
const description = document.querySelector(".description");
const nameGroup = document.querySelector(".nameGroup");

function checkNumberPeople(e) {
  let peopleValue = Number(e.target.value);
  if (peopleValue <= 0) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Số người không hợp lệ`;
  } else if (peopleValue > 100) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `không được nhập quá 100 người`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

function validateMaxlength(e, length) {
  if (e.target.value.length > length) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Không quá ${length} kí tự`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

numberPeople.onchange = (e) => checkNumberPeople(e);
description.onchange = (e) => validateMaxlength(e, 50);
nameGroup.onchange = (e) => validateMaxlength(e, 40);
