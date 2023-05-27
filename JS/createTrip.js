const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const login = JSON.parse(window.localStorage.getItem("login"));
const updateTour = localStorage.getItem("TourIdUpdate");

const destinationInput = $(".diemden");
const destinationSuggestList = $(".destination-location-suggestion");
const currentLocationSuggestList = $(".current-location-suggestion");
const uploadImage = $(".upload_image");
const importImage = $(".input_image");

const rooms = document.querySelector(".what-room");

const createTourState = {
  name: "",
  owner_id: 0,
  description: "",
  from_date: "",
  to_date: "",
  lat: "",
  lon: "",
  to_where: "",
  room_id: 0,
  image: "",
};

console.log(localStorage.getItem("id"));

fetch(
  "http://127.0.0.1:8000/api/personal/room/roomOfUser?user_id=" + `${login.user_info.user_profile[0].user_id}`)
  .then((res) => res.json())
  .then((data) => {
    rooms.innerHTML = `<option value="" selected disabled hidden>Chọn nhóm</option>`;
    rooms.innerHTML += data
      .map(
        (item) =>
          `<option class="room-option" value="${item.id}">${item.name}</option>`
      )
      .join("");
    rooms.onchange = (e) => {
      createTourState.room_id = e.target.value;
    };
  });

const mapDOM = $(".form-map");
const map = L.map(mapDOM).setView([51.505, -0.09], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  const marker = L.marker([lat, lng]).addTo(map);
  marker.on("click", (e) => {
    map.removeLayer(marker);
  });
});

let listPlace = [];

const handleDestinationSuggestItemClick = (doms, parent) => {
  doms.forEach((item) => {
    item.onclick = () => {
      const { lat, lon } = item.dataset;
      const name = item.querySelector("p").innerText;
      // gán lat, lon cho biến bất kỳ để có thể ném vào trong call api create-tour, ví dụ: a = lat; b = lon
      createTourState.lat = lat;
      createTourState.lon = lon;
      createTourState.to_where = name;
      destinationInput.value = name;
      const marker = L.marker([lat, lon], { draggable: true }).addTo(map);
      map.flyTo([lat, lon], 19);
      marker.on("dragend", (e) => { });
      parent.innerHTML = null;
    };
  });
};

const handleCurrentLocationSuggestItemClick = (doms, parent) => {
  doms.forEach((item) => {
    item.onclick = () => {
      const { lat, lon } = item.dataset;
      const name = item.innerText;
      // gán name của điểm xuất phát, ví dụ: a = name
      const marker = L.marker([lat, lon], { draggable: true }).addTo(map);
      map.flyTo([lat, lon], 10);
      marker.on("dragend", (e) => { });
      parent.innerHTML = null;
    };
  });
};

let aborter = null;
const searching = (value, listdom, itemclass, func) => {
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
            `<li data-lat="${place.lat}" data-lon="${place.lon}" class="destination-item"><p>${place.display_name}</p></li>`
        )
        .join("");
      listdom.style.display = "block";
      listdom.innerHTML = places;
      const itemdoms = listdom.querySelectorAll(`.${itemclass}`);
      func(itemdoms, listdom);
    })
    .catch((error) => console.log(error));
};

const debounce = (func, timeout = 300) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, timeout);
  };
};

destinationInput.onkeydown = (e) => {
  if (e.key === "Enter") {
    searching(
      e.target.value,
      destinationSuggestList,
      "destination-item",
      handleDestinationSuggestItemClick
    );
  }
};

const notifications = document.querySelector(".notifications"),
  buttons = document.querySelectorAll(".buttons .btn");
// Object containing details for different types of toasts
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: Tạo tour thành công...",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: Tạo tour thất bại....",
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

const button1 = document.querySelector(".button1 button");
const button2 = document.querySelector(".button2 button");
const formTrip1 = document.querySelector(".form-trip-1");
const formTrip2 = document.querySelector(".form-trip-2");
const formNext = document.querySelector(".form-next button");
const goBack = document.querySelector(".goBack");
const startCreateTrip = document.querySelector(".startCreateTrip");

const tenchuyendi = $(".tenchuyendi");
const diemden = $(".diemden");
const tungay = $(".tungay");
const denngay = $(".denngay");
const description = $(".description");

denngay.onblur = (e) => {
  createTourState.to_date = e.target.value;
};

tungay.onblur = (e) => {
  createTourState.from_date = e.target.value;
};

tenchuyendi.onkeydown = (e) => {
  createTourState.name = e.target.value;
};

description.onkeydown = (e) => {
  createTourState.description = e.target.value;
};

// ------------------------------- image -----------------------

let objImage;
uploadImage.onclick = () => {
  importImage.click();
  importImage.onchange = (e) => {
    const formdata = new FormData();
    formdata.append("directory", "thumbnail");
    formdata.append("file", e.target.files[0]);
    fetch("http://localhost:3000/upload", {
      method: "post",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        createTourState.image = data.data.fileUrl;
        uploadImage.innerText = null;
        uploadImage.style.backgroundImage = `url('${data.data.fileUrl}')`;
      });
  };
};

// ----------- Validate form ---------------

const listError = ["required", "maxLength", "dateFrom", "dateTo", "emoji", "specialCharacter"]
let valid;
function validateForm(control, listError) {
  var dateFromValue = new Date(tungay.value);
  var dateToValue = new Date(denngay.value);
  var dateNow = new Date();

  let warning = [];
  valid = listError.every((error) => {
    if (error === 'required' && !control.value) {
      warning.push('Không được để trống');
      return false;
    }
    if (error === 'dateFrom' && (dateFromValue < dateNow || dateFromValue > dateToValue)) {
      warning.push('Ngày đi không hợp lệ');
      return false;
    }
    if (error === 'dateTo' && (dateToValue < dateFromValue)) {
      warning.push('Ngày đến không hợp lệ');
      return false;
    }
    if (error === 'maxLength' && control.value.length > 50) {
      warning.push('Không quá 50 kí tự');
      return false;
    }
    return true;
  })
  document.querySelector(
    `.${[...control.classList].join(".")} ~ small`
  ).innerText = warning.join(', ');
}
var controlLists = document.querySelectorAll('.form-control')
console.log(controlLists);
controlLists.forEach((control) => {
  // console.log(control);
  control.onkeyup = (e) => {
    console.log(e.target.classList[1]);
    switch (e.target.classList[1]) {
      case 'tenchuyendi': {
        validateForm(e.target, ["required"]);
        break;
      }
      case 'tungay': {
        validateForm(e.target, ["dateFrom"]);
        break;
      }
      case 'denngay': {
        validateForm(e.target, ["dateTo"]);
        break;
      }
      case 'diemden': {
        validateForm(e.target, ["required"]);
        break;
      }
      case 'description': {
        validateForm(e.target, ["required"]);
        break;
      }
    }
  }
})

// ---------------------------------   create trip   ----------------------------------------
const btnCreateTrip = document.querySelector(".create-trip");
const tourID = JSON.parse(window.localStorage.getItem("detail-tour"));
if (updateTour) {
  btnCreateTrip.innerText = "Cập nhật chuyến đi";
}

if (updateTour) {
  fetch(`http://localhost:3002/api/client/tours/${updateTour}`)
    .then((res) => res.json())
    .then((data) => {
      createTourState.name = data.name;
      createTourState.owner_id = data.owner_id;
      createTourState.description = data.description;
      createTourState.from_date = data.from_date;
      createTourState.to_date = data.to_date;
      createTourState.lat = data.lat;
      createTourState.lon = data.lon;
      createTourState.to_where = data.to_where;
      createTourState.room_id = data.room_id;
      rooms.value = createTourState.room_id;
      tenchuyendi.value = createTourState.name;
      tungay.value = new Date(createTourState.from_date)
        .toISOString()
        .slice(0, 10);
      denngay.value = new Date(createTourState.to_date)
        .toISOString()
        .slice(0, 10);
      diemden.value = createTourState.to_where;
      description.value = createTourState.description;
      createTourState.image = data.image;
      uploadImage.innerText = null;
      uploadImage.style.backgroundImage = `url('${createTourState.image}')`;
      const marker = L.marker([createTourState.lat, createTourState.lon], {
        draggable: true,
      }).addTo(map);
      map.flyTo([createTourState.lat, createTourState.lon], 10);
      marker.on("dragend", (e) => { });
    });
}

btnCreateTrip.onclick = (e) => {
  e.preventDefault();
  var keyupEvent = new Event('keyup');
  controlLists.forEach((control) => {
    control.dispatchEvent(keyupEvent);
  })
  if (valid) {
    if (updateTour) {
      fetch(`http://127.0.0.1:8000/api/personal/tour/update/${updateTour}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createTourState,
          owner_id: Number(login.user_info.user_profile[0].user_id)
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            createToast("success", "Success: Cập nhật thành công");
            localStorage.removeItem("tourIdUpdate");
          }
        });
    } else {
      fetch("http://127.0.0.1:8000/api/personal/tour/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createTourState,
          owner_id: Number(login.user_info.user_profile[0].user_id),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          createToast("success");
          setTimeout(() => {
            window.location.reload(true);
          }, 5000);
        })
        .catch((error) => {
          createToast("error");
        });
    }
  }
};


if (!login) {
  btnCreateTrip.disabled = true;
} else {
  btnCreateTrip.enabled = true;
}


tungay.onchange = (e) => {
  console.log(e.target.value);
  const a = new Date(e.target.value)
  console.log(a);
}