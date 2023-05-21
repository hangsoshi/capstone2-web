const ss = document.querySelector.bind(document);
var sliderFind = ss(".list-tour");
const login = JSON.parse(window.localStorage.getItem("login"));
console.log(login);
const api = "http://127.0.0.1:8000/api/ts/tour/all/" + login.user_info.user_profile[0].id;
var i = 0;
let htmls = "";
function getTours(api) {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tours = data.all_tour;
            console.log(tours);
            const statusTour = 'Đang đi';
            htmls = tours.map((tour, index) => {
                return `
        <tr class="list-residence">
                        <td class="list-content list-info data-id="${index}">
                            <div class="list-info-img">
                                <img src="" alt="">
                            </div>
                            <div class="list-info-content">
                                <h3>${tour.name}</h3>
                                <span>
                                    <i class="fa-solid fa-location-dot"></i>
                                    <p>Nơi khởi hành:${tour.address}</p>
                                </span>
                                <span>
                                    <i class="fa-solid fa-street-view"></i>
                                    <p>Số lượng người: ${tour.slot} </p>
                                </span>
                                <span>
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <p>Giá tiền: ${tour.price}/người</p>
                                </span>
                            </div>
                        </td>
                        <td class="list-content list-date">
                            <p>${tour.from_date}</p>
                        </td>
                        <td class="list-content list-jojned">
                            <p>100</p>
                        </td>
                        <td class="list-content list-jojned status-green">
                            <button>${statusTour}</button>
                        </td>
                        <td class="list-content list-action">
                            <div class="" style="display: flex; align-items: center; justify-content: center; text-align: center;">
                                <a href="./TS-postTour.html">
                                    <i class="fa-solid fa-pencil"></i>
                                </a>
                                <!-- <i class="fa-solid fa-trash-can"></i> -->
                                <a href="#modal-opened" class="link-1 click-closed" id="modal-closed"><i class="fa-solid fa-trash-can" data-id="${tour.id}" onclick="handleDelete(${tour.id})"></i></a>
                            </div>
                        </td>
                    </tr>
      `;
            });
            sliderFind.innerHTML = htmls.join("") + ` <div class="modal-container" id="modal-opened" data-id="${1}">
               <div class="modal">

                   <div class="modal__details">
                       <h1 class="modal__title">Xác nhận xóa</h1>
                       <p class="modal__description">Bạn có thật sự muốn xóa hay không ?</p>
                   </div>

                   <div class="modal-button">
                       <button class="modal__btn">No</button>
                       <button class="modal__btn" onclick="handleSuccessDelete()">Yes</button>
                   </div>

                   <a href="#modal-closed" class="link-2"></a>

               </div>
           </div>`;
            // return htmls;
        })
}

if (login) {
    getTours(api);
}

const closeModalConfirmDelete = document.querySelector(".click-closed");
console.log(closeModalConfirmDelete);
let idDelete = null;
function handleDelete(id) {
    idDelete = id;
}
function handleSuccessDelete() {
    fetch("http://127.0.0.1:8000/api/ts/tour/delete/" + idDelete + "?ts_id=" + `${login.user_info.user_profile[0].id}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            createToast('success');
            setTimeout(() => {
                getTours(api);
            })
        })
}

// -=-------------------- message toast ----------------------------
const notifications = document.querySelector(".notifications"),
    buttons = document.querySelectorAll(".buttons .btn");
// Object containing details for different types of toasts
const toastDetails = {
    timer: 5000,
    success: {
        icon: "fa-circle-check",
        text: "Success: Delete tour success...",
    },
    error: {
        icon: "fa-circle-xmark",
        text: "Error: Delete tour error....",
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


const valueSearchTour = document.querySelector("#search");

valueSearchTour.onkeyup = (e) => {
    console.log(e.target.value);
    setTimeout(() => {
        fetch("http://127.0.0.1:8000/api/ts/tour/search?name=" + e.target.value)
            .then(res => res.json())
            .then(data => {
                console.log(data.tours)
                getSearchTours("http://127.0.0.1:8000/api/ts/tour/search?name=" + e.target.value);
            })
            .catch(error => {
                console.log(error);
            })
    }, 1.5)
}

function getSearchTours(api) {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tours = data.tours;
            console.log(tours);
            const statusTour = 'Đang đi';
            htmls = tours.map((tour, index) => {
                return `
        <tr class="list-residence">
                        <td class="list-content list-info data-id="${index}">
                            <div class="list-info-img">
                                <img src="" alt="">
                            </div>
                            <div class="list-info-content">
                                <h3>${tour.name}</h3>
                                <span>
                                    <i class="fa-solid fa-location-dot"></i>
                                    <p>Nơi khởi hành:${tour.address}</p>
                                </span>
                                <span>
                                    <i class="fa-solid fa-street-view"></i>
                                    <p>Số lượng người: ${tour.slot} </p>
                                </span>
                                <span>
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <p>Giá tiền: ${tour.price}/người</p>
                                </span>
                            </div>
                        </td>
                        <td class="list-content list-date">
                            <p>${tour.from_date}</p>
                        </td>
                        <td class="list-content list-jojned">
                            <p>100</p>
                        </td>
                        <td class="list-content list-jojned status-green">
                            <button>${statusTour}</button>
                        </td>
                        <td class="list-content list-action">
                            <div class="" style="display: flex; align-items: center; justify-content: center; text-align: center;">
                                <a href="./TS-postTour.html">
                                    <i class="fa-solid fa-pencil"></i>
                                </a>
                                <!-- <i class="fa-solid fa-trash-can"></i> -->
                                <a href="#modal-opened" class="link-1 click-closed" id="modal-closed"><i class="fa-solid fa-trash-can" data-id="${tour.id}" onclick="handleDelete(${tour.id})"></i></a>
                            </div>
                        </td>
                    </tr>
      `;
            });
            sliderFind.innerHTML = htmls.join("") + ` <div class="modal-container" id="modal-opened" data-id="${1}">
               <div class="modal">

                   <div class="modal__details">
                       <h1 class="modal__title">Xác nhận xóa</h1>
                       <p class="modal__description">Bạn có thật sự muốn xóa hay không ?</p>
                   </div>

                   <div class="modal-button">
                       <button class="modal__btn">No</button>
                       <button class="modal__btn" onclick="handleSuccessDelete()">Yes</button>
                   </div>

                   <a href="#modal-closed" class="link-2"></a>

               </div>
           </div>`;
            // return htmls;
        })
}