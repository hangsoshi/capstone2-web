// ---------------------------------------

const slickPre = document.getElementsByClassName(" fa-chevron-left");
const slickNext = document.getElementsByClassName(" fa-chevron-right");
const findSlickPrev = document.getElementsByClassName(" find-slick-left");
const findSlickNext = document.getElementsByClassName(" find-slick-right");

const pre1 = document.getElementsByClassName(" slick-prev");
const next1 = document.getElementsByClassName(" slick-next");
localStorage.removeItem("search-tour");

// ---------------------------------------------------

// const ss = document.querySelector.bind(document);
const locationSearching = document.querySelectorAll(".location-searching");
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
      htmls = tours
        .map((tour) => ({ ...tour, type: "ts" }))
        .map((tour) => {
          console.log(tour);
          return `
          <div class="find-container" data-type="${tour.type}" data-id="${tour.id}" style="cursor: pointer">
                <div class="find-container-top">
                    <img src=${tour.images[1].image_url}>
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
          const type = item.dataset.type;
          if (type === "ts") {
            // localStorage.setItem("page-detail", id);
            localStorage.setItem("detail-tour", id);
            // location.href = "detailFind.html";
            location.href = "detailTour.html";
          }
        };
      });
    });
}

getTours();

locationSearching.forEach((loca) => {
  loca.addEventListener("click", () => {
    const value = loca.dataset.value;
    fetch(`http://localhost:8000/api/search?place=${value}`)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("search-tour", JSON.stringify(data));
        location.href = "bookTour.html";
      });
  });
});
