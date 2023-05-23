// // ----- my trip----------
new Swiper(".blog-slider", {
  effect: "fade",
});
//   // ---------------------------

//   // ------------ slide 1 --------------

// $(".slides2").slick({
//   infinite: true,
//   slidesToShow: 3,
//   slidesToScroll: 1,
//   speed: 800,
// });

const y = document.querySelector.bind(document);

var slickPre = document.getElementsByClassName("fa-chevron-left");
var slickNext = document.getElementsByClassName("fa-chevron-right");
var findSlickPrev = document.getElementsByClassName(".prev1");
var findSlickNext = document.getElementsByClassName(".next1");
var pre = document.getElementsByClassName("slick-prev");
var next = document.getElementsByClassName("slick-next");


slickPre[0].onclick = () => {
  pre[0].click();
};

slickNext[0].onclick = () => {
  next[0].click();
};

//   // ------------ slide 2 --------------

//   // ---------- chuyển qua trang detail Tour------------
const findContainer = document.querySelectorAll(".find-container");
findContainer.forEach((value) => {
  value.onclick = function () {
    location.href = "http://localhost:3000/detailTour.html";
  };
});

//   // --------- ẩn hiện thông báo----------
const ss = document.querySelector.bind(document);
var sliderFind = ss(".book-places");
const api = "http://127.0.0.1:8000/api/ts/tour";

let htmls = "";

const idPage = 0;
function tranFormPage(idPage) {
  const listTourDetail = JSON.parse(window.localStorage.getItem("dataTSTour"));
  window.localStorage.setItem("detail-tour", idPage);
  window.location.href = "http://localhost:3000/detailTour.html";
}

// -------------------------- slide3 người dùng tạo tour (render and slides) ----------------------------------------------

const slickPrev = document.querySelector(".ps-prev");
const slickNextt = document.querySelector(".ps-next");
const findSlickPrevv = document.getElementsByClassName("find-slick-left");
const findSlickNextt = document.getElementsByClassName("find-slick-right");

const pre1 = document.getElementsByClassName("slick-prev");
const next1 = document.getElementsByClassName("slick-next");
var renderListTourUser = document.getElementsByClassName("popular-slides");
let htmlss = "";
const dataTSTour = window.localStorage.getItem("dataTSTour");

const searchTour = JSON.parse(localStorage.getItem("search-tour"));

const renderTSTour = (tours) => {
  htmls = tours.map((tour) => {
    return `
      <div class="find-container data-id='${tour.id}'" onclick="tranFormPage(${tour.id})">
      <div class="find-container-top">
          <img src="../IMAGES/slides/slide-0.png" alt="">
      </div>
      <div class="find-container-bottom">
          <h4 class="find-bottom-name">${tour.name}</h4>
          <div class="find-bottom-address">
              <div class="find-bottom-icon">
                  <i class="fa-solid fa-location-dot"></i>
              </div>
              <p class="text-places"><b>Nơi khởi hành: </b>${tour.address}</p>
          </div>
          <div class="find-bottom-money">
              <h2>${tour.price}đ</h2>
          </div>
          <div class="find-bottom-seats">
              <p><b>Số chỗ còn: </b>${tour.slot}</p>
          </div>
      </div>
  </div>
    `;
  });
  sliderFind.innerHTML = htmls.join("");
  if (sliderFind.innerHTML) {
    $(".slides2").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 800,
    });
    slickPre.onclick = () => {
      pre.click();
    };

    slickNext.onclick = () => {
      next.click();
    };
  }
};

const renderPSTour = (tours) => {
  let htmlss = tours.map((tour) => {
    return `
    <div>
      <div class="popular-container">
        <div class="popular-container-left">
            <img src="../IMAGES/slides/slide-0.png" alt="">
            <div class="popular-container-host">
                <p><b>Host:</b> ${tour.owner_name}</p>
            </div>
        </div>
        <div class="popular-container-center">
            <h1 class="ps-tour-name" data-id="${tour.id}">${tour.name}</h1>
            <p><b>Thành viên:</b> ${tour.members}</p>
            <p><b>Từ:</b> ${tour.from_where} - <b>Đến:</b> ${tour.to_where}</p>
            <p><b>Ngày xuất phát:</b> ${tour.from_date}</p>
        </div>
        <div class="popular-container-right">
            <button class="btn" id="btn1">JOIN</button>
        </div>
    </div>
</div>      
    `;
  });
  renderListTourUser[0].innerHTML = htmlss.join("");
  const tourNames = document.querySelectorAll(".ps-tour-name");
  tourNames.forEach((item) => {
    item.onclick = (e) => {
      const id = e.target.dataset.id;
      localStorage.setItem("page-detail", id);
      window.location.href = "http://localhost:3000/detailFind.html";
    };
  });
};

if (searchTour) {
  const psTour = searchTour.filter((item) => item.type_tour === "ps");
  const tsTour = searchTour.filter((item) => item.type_tour === "ts");
  console.log(tsTour);
  renderPSTour(psTour);
  renderTSTour(tsTour);
  localStorage.removeItem("search-tour");
} else {
  function getTourUser() {
    const apiTourUser = "http://127.0.0.1:8000/api/personal/tour";
    fetch(apiTourUser)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const PStours = data.data;
        renderPSTour(PStours);
      });
  }
  getTourUser();

  function getTours(api) {
    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const tours = data;
        const tourDetails = document.querySelectorAll(
          ".book-tour-places .find-container"
        );
        tourDetails.forEach((tourr) => {
          tourr.onclick = (e) => {
            console.log(e);
            localStorage.setItem("detailTourId", e);
            // window.location.href = 'http://localhost:3000/detailTour.html'
          };
        });
        window.localStorage.setItem("dataTSTour", JSON.stringify(data));
        renderTSTour(tours);
      });
  }
  getTours(api);
}
