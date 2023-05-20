const login = JSON.parse(window.localStorage.getItem("login"));
const $ = document.querySelector.bind(document);

const listTour = $(".list-tour");
console.log(listTour);

let html = "";
function renderListTourBooked() {
    fetch("http://127.0.0.1:8000/api/ts/tour/ordereds?ts_id=" + login.user_info.user_profile[0].id)
        .then(res => res.json())
        .then(data => {
            console.log(data[0])
            
            html = data[0].map((res) => {
                console.log(res.from_date);
                const a = new Date(res.from_date);
                const b = new Date(res.to_date);
                console.log(`${a.getDate()}-${a.getMonth()+1}-${a.getFullYear()}`);
                return `
            <tr class="list-residence">
                                    <td class="list-content list-name-tour">
                                        <p>${res.name_tour}</p>
                                    </td>
                                    <td class="list-content list-info">
                                        <p>${res.user_name}</p>
                                        <p>${res.gender}</p>
                                        <p>${res.email}</p>
                                        <p>${res.phone_number}</p>
                                    </td>
                                    <td class="list-content list-date list-date-from">
                                        <p class="p-date">${`${a.getDate()}-${a.getMonth()+1}-${a.getFullYear()}`}</p>
                                    </td>
                                    <td class="list-content list-date list-date-to">
                                        <p class="p-date-to">${`${b.getDate()}-${b.getMonth()+1}-${b.getFullYear()}`}</p>
                                    </td>
                                    <td class="list-content list-jojned">
                                        <p>${res.total_payment + 0}</p>
                                    </td>
                                    <td class="list-content list-jojned list-joined-number">
                                        <p class="p-jojned">${res.tickets}</p>
                                    </td>
                                    <td class="list-content list-action">
                                        <a class="icon-action" href="./TS-postTour.html">
                                            <i class="fa-solid fa-pencil"></i>
                                        </a>
                                        <i class="fa-solid fa-trash-can"></i>
                                    </td>
                                </tr>
            `;
            })
            listTour.innerHTML = html.join("");
        })
}

function start() {
    renderListTourBooked();
}

start();