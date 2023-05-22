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
            <img src="../IMAGES/slides/slide-0.png" alt="">
        </div>
        <div class="detail-img-right">
            <div class="detail-img-right-top">
                <img src="../IMAGES/slides/slide-0.png" alt="">
                <img src="../IMAGES/slides/slide-0.png" alt="">
            </div>
            <div class="detail-img-right-bottom">
                <img src="../IMAGES/slides/slide-0.png" alt="">
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
  `;
  //   console.log(htmls);
  return (htmlPersonTour.innerHTML = htmls);
}

fetch("http://127.0.0.1:8000/api/ts/tour/" + pageDetail)
  .then((res) => res.json())
  .then((data) => {
    console.log(data.data);
    window.localStorage.setItem("data", JSON.stringify(data));
    const dataa = window.localStorage.getItem("data");
    RenderTourDetail(data.data);
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
  console.log(login.user_info.user_profile[0].user_id);
  window.location.href = "http://localhost:3000/payment.html";
}
