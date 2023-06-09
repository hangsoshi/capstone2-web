const userLoginId = localStorage.getItem("id");
(() => {
  const navbar = () => {
    return `<header class="header">
    <div class="container" style="background: rgb(0,0,0); background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,184,185,1) 100%); padding: 10px 0; position: fixed; width: 100%; z-index: 100">
        <a href="home.html" class="logo"> <img src="IMAGES/logo/logo-removebg-preview.png" alt=""> </a>
  
        <ul class="nav-menu">
            <li> <a href="home.html" class="nav-link">Trang chủ</a> </li>
            <li> <a href="bookTour.html" class="nav-link">Tours</a> </li>
            <li> <a href="createTrip.html" class="nav-link">Tạo chuyến đi</a> </li>
            <li> <a href="group.html" class="nav-link">Nhóm</a> </li>
            <li> <a href="TS-register.html" class="nav-link">Trở thành nhà cung cấp</a> </li>
            <li><i class="fa-solid fa-bell"></i>
                <div style="display: none;" class="container-notification">
                    <div class="wrap-notification">
                        <div class="header-notification">
                            <p>Thông báo</p>
                        </div>
                        <div class="content-notification">
                            <div style="display: none;" class="content-notification-empty">
                                <img src="https://static.boosty.to/assets/images/bell-light.gNKz9.svg" alt="">
                                <div class="empty-title">
                                    <h3>Chưa có thông báo nào</h3>
                                    <p>Tất cả thông báo sẽ có ở đây</p>
                                </div>
                            </div>
                            <div class="content-notication-show">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </li>
  
            <div class="header-nav-form">
                <div class="header-nav-icon">
                    <i class="fa-solid fa-user user-icon"></i>
                    <i class="fa-solid fa-bars"></i>
                </div>
                <div class="header-form">
                    <div class="header-form-login">
                        <ul>
                            <li><a href="login-register.html">Đăng nhập</a></li>
                            <li><a href="login-register.html">Đăng ký</a></li>
                        </ul>
                    </div>
                    <div class="header-form-logout">
                        <div class="content-logout">
                            <div href="profile.html" class="avatar-login" data-id="${userLoginId}">
                                <div class="header-form-avatar">
                                    <img src="" alt="" id="avatar_user">
                                    <div class="header-name">
                                        <span class="header-name1"></span>
                                        <p>Xem hồ sơ</p>
                                    </div>
                                </div>
                            </div>
                            <span class="drop-line"></span>
                            <div class="header-form-booked">
                                <i class="fa-sharp fa-solid fa-clock-rotate-left"></i>
                                <span>Chuyến đi của tôi</span>
                            </div>
                            <div class="header-form-loved">
                                <i class="fa-regular fa-heart"></i>
                                <span>Lịch sử chuyến đi</span>
                            </div>
                            <div class="form-logout">Đăng xuất</div>
                        </div>
                    </div>
                </div>
            </div>
        </ul>
    </div>
  </header>`;
  };

  const renderNav = document.getElementById("render-nav");
  renderNav.innerHTML = navbar();
  const userInfo = document.querySelector(".avatar-login");
  userInfo.addEventListener("click", () => {
    const id = userInfo.dataset.id;
    localStorage.setItem("target-profile-id", id);
    location.href = "profile.html";
  });

  const notificationContainer = document.querySelector(
    ".content-notication-show"
  );

  function verfiyJoinRoom(notiId, verify) {
    const childs = notificationContainer.querySelectorAll(".notification-item");
    for (const child of childs) {
      if (Number(child.dataset.notiid) === notiId) {
        notificationContainer.removeChild(child);
        break;
      }
    }
    socket.emit("verify-join-room", { id: notiId, value: verify });
  }

  const socket = io("http://localhost:3002/room", {
    auth: {
      token: localStorage.getItem("id"),
    },
  });

  socket.emit("load", localStorage.getItem("id"));
  socket.on("load", (data) => {
    notificationContainer.innerHTML += data
      .map((item) => {
        if (item.type === "verify") {
          const id = item.content.substring(
            item.content.indexOf("{") + 1,
            item.content.length - 1
          );
          return `
          <div class="notification-item" data-notiid="${id}">
            <div class="wrap-show-content">
              <div class="show-avatar">
                  <img src="IMAGES/slides/slide-1.jpg" alt="">
              </div>
              <div class="show-content">
                  <div class="show-content-top">
                      <p>${item.content.substring(
                        0,
                        item.content.indexOf("{")
                      )}</p>
                      <div class="show-content-top-btn">
                          <button data-verifyid="${id}" data-notiid="${
            item.id
          }" class="confirm">Xác nhận</button>
                          <button data-verifyid="${id}" data-notiid="${
            item.id
          } class="denied">Từ chối</button>
                      </div>
                  </div>
              </div>
            </div>
          </div>`;
        }
        if (item.type === "none") {
          return `
          <div class="notification-item-noaction" data-notiid="${item.id}">
              <div class="wrap-show-content">
              <div class="show-avatar">
                  <img src="IMAGES/slides/slide-1.jpg" alt="">
              </div>
              <div class="show-content">
                  <div class="show-content-top">
                      <p>${item.content}</p>
                  </div>
              </div>
            </div>
          </div>`;
        }
      })
      .join("");
    const acceptButtons =
      notificationContainer.querySelectorAll("button.confirm");
    const deniedButtons =
      notificationContainer.querySelectorAll("button.denied");
    const notificationNoActions = notificationContainer.querySelectorAll(
      ".notification-item-noaction"
    );

    acceptButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.verifyid;
        const noti = button.dataset.notiid;
        fetch(`http://localhost:3002/api/client/notifications`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noti,
            value: true,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
        verfiyJoinRoom(Number(id), true);
      });
    });
    deniedButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.verifyid;
        const noti = button.dataset.notiid;
        fetch(`http://localhost:3002/api/client/notifications`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noti,
            value: true,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
        verfiyJoinRoom(Number(id), false);
      });
    });
    notificationNoActions.forEach((item) => {
      item.addEventListener("click", () => {
        const noti = item.dataset.notiid;
        fetch(`http://localhost:3002/api/client/notifications`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noti,
            value: true,
          }),
        })
          .then((res) => res.json())
          .then((data) => notificationContainer.removeChild(item));
      });
    });
  });

  socket.on("verify-join-room", ({ message, room }) => {
    const notification = `<div class="wrap-show-content">
          <div class="show-avatar">
              <img src="IMAGES/slides/slide-1.jpg" alt="">
          </div>
          <div class="show-content">
              <div class="show-content-top">
                  <p>${message}<b> ${room}</b></p>
              </div>
          </div>
        </div>`;

    notificationContainer.innerHTML += notification;
  });

  socket.on("join-room", (data) => {
    console.log(data);
    const notification = `<div class="wrap-show-content">
        <div class="show-avatar">
            <img src="IMAGES/slides/slide-1.jpg" alt="">
        </div>
        <div class="show-content">
            <div class="show-content-top">
                <p><b>${data.who}</b> ${data.message}</p>
                <p class="show-content-top-time">2 giờ trước</p>
                <div class="show-content-top-btn">
                    <button class="confirm">Xác nhận</button>
                    <button class="denied">Từ chối</button>
                </div>
            </div>
        </div>
      </div>`;
    const html = document.createElement("div");
    html.classList.add("notification-item");
    html.dataset.notiid = data.verifyId;
    html.innerHTML = notification;
    const confirmButton = html.querySelector(".confirm");
    const deniedButton = html.querySelector(".denied");
    confirmButton.addEventListener("click", () => {
      verfiyJoinRoom(data.verifyId, true);
      fetch(`http://localhost:3002/api/client/notifications`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.notiid,
          value: true,
        }),
      });
    });
    deniedButton.addEventListener("click", () => {
      verfiyJoinRoom(data.verifyId, false);
      fetch(`http://localhost:3002/api/client/notifications`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.notiid,
          value: true,
        }),
      });
    });
    notificationContainer.appendChild(html);
  });

  const headerNavForm = document.querySelector(".header-nav-form");
  const headerForm = document.querySelector(".header-form");
  const headerFormLogin = headerNavForm.querySelector(".header-form-login");
  const headerFormLogout = document.querySelector(".header-form-logout");
  const login = JSON.parse(window.localStorage.getItem("login"));

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
  const names = document.getElementsByClassName(" header-name1");
  const avatarUser = document.getElementById("avatar_user");
  if (login) {
    names[0].innerText = login.user_info.name;
    avatarUser.src = login.user_info.user_profile[0].avatar;
  }

  const logout = document.getElementsByClassName("form-logout");
  logout[0].onclick = () => {
    alert("Bạn chắc chắn muốn thoát ?");
    window.localStorage.clear();
    window.location.reload(true);
    window.location.href = "http://localhost:3000/home.html";
  };

  // --------- ẩn hiện thông báo----------

  const faBell = document.querySelector(".fa-bell");
  const containerNotification = document.querySelector(
    ".container-notification"
  );

  faBell.onclick = function () {
    if (containerNotification.style.display === "none") {
      containerNotification.style.display = "block";
    } else {
      containerNotification.style.display = "none";
    }
  };
})();
