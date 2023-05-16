const headerNavForm = document.querySelector(".header-nav-form");
const headerForm = document.querySelector(".header-form");
const headerFormLogin = headerNavForm.querySelector(".header-form-login");
const headerFormLogout = document.querySelector(".header-form-logout");
const login = JSON.parse(window.localStorage.getItem("login"));

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

if (!login) {
  headerFormLogin.style.display = "block";
  headerFormLogout.style.display = "none";
} else {
  headerFormLogout.style.display = "block";
  headerFormLogin.style.display = "none";
}
const names = $("#header-name1");
const avatarUser = $("#avatar_user");

headerNavForm.onclick = function () {
  if (headerForm.style.display === "none") {
    headerForm.style.display = "block";
  } else {
    headerForm.style.display = "none";
  }
};
if (login.status === 200) {
  names.innerText = login.user_info.name;
  avatarUser.src = login.user_info.user_profile[0].avatar;
}
if (login.status === 200) {
  names.innerText = login.user_info.name;
  avatarUser.src = login.user_info.user_profile[0].avatar;
} else {
  names.innerText = login.user_info.name;
  avatarUser.src = login.user_info.user_profile[0].avatar;
}

const logout = $('.form-logout');
logout.onclick = () => {
  alert('Bạn chắc chắn muốn thoát ?')
  window.localStorage.clear();
  window.location.reload(true);
  window.location.href = 'http://localhost:3000/home.html';
}




// --------------------------------------------------------------------

const btn_payment = $(".btn-payment");
const price = JSON.parse(window.localStorage.getItem("priceTour"));
const pageDetail = window.localStorage.getItem("detail-tour");
const apiPayment = "http://127.0.0.1:8000/api/payment";

const inputPrice = $(".price");
const inputAmount = $(".amount");
const inputDesc = $(".order_desc");
const inputUserID = $(".user_id");
const inputTourID = $(".tour_id");

inputPrice.value = price;
inputUserID.value = login.user_info.user_profile[0].user_id;
inputTourID.value = pageDetail;




// btn_payment.onclick = () => {
//   fetch(apiPayment,{
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     // body: JSON.stringify({
//     //   price: Number(price),
//     //   amount: Number(inputAmount.value),
//     //   order_desc: inputDesc.value,
//     //   user_id: login.user_info.user_profile[0].user_id,
//     //   tour_id: Number(pageDetail),
//     // }),
//     // data: {
//     //   price: Number(price),
//     //   amount: Number(inputAmount.value),
//     //   order_desc: inputDesc.value,
//     //   user_id: login.user_info.user_profile[0].user_id,
//     //   tour_id: Number(pageDetail),
//     // },
//   })
//   .then((res)=>{ return res.json();})
//   .then((data)=>{console.log(data);})
//   .catch((error)=>{console.log(error);})
// }