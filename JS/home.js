// ---------------------------------------

const slickPre = document.getElementsByClassName(" fa-chevron-left");
const slickNext = document.getElementsByClassName(" fa-chevron-right");
const findSlickPrev = document.getElementsByClassName(" find-slick-left");
const findSlickNext = document.getElementsByClassName(" find-slick-right");

const pre1 = document.getElementsByClassName(" slick-prev");
const next1 = document.getElementsByClassName(" slick-next");

// ---------------------------------------------------

// const ss = document.querySelector.bind(document);
var sliderFind = document.getElementsByClassName("slides");
const api = "http://127.0.0.1:8000/api/ts/tour";

let htmls = "";
function getTours() {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const tours = data;
      htmls = tours.map((tour) => {
        return `
          <div class="find-container" data-id="${tour.id}" style="cursor: pointer">
                <div class="find-container-top">
                    <img src="../IMAGES/slides/slide-5.png" alt="">
                </div>
                <div class="find-container-bottom">
                    <h4 class="find-bottom-name">${tour.name}</h4>
                    <div class="find-bottom-address">
                        <div class="find-bottom-icon">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <p>${tour.address}</p>
                    </div>
                    <div class="find-bottom-time">
                        <div class="find-bottom-icon">
                            <i class="fa-solid fa-calendar-days"></i>
                        </div>
                        <p>${tour.from_date} - ${tour.to_date}</p>
                    </div>
                </div>
            </div>
      `;
      });
      sliderFind[0].innerHTML = htmls.join("");
      $(".slides").slick({
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
      });
      findSlickPrev[0].onclick = () => {
        pre1[0].click();
      };
      findSlickNext[0].onclick = () => {
        next1[0].click();
      };

      const findContainers = document.querySelectorAll(".find-container");
      findContainers.forEach((item) => {
        item.onclick = () => {
          const id = item.dataset.id;
          localStorage.setItem("page-detail", id);
          location.href = "detailFind.html";
        };
      });
    });
}

getTours();

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
