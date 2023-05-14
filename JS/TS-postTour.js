const login = JSON.parse(window.localStorage.getItem("login"));

const requestInputs = document.querySelectorAll(".request");
const createTourButton = document.querySelector(".create-tour-submit");
let schedules = [];
createTourButton.onclick = () => {
  const request = {
    name: "",
    ts_id: localStorage.getItem("id"),
    description: "",
    address: "",
    from_date: "",
    to_date: "",
    price: "",
    slot: "",
    schedule: "",
  };
  requestInputs.forEach((input) => {
    const { key } = input.dataset;
    request[key] = input.value;
  });
  fetch("http://127.0.0.1:8000/api/ts/tour/create", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
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
      console.log(data);
    })
    .catch((error) => console.log(error));
};

// --------- next- prev --------------
const postImgWrap = document.querySelector(".post-img-wrap");
const wraperPostInf = document.querySelector(".wraper-post-inf");
const controlNext = document.querySelector(".control-next button");
const controlPrev = document.querySelector(".control-prev");

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

let id = 0;
const array = [
  {
    id: 0,
    value: `<div class="post-item">
  <div class="post-control">
  <p>Lịch trình</p>
  </div>
  <div class="post-control-input">
                                <input type="text" placeholder="Nhập tên chuyến đi ( Ví dụ: Ngày 1: Đà Nẵng - Hà Nội )">
                            </div>
  </div>
  <div class="post-item">
  <div class="post-control">
      <i class="fa-solid fa-trash"></i>
  </div>
  <div class="post-control-input">
                                <textarea cols="30" rows="10" placeholder="Mô tả nội dung chuyến đi..."></textarea>
                            </div>
  </div>`,
  },
];

postSchedualAdd.onclick = () => {
  id++;
  array.push({
    id,
    value: `<div class="post-item">
    <div class="post-control">
    </div>
    <div class="post-control-input">
      <input type="text" placeholder="Nhập tên chuyến đi ( Ví dụ: Ngày 1: Đà Nẵng - Hà Nội )">
    </div>
    </div>`,
  });
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
        <i data-id="${
          schedule.id
        }" class="fa-solid fa-trash remove-schedule"></i>
      </div>
      <div class="post-control-input">
        <textarea
          data-id="${schedule.id}"
          data-type="description"
          cols="30"
          rows="10"
          placeholder="Mô tả nội dung chuyến đi..."
          class="schedule-description"
        >${schedule.desc}</textarea>
      </div>
    </div>
  </div>`;
    });
  postSchedualInput.innerHTML = array.map((val) => val.value).join("");
  postControl = document.querySelectorAll(".post-control i");
  console.log(postControl);
  postControl.forEach((element) => {
    element.onclick = (e) => {
      console.log(e.target);
      const re = e.target.dataset.remove;

      postSchedualInput.innerHTML = array
        .map((val) => {
          if (val.id !== Number(re)) {
            console.log(val.value);
            return val.value;
          } else return "";
        })
        .join("");
    };
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
                  console.log("adsfdsf");
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
          console.log("adsfdsf");
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

  // ------ handelImages ---------
  const chooseFiles = document.querySelector(".choose-files");
  const dropInput = document.querySelector(".drop-input");
  const showImages = document.querySelector(".show-images");
  const dragImages = document.querySelector(".drag-images");
  const postImages = document.querySelector(".post-images");
  console.log(postImages);
  console.log(dragImages);
  chooseFiles.onclick = function () {
    dropInput.click();
  };

  const z = document.querySelector.bind(document);
  const logout = z(".form-logout");
  logout.onclick = () => {
    alert("Bạn chắc chắn muốn thoát ?");
    window.localStorage.clear();
    window.location.reload(true);
    window.location.href = "http://localhost:3000/home.html";
  };

  // ------ handelImages ---------
  chooseFiles.onclick = function () {
    dropInput.click();
  };

  var countImages = [],
    objectURL = [];
  var a = [];
  dropInput.onchange = function (e) {
    files = e.target.files;
    for (const file of files) {
      countImages.push(URL.createObjectURL(file));
      const renderUI = countImages.map((item, index) => {
        return `<div class="list-images" data-remove="${index}" onclick="handleDelete(${index})">
      <img src="${item}" alt="">
      <i class="fa-solid fa-xmark"></i>
      </div>`;
      });
      showImages.innerHTML = renderUI.join("");
    }
    var countImages = [];
    dropInput.onchange = function (e) {
      console.log(e);
      console.log(e.target.files[0]);
      objectURL = URL.createObjectURL(e.target.files[0]);
      countImages.push(objectURL);
      const renderUI = countImages.map((item) => {
        return `<div class="list-images">
    <img src="${item}" alt="">
    <i class="fa-solid fa-xmark"></i>
  </div>`;
      });
      showImages.innerHTML = renderUI.join("");

      if (countImages.length > 0) {
        showImages.style.display = "flex";
        postImages.style.alignItems = "start";
      }
      console.log(countImages);
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
  };
};
