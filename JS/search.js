const searchState = {
  place: "",
  fromDate: "",
  toDate: "",
  slot: "",
};
const searchLocation = document.querySelector(".search-location");
const searchFromDate = document.querySelector(".search-from-date");
const searchToDate = document.querySelector(".search-to-date");
const searchMember = document.querySelector(".search-member");
const searchSubmit = document.querySelector(".search-submit");

searchLocation.onblur = (e) => {
  if (specialValidate(e.target.value)) {
    e.target.value = "";
    const error = document.querySelector(".search-location-error");
    error.innerText = "Địa điểm không hợp lệ";
    return;
  }
  searchState.place = e.target.value;
};

searchFromDate.onblur = (e) => {
  if (searchState.toDate) {
    const error = document.querySelector(".search-from-date-error");
    const errorTo = document.querySelector(".search-to-date-error");
    if (dateValidate(e.target.value, searchState.toDate)) {
      error.innerText = "Ngày không hợp lệ";
      e.target.value = null;
      return;
    } else {
      error.innerText = "";
      errorTo.innerText = "";
    }
  }
  searchState.fromDate = e.target.value;
};

searchToDate.onblur = (e) => {
  if (searchState.fromDate) {
    const error = document.querySelector(".search-to-date-error");
    const errorFrom = document.querySelector(".search-from-date-error");
    if (dateValidate(searchState.fromDate, e.target.value)) {
      error.innerText = "Ngày không hợp lệ";
      e.target.value = null;
      return;
    } else {
      error.innerText = "";
      errorFrom.innerText = "";
    }
  }
  searchState.toDate = e.target.value;
};

searchMember.onblur = (e) => {
  if (e.target.value < 0) {
    e.target.value = 0;
  }
  searchState.slot = Number(e.target.value);
};

searchSubmit.onclick = () => {
  const querystring = Object.keys(searchState)
    .map((item) => `${item}=${searchState[item]}`)
    .join("&");
  fetch(`http://localhost:8000/api/search?${querystring}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("search-tour", JSON.stringify(data));
      location.href = "bookTour.html";
    });
};

const specialValidate = (string) => {
  const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return regex.test(string);
};

const dateValidate = (date1, date2) => {
  const converted1 = new Date(date1).getTime();
  const converted2 = new Date(date2).getTime();
  return converted1 > converted2;
};
