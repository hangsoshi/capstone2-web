const pageDetail = window.localStorage.getItem("detail-tour");

const apiPersonTourDetail = "http://127.0.0.1:8000/api/ts/tour/";
var htmlPersonTour = document.querySelector(".detail-tours-container");

function RenderTourDetail(obj) {
  const htmls = `
    <div class="detail-tour-image">
    <div class="detail-tour-header">
        <div class="detail-tour-title">
            <i class="fa-solid fa-location-dot"></i>
            <h1>${obj.name}</h1>
        </div>
        <div class="book-tour">
            <button onclick="handlePayment(${obj.price})">ĐẶT TOUR</button>
        </div>
    </div>
    <div class="detail-img">
        <div class="detail-img-left">
        </div>
        <div class="detail-img-right">
            <div class="detail-img-right-top" style="overflow: scroll">
            </div>
            <div class="detail-img-right-bottom" style="overflow: scroll">
            </div>
        </div>
    </div>
</div>

<div class="detail-tour-convenience" style="display: flex;">
    <ul class="list-conveniences" style="flex: 5">
        <div class="conveniences">
            <li>
                <i class="fa-regular fa-clock"></i>
                <span><b>Thời Gian : </b>${obj.from_date} - ${obj.to_date}</span>
            </li>
            <li>
                <i class="fa-solid fa-money-bill"></i>
                <span><b>Giá tiền : </b>${obj.price} VNĐ</span>
            </li>
        </div>
        <div class="conveniences">
            <li>
                <i class="fa-solid fa-location-dot"></i>
                <span><b>Địa điểm : </b>${obj.address}</span>
            </li>
            <li>
                <i class="fa-solid fa-person"></i>
                <span><b>Số chỗ còn lại : </b>${obj.slot} thành viên</span>
            </li>
        </div>
    </ul>
</div>

<div class="detail-tour-schedual">
  <div class="title-schedual">
    <h1>Lịch trình</h1>
    <h1>Lịch trình</h1>
  </div>
  <div class="detail-schedual-content">
  
  </div>
</div>
<div id="map" style="height: 500px; position: relative; z-index: 10"></div>
  `;
  //   console.log(htmls);
  return (htmlPersonTour.innerHTML = htmls);
}

fetch("http://127.0.0.1:8000/api/ts/tour/" + pageDetail)
  .then((res) => res.json())
  .then((data) => {
    window.localStorage.setItem("data", JSON.stringify(data));
    RenderTourDetail(data.data);
    const scheduleDOM = document.querySelector(".detail-schedual-content");
    const scheduleRender = data.data.schedule
      .map(
        (item, index) => `
    <div class="day-content" data-value="${item.id}">
            <p>
              <b>Ngày ${index + 1}: ${item.name}</b>
              <br />
              ${item.description}
            </p>
          </div>`
      )
      .join("");
    scheduleDOM.innerHTML = scheduleRender;
    const imageDOM = document.querySelector(".detail-img");
    const imageDOMLeft = imageDOM.querySelector(".detail-img-left");
    const imageDOMRightTop = imageDOM.querySelector(
      ".detail-img-right .detail-img-right-top"
    );
    const imageDOMRightBottom = imageDOM.querySelector(
      ".detail-img-right .detail-img-right-bottom"
    );
    const images = data.data.images;
    images.forEach((image, index) => {
      if (index === 0) {
        imageDOMLeft.innerHTML = `<img src=${image.image_url.replaceAll(
          '""',
          ""
        )}>`;
      }
      if (index % 2 === 0) {
        imageDOMRightTop.innerHTML += `<img src=${image.image_url.replaceAll(
          '""',
          ""
        )}>`;
      } else {
        imageDOMRightBottom.innerHTML += `<img src=${image.image_url.replaceAll(
          '""',
          ""
        )}>`;
      }
    });

    const schedules = data.data.schedule;
    const mapDOM = document.querySelector("#map");
    if (schedules.length > 0) {
      const map = L.map(mapDOM).setView(
        [data.data.schedule[0].lat, data.data.schedule[0].lon],
        5
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 10,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      schedules.forEach((item) => {
        L.marker([
          Number(item.lat.replaceAll(",", ".")),
          Number(item.lon.replaceAll(",", ".")),
        ]).addTo(map);
      });
      const polyline = L.polyline(
        schedules.reduce((prev, next) => {
          return [...prev, [next.lat, next.lon]];
        }, [])
      ).addTo(map);
      map.fitBounds(polyline.getBounds());
    } else {
      mapDOM.style.display = "none";
    }
  });
const dataa = window.localStorage.getItem("data");

$(".open").click(function () {
  var container = $(this).parents(".topic");
  var answer = container.find(".answer");
  var trigger = container.find(".faq-t");

  answer.slideToggle(200);

  if (trigger.hasClass("faq-o")) {
    trigger.removeClass("faq-o");
  } else {
    trigger.addClass("faq-o");
  }

  if (container.hasClass("expanded")) {
    container.removeClass("expanded");
  } else {
    container.addClass("expanded");
  }
});

function handlePayment(price) {
  console.log(price);
  window.localStorage.setItem("priceTour", price);
  console.log(pageDetail);
  // console.log(login.user_info.user_profile[0].user_id);
  window.location.href = "http://localhost:3000/payment.html";
}
