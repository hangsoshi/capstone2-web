const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const headerNavForm = document.querySelector(".header-nav-form");
const headerForm = document.querySelector(".header-form");
const headerFormLogin = headerNavForm.querySelector(".header-form-login");
const headerFormLogout = document.querySelector(".header-form-logout");
const login = JSON.parse(window.localStorage.getItem("login"));

const destinationInput = $(".diemden");
const destinationSuggestList = $(".destination-location-suggestion");
const currentLocationInupt = $('.diemxuatphat')
const currentLocationSuggestList = $('.current-location-suggestion')


const createTourState = {
  name: "",
  owner_id: "",
  description: "",
  from_date: "",
  to_date: "",
  lat: "",
  lon: "",
  from_where: "",
  to_where: "",
  room_id: ""
}

const mapDOM = $("#form-map");
const map = L.map(mapDOM).setView([51.505, -0.09], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
  doms.forEach(item => {
    item.onclick = () => {
      const { lat, lon } = item.dataset
      // gán lat, lon cho biến bất kỳ để có thể ném vào trong call api create-tour, ví dụ: a = lat; b = lon
      const marker = L.marker([lat, lon], { draggable: true }).addTo(map)
      map.flyTo([lat, lon], 23)
      marker.on('dragend', (e) => {

      })
      parent.innerHTML = null
    }
  })
}

const handleCurrentLocationSuggestItemClick = (doms, parent) => {
  doms.forEach(item => {
    item.onclick = () => {
      const { lat, lon } = item.dataset
      const name = item.innerText
      console.log(name)
      // gán name của điểm xuất phát, ví dụ: a = name
      const marker = L.marker([lat, lon], { draggable: true }).addTo(map)
      map.flyTo([lat, lon], 10)
      marker.on('dragend', (e) => {

      })
      parent.innerHTML = null
    }
  })
}
let aborter = null
const searching = (value, listdom, itemclass, func) => {
  // if (aborter) {
  //   aborter.abort()
  // }
  aborter = new AbortController()
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
      const places = listPlace.map((place) => `<li data-lat="${place.lat}" data-lon="${place.lon}" class="destination-item"><p>${place.display_name}</p></li>`).join("");
      listdom.innerHTML = places;
      const itemdoms = listdom.querySelectorAll(`.${itemclass}`)
      func(itemdoms, listdom)
    })
    .catch(error => console.log(error))
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
  debounce(() => searching(e.target.value, destinationSuggestList, 'destination-item', handleDestinationSuggestItemClick), 0)();
};

currentLocationInupt.onkeydown = (e) => {
  debounce(() => searching(e.target.value, currentLocationSuggestList, 'destination-item', handleCurrentLocationSuggestItemClick), 0)()
}


// -----------------------------------------------------------


const logout = $('.form-logout');
logout.onclick = () => {
  alert('Bạn chắc chắn muốn thoát ?')
  window.localStorage.clear();
  window.location.reload(true);
  window.location.href = 'http://127.0.0.1:5500/CAPSTONE2/FrontEnd/HTML/home.html';
}


const names = $(".header-name1");
const avatarUser = $("#avatar_user");
if (login?.msg === "Đăng nhập thành công") {
  names.innerText = login?.user_info.name;
  avatarUser.src = login?.user_info.user_profile[0].avatar;
} else {
  names.innerText = login?.user_info.name;
  avatarUser.src = login?.user_info.user_profile[0].avatar;
}

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


// -----------------------------------------------------------

const tenchuyendi = $(".tenchuyendi");
const diemxuatphat = $(".diemxuatphat");
const diemden = $(".diemden");
const tungay = $(".tungay");
const denngay = $(".denngay");
const songuoi = $(".songuoi");
const kinhdo = $(".kinhdo");
const vido = $(".vido");
const motachuyendi = $(".description");
const apiTour = "http://127.0.0.1:8000/api/personal/tour/show/"
const htmlTour = document.querySelector(".form-trip");
console.log(htmlTour);

const TourIdUpdate = JSON.parse(window.localStorage.getItem("TourIdUpdate"))


function renderTourUpdate(vall) {
 tenchuyendi.value = vall.name;
 tungay.value = vall.from_date;
 denngay.value = vall.to_date;
 diemxuatphat.value = vall.from_where;
 diemden.value = vall.to_where;
 songuoi.value = vall.members;
 motachuyendi.value = vall.description;   
}
fetch("http://127.0.0.1:8000/api/personal/tour/show/" + TourIdUpdate)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    renderTourUpdate(data[0]);
  })

// ------------------------------------------------------------------
const btnUpdateTour = document.querySelector(".update-trip");
console.log(btnUpdateTour);

btnUpdateTour.onclick = () => {
  fetch()
}