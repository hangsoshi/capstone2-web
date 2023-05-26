const login = JSON.parse(window.localStorage.getItem("login"));

const requestInputs = document.querySelectorAll(".request");
const createTourButton = document.querySelector(".create-tour-submit");
let schedules = [];
createTourButton.onclick = () => {
  const request = {
    name: "",
    ts_id: Number(login.user_info.user_profile[0].id),
    description: "",
    address: "",
    from_date: "",
    to_date: "",
    price: 0,
    slot: 0,
    schedule: [],
    images: [],
  };
  requestInputs.forEach((input) => {
    const { key } = input.dataset;
    if (key === "price" || key === "slot") {
      request[key] = Number(input.value);
    } else {
      request[key] = input.value;
    }
  });
  fetch("http://127.0.0.1:8000/api/ts/tour/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      images: JSON.stringify(countImages),
      schedule: JSON.stringify(
        schedules.map((item, index) => {
          delete item.id;
          return {
            ...item,
            order: index + 1,
          };
        })
      ),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      createToast("success", data.msg);
      setTimeout(()=>{
        window.location.reload();
      },5000)
    })
    .catch((error) => createToast("error"));
};

// --------- next- prev --------------
const postImgWrap = document.querySelector(".post-img-wrap");
const wraperPostInf = document.querySelector(".wraper-post-inf");
const controlNext = document.querySelector(".control-next button");
const controlPrev = document.querySelector(".control-prev");

// const avatar = document.querySelector(".img-tour");
// console.log(avatar);
// const avatarInputFile = document.querySelector('.drop-input')
// console.log(avatarInputFile);
// avatarInputFile.onchange = (e) => {
//   const formdata = new FormData()
//   formdata.append('directory', 'avatar')
//   formdata.append('file', e.target.files[0])
//   fetch('http://localhost:3000/upload', {
//     method: 'post',
//     body: formdata
//   })
//     .then(res => res.json())
//     .then(data => {
//       avatar.src = data.data.fileUrl
//     })
// }

controlNext.onclick = function () {
  postImgWrap.style.display = "none";
  wraperPostInf.style.display = "block";
};

controlPrev.onclick = function () {
  postImgWrap.style.display = "block";
  wraperPostInf.style.display = "none";
};

// ---------------- schedual------------

const postSchedualAdd = document.querySelector(".post-schedual-add i");
const postSchedualInput = document.querySelector(".post-schedual");
let postControl = document.querySelectorAll(".post-control i");

const ID = () => "_" + Math.random().toString(36).substring(2, 9);
const renderSchedules = () =>
  schedules.map((schedule, index) => {
    return `<div class="post-schedual-input">
  <div class="post-item">
    <div class="post-control">
      <p>Ngày ${index + 1}</p>
    </div>
    <div class="post-control-input">
    <div style="position: relative">
      <input
        class="schedule-name"
        data-id="${schedule.id}"
        data-type="name"
        value="${schedule.name}"
        type="text"
        placeholder="Nhập tên chuyến đi ( Ví dụ: Ngày 1: Đà Nẵng - Hà Nội )"
      />
      <ul
        data-id="${schedule.id}"
        class="destination-schedules"
      >
      </ul>
    </div>
    </div>
  </div>
  <div class="post-item">
    <div class="post-control">
      <i data-id="${schedule.id}" class="fa-solid fa-trash remove-schedule"></i>
    </div>
    <div class="post-control-input">
    <textarea data-id="${
      schedule.id
    }" data-type="description" cols="30" rows="10"
    placeholder="Mô tả nội dung chuyến đi..." class="schedule-description"></textarea>
    </div>
  </div>
</div>`;
  });
let aborter = null;
const searching = (value, listdom, itemclass) => {
  console.log(value);
  aborter = new AbortController();
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
  const params = {
    q: value,
    format: "json",
    addressdetails: 1,
    polygon_geojson: 0,
  };
  const queryString = new URLSearchParams(params).toString();
  const requestOptions = {
    method: "get",
    redirect: "follow",
  };
  fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      listPlace = JSON.parse(result);
      const places = listPlace
        .map(
          (place) =>
            `<li data-lat="${place.lat}" data-lon="${place.lon}" class="destination-schedule"><p>${place.display_name}</p></li>`
        )
        .join("");
      listdom.innerHTML = places;
      const listItem = listdom.querySelectorAll(`.${itemclass}`);
      listItem.forEach((item) => {
        item.onclick = () => {
          const id = listdom.dataset.id;
          const lat = item.dataset.lat;
          const lon = item.dataset.lon;
          const text = item.querySelector("p").innerText;
          listdom.innerHTML = null;
          schedules = schedules.map((schedule) =>
            schedule.id === id
              ? { ...schedule, name: text, lat, lon }
              : schedule
          );
          postSchedualInput.innerHTML = renderSchedules().join("");
          const scheduleNames = document.querySelectorAll(".schedule-name");
          const scheduleDescriptions = document.querySelectorAll(
            ".schedule-description"
          );
          const listSearchDestination = document.querySelectorAll(
            ".destination-schedules"
          );
          scheduleNames.forEach((input) => {
            input.onkeydown = (e) => {
              const id = input.dataset.id;
              if (e.key === "Enter") {
                const targetList = [...listSearchDestination].find(
                  (item) => item.dataset.id === id
                );
                searching(e.target.value, targetList, "destination-schedule");
              }
            };
          });
          scheduleDescriptions.forEach((input) => {
            input.onchange = (e) => {
              const id = input.dataset.id;
              schedules = schedules.map((schedule) =>
                schedule.id === id
                  ? { ...schedule, desc: e.target.value }
                  : schedule
              );
              console.log(schedules);
            };
          });
          const removeScheduleButton =
            document.querySelectorAll(".remove-schedule");
          removeScheduleButton.forEach((button) => {
            button.onclick = () => {
              const id = button.dataset.id;
              schedules = schedules.filter((schedule) => schedule.id !== id);
              postSchedualInput.innerHTML = renderSchedules().join("");
            };
          });
        };
      });
    })
    .catch((error) => console.log(error));
};
postSchedualAdd.onclick = () => {
  schedules.push({
    id: ID(),
    name: "",
    desc: "",
    lat: null,
    lon: null,
  });
  postSchedualInput.innerHTML = renderSchedules().join("");
  const scheduleNames = document.querySelectorAll(".schedule-name");
  const scheduleDescriptions = document.querySelectorAll(
    ".schedule-description"
  );
  const listSearchDestination = document.querySelectorAll(
    ".destination-schedules"
  );
  scheduleNames.forEach((input) => {
    input.onkeydown = (e) => {
      const id = input.dataset.id;
      if (e.key === "Enter") {
        const targetList = [...listSearchDestination].find(
          (item) => item.dataset.id === id
        );
        searching(e.target.value, targetList, "destination-schedule");
      }
    };
  });
  scheduleDescriptions.forEach((input) => {
    input.onchange = (e) => {
      const id = input.dataset.id;
      schedules = schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, desc: e.target.value } : schedule
      );
      console.log(schedules);
    };
  });
  const removeScheduleButton = document.querySelectorAll(".remove-schedule");
  removeScheduleButton.forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.id;
      schedules = schedules.filter((schedule) => schedule.id !== id);
      postSchedualInput.innerHTML = renderSchedules().join("");
    };
  });
};
const chooseFiles = document.querySelector(".choose-files");
const dropInput = document.querySelector(".drop-input");
const showImages = document.querySelector(".show-images");
const dragImages = document.querySelector(".drag-images");
const postImages = document.querySelector(".post-images");

// ------ handelImages ---------
chooseFiles.onclick = function () {
  dropInput.click();
};

const dataShow = document.querySelector(".drop-input");
const avatarShow = document.querySelector(".img_listTour");
// const avatarInputFile = document.querySelector('.drop-input')
console.log(avatarShow);
var aaaa = document.querySelectorAll(".img_listTour");

let countImages = [];
let objectURL = [];
var a = [];
dropInput.onchange = function (e) {
  var listImg = e.target.files;
  for (var i = 0; i < listImg.length; i++) {
    const formdata = new FormData();
    formdata.append("directory", "avatarShow");
    console.log(listImg[i]);
    formdata.append("file", listImg[i]);
    fetch("http://localhost:3000/upload", {
      method: "post",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        countImages.push(data.data.fileUrl);
        files = e.target.files;
        // countImages = [...countImages];
        // console.log(countImages);
        var index = 0;
        const renderUI = countImages.map((item, index) => {
          console.log(item);
          return `<div class="list-images" data-remove="${index}" onclick="handleDelete(${index})">
    <img src="${item}" alt="">
    <i class="fa-solid fa-xmark"></i>
    </div>`;
        });
        showImages.innerHTML = renderUI.join("");
        if (countImages.length > 0) {
          showImages.style.display = "flex";
          postImages.style.alignItems = "start";
        }
      });
  }
};

function handleDelete(id) {
  console.log(id);
  let dataDelete = document.querySelectorAll(".list-images");
  console.log(dataDelete[id].dataset.remove);
  countImages.splice(id, 1);
  console.log(countImages);
  const renderUI = countImages.map((item, index) => {
    return `<div class="list-images" data-remove="${index}" onclick="handleDelete(${index})">
  <img src="${item}" alt="">
  <i class="fa-solid fa-xmark"></i>
  </div>`;
  });
  showImages.innerHTML = renderUI.join("");
}

// --------- validate form ----------
const nameTrip = document.querySelector(".nameTrip");
const startPlace = document.querySelector(".startPlace");
const fromDate = document.querySelector(".fromDate");
const toDate = document.querySelector(".toDate");
const cost = document.querySelector(".cost");
const numberPeople = document.querySelector(".numberPeople");

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

function emptyValue(e) {
  if (e.target.value == "") {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Bạn không được để trống`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

function validateDateFrom(e) {
  var dateValue = new Date(e.target.value);
  var dateNow = new Date();

  if (dateNow >= dateValue) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Ngày không hợp lệ`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

function validateDateTo(e) {
  let dateFrom = document.querySelector(".fromDate").value;
  let dateFromValue = new Date(dateFrom);
  let dateToValue = new Date(e.target.value);

  if (dateToValue < dateFromValue) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Ngày không hợp lệ`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

function checkCost(e) {
  if (e.target.value <= 0) {
    e.target.classList.add("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = `Số tiền không hợp lệ`;
  } else {
    e.target.classList.remove("error");
    document.querySelector(
      `.${[...e.target.classList].join(".")} ~ p`
    ).innerText = "";
  }
}

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

nameTrip.onchange = (e) => validateMaxlength(e, 40);
startPlace.onchange = (e) => emptyValue(e);
fromDate.onchange = (e) => validateDateFrom(e);
toDate.onchange = (e) => validateDateTo(e);
cost.onchange = (e) => checkCost(e);
numberPeople.onchange = (e) => checkNumberPeople(e);

// const dataShow = document.querySelector(".drop-input");
// const avatarShow = document.querySelector(".img_listTour");
// // const avatarInputFile = document.querySelector('.drop-input')
// console.log(avatarShow);
// var aaaa = document.querySelectorAll(".img_listTour")
// dataShow.onchange = (e) => {
//   var listImg = e.target.files;
//   for(var i=0 ; i<listImg.length ; i++){
//     const formdata = new FormData()
//     formdata.append('directory', 'avatarShow')
//     console.log(listImg[i]);
//     formdata.append('file',listImg[i])
//     fetch('http://localhost:3000/upload', {
//       method: 'post',
//       body: formdata
//     })
//       .then(res => res.json())
//       .then(data => {
//         for(var i=0 ; i<listImg.length ; i++){
//           aaaa[i].src = data.data.fileUrl;
//           countImages.push(data.data.fileUrl)
//         }
//         console.log();
//       })

//     }console.log(formdata);
//   }

const notifications = document.querySelector(".notifications");
// Object containing details for different types of toasts
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: Create Tour success...",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: Create Tour error....",
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
