const displayProfileBtn = document.getElementById("profile-btn");
const displayPostsBtn = document.getElementById("posts-btn");
const displayTicketsBtn = document.getElementById("tickets-btn");
const displayEditProfileBtn = document.getElementById("edit-profile-btn");
const displayChangePasswordBtn = document.getElementById("change-password-btn");
const userInfoSection = document.getElementById("user-info");
const welcomeMessage = document.getElementById("welcome-title");
const loaderContainer = document.getElementById("loader-container");
let userPosts = {};
let tickets = [];
const options = { day: "2-digit", month: "short", year: "numeric" };
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z _-]{3,20}$/;

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  preventDuplicates: true,
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "slideDown",
  hideMethod: "slideUp",
};
let userData = {
  img: jwt_decode(sessionStorage.getItem("userData")).profile_image,
  name: jwt_decode(sessionStorage.getItem("userData")).name,
  email: jwt_decode(sessionStorage.getItem("userData")).email,
  phone: jwt_decode(sessionStorage.getItem("userData")).phone || " ",
  country: jwt_decode(sessionStorage.getItem("userData")).address || " ",
};
function clearAnimation(input) {
  input.addEventListener("animationend", function () {
    input.classList.remove(
      "animate__animated",
      "animate__headShake",
      "animate__faster"
    );
  });
}
showSection("user-info");
welcomeMessage.insertAdjacentText(
  "beforeend",
  `${userData.name.split(" ").slice(0, 1).join(" ")}`
);
function renderUserCard() {
  userInfoSection.innerHTML = "";
  const userCard = ` 
 <h3 class="text-warning text-center fw-bold fs-2 mb-1 animate__animated animate__fadeInDown animate__delay-3s">
          Personal Info</h3>
        <div class="d-flex flex-column-reverse">
          <div>
            <span class="text-white d-block fs-6 mb-2">Name: <span class="text-white-50 text-capitalize text-truncate">${
              userData.name
            }</span></span>
            <span class="text-white d-block fs-6 mb-2">Email: <span class="text-white-50">${
              userData.email
            }</span></span>
            <span class="text-white d-block fs-6 mb-2">Phone: <span class="text-white-50">${
              userData.phone ? userData.phone : " "
            }</span></span>
            <span class="text-white d-block fs-6 ">Country: <span class="text-white-50 text-capitalize text-truncate">${
              userData.country ? userData.country : " "
            }</span></span>
          </div>
          <div><img src="${
            userData.img || "images/boy.png"
          }" onerror="src='images/image-not-found.png'" alt="Profile" class="profile-img" id="display-img"></div>

        </div>`;
  userInfoSection.insertAdjacentHTML("beforeend", userCard);
}
renderUserCard();

//! Function to render ticket cards
function renderTickets() {
  const ticketsContainer = document.getElementById("ticketsContainer");
  ticketsContainer.innerHTML = "";
  if (tickets.length === 0) {
    document.getElementById("emptyBookings").classList.remove("d-none");
    return;
  } else {
    document.getElementById("emptyBookings").classList.add("d-none");

    tickets.forEach((ticket, index) => {
      let statusClass = "";
      if (ticket.trip.trip_status.toLowerCase() === "completed") {
        statusClass = "status-confirmed";
      } else if (ticket.trip.trip_status.toLowerCase() === "pending") {
        statusClass = "status-pending";
      }
      const date = new Date(ticket.trip.trip_date);

      // Create ticket card
      const ticketCard = `
      <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp animate__delay-1s" >
        <div class="ticket-card">
          <h3 class="card-title"><i class="fas fa-ticket-alt ticket-icon"></i>Booking #${
            ticket.booking_id
          }</h3>
         
          <p class="card-text"><i class="fa-solid fa-ticket text-warning me-2"></i><strong>TRP#</strong>  ${
            ticket.trip.trip_id
          }</p>
          <p class="card-text"><i class="fas fa-calendar-alt ticket-icon"></i><strong>Date:</strong> ${date.toLocaleDateString(
            "en-US",
            options
          )}</p>
          <p class="card-text"><i class="fas fa-money-bill-wave ticket-icon"></i><strong>Price per Person:</strong> EGP ${
            ticket.trip.offers
          }</p>
          <p class="card-text"><i class="fas fa-users ticket-icon"></i><strong>Number of People:</strong> ${
            ticket.number_of_people
          }</p>
          <p class="card-text"><i class="fas fa-wallet ticket-icon"></i><strong>Total Price:</strong> EGP ${
            ticket.total_price
          }</p>
          <p class="card-text"><i class="fas fa-info-circle ticket-icon"></i><strong>Status:</strong> 
            <span class="status ${statusClass} text-capitalize">${
        ticket.trip.trip_status
      }</span>
          </p>
        </div>
      </div>
    `;
      ticketsContainer.insertAdjacentHTML("beforeend", ticketCard);
    });
  }
}

function showSection(sectionId) {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("active");
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");
  document
    .querySelector(`.nav-buttons button.${sectionId}`)
    .classList.add("active");
}

//! Function to render posts
function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";
  if (userPosts.stories.length === 0) {
    document.getElementById("emptyPosts").classList.remove("d-none");
  } else {
    document.getElementById("emptyPosts").classList.add("d-none");
    userPosts.stories.forEach((post, index) => {
      const imagesHtml = post.images
        .map(
          (img) =>
            `<img src="${img}" class="post-image" alt="Post Image" onerror="this.src='images/image-not-found.png'">`
        )
        .join("");
      // const date = new Date(post.date);

      // Create post card
      const postCard = `
        <div class="col-12 ">
          <div class="post-card">
            <div class="post-header">
              <img src="${
                jwt_decode(sessionStorage.getItem("userData")).profile_image ||
                "images/boy.png"
              }" class="user-img" alt="${userPosts.name}">
              <div>
                <h3 class="post-title">${userPosts.name}</h3>
                <p class="post-meta ">
                 <span class="${
                   userPosts.address ? "" : "d-none"
                 }"> <i class="fas fa-map-marker-alt post-icon"></i>${
        userPosts.address
      } | </span>
                  <i class="fas fa-calendar-alt post-icon"></i>${formatDate(
                    post.date
                  )}
                </p>
              </div>
            </div>
            <p class="post-description">${post.description}</p>
            <div class="post-images">${imagesHtml}</div>
            <button class="remove-btn ms-auto" onclick="removePost(${post.id})">
              <i class="fas fa-trash-alt"></i> Remove Post
            </button>
          </div>
        </div>
      `;
      postsContainer.insertAdjacentHTML("beforeend", postCard);
    });
  }
}

//! Function to remove a post
function removePost(postId) {
  async function removePost() {
    try {
      const response = await fetch(
        `https://pharaohslegacy.cloud/api/stories/delete_story/ ${postId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(data);
      toastr.success(`${data.message}`);
      userPosts.stories = userPosts.stories.filter(
        (post) => post.id !== postId
      );
      renderPosts();
    } catch (error) {
      console.error(error);
    }
  }
  removePost();
}

function renderUserData(
  profileImgInput,
  editNameInput,
  editEmailInput,
  editPhoneInput
) {
  profileImgInput.FileList = userData.img;
  editNameInput.value = userData.name;
  editEmailInput.value = userData.email;
  editPhoneInput.value = userData.phone;
}

displayProfileBtn.addEventListener("click", function (e) {
  showSection("user-info");
  renderUserCard();
});
displayPostsBtn.addEventListener("click", function (e) {
  showSection("posts");
  async function fetchPosts() {
    try {
      loaderContainer.classList.remove("d-none");
      const response = await fetch(
        `https://pharaohslegacy.cloud/api/stories/user-stories/${
          jwt_decode(sessionStorage.getItem("userData")).id
        }`,
        {
          method: "GET",
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      userPosts = data;
      renderPosts();
    } catch (error) {
      console.error(error);
    } finally {
      loaderContainer.classList.add("d-none");
    }
  }
  fetchPosts();
});
displayTicketsBtn.addEventListener("click", function (e) {
  showSection("tickets");
  async function fetchTickets() {
    try {
      loaderContainer.classList.remove("d-none");
      const response = await fetch(
        `https://pharaohslegacy.cloud/api/bookings/${
          jwt_decode(sessionStorage.getItem("userData")).id
        }`,
        {
          method: "GET",
        }
      );
      // renderTickets();
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      tickets = data;
      renderTickets();
    } catch (error) {
      console.error(error);
    } finally {
      loaderContainer.classList.add("d-none");
    }
  }
  fetchTickets();
});

//! to display edit profile button
displayEditProfileBtn.addEventListener("click", function (e) {
  showSection("edit-profile");
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const maxSize = 2 * 1024 * 1024;

  const SaveEditProfileChangesBtn = document.querySelector(".update-data-btn");
  const sendCodeBtn = document.querySelector(".send-code-btn");
  const editNameMessage = document.querySelector(".cont-name-message");
  const editNameInputMessage = document.getElementById("name-message");
  let editNameInput = document.getElementById("name");
  // const editEmailMessage = document.querySelector(".cont-email-message");
  // const editEmailInputMessage = document.getElementById("email-message");
  let editEmailInput = document.getElementById("email");
  const editPhoneMessage = document.querySelector(".cont-phone-message");
  const editPhoneInputMessage = document.getElementById("phone-message");
  let editPhoneInput = document.getElementById("phone");
  const editPasswordMessage = document.querySelector(".cont-password-message");
  const editPasswordInputMessage = document.getElementById("password-message");
  let editPasswordInput = document.getElementById("Password");
  let profileImgInput = document.getElementById("profile-img");
  const imageMessage = document.getElementById("image-message");
  const imageMessageContainer = document.querySelector(".cont-image-message");
  //* number validation
  const iti = window.intlTelInput(editPhoneInput, {
    initialCountry: "eg",
    countrySearch: true,
    fixDropdownWidth: true,
    separateDialCode: true,
    useFullscreenPopup: false,
    customPlaceholder: (selectedCountryPlaceholder) =>
      selectedCountryPlaceholder,
    loadUtils: () => import("./intlTelInputWithUtils.min.js"),
  });
  editEmailInput.readOnly = true;
  //! display error message on input
  const displayError = function (container, input, inputMessage, message) {
    container.classList.replace("d-none", "d-flex");
    input.classList.add("is-invalid");
    inputMessage.textContent = `${message}`;
  };
  //! Hide error message on input
  const hideError = function (container, input, inputMessage) {
    // input.classList.replace("is-invalid", "is-valid");
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    container.classList.replace("d-flex", "d-none");
    inputMessage.textContent = "";
  };
  function resetForm() {
    editNameInput.value = "";
    editEmailInput.value = "";
    editPasswordInput.value = "";
    editPhoneInput.value = "";
    profileImgInput.value = "";
    iti.setNumber("");
    editNameInput.classList.remove("is-valid");
    editEmailInput.classList.remove("is-valid");
    editPasswordInput.classList.remove("is-valid");
    editPhoneInput.classList.remove("is-valid");
    profileImgInput.classList.remove("is-valid");
    editNameInput.classList.remove("is-invalid");
    editEmailInput.classList.remove("is-invalid");
    editPasswordInput.classList.remove("is-invalid");
    editPhoneInput.classList.remove("is-invalid");
    profileImgInput.classList.remove("is-invalid");
    sendCodeBtn.classList.replace("d-none", "d-block");
    SaveEditProfileChangesBtn.classList.replace("d-block", "d-none");
    hideError(editPasswordMessage, editPasswordInput, editPasswordInputMessage);
    hideError(editPhoneMessage, editPhoneInput, editPhoneInputMessage);
    hideError(editNameMessage, editNameInput, editNameInputMessage);
    hideError(imageMessageContainer, profileImgInput, imageMessage);
  }

  resetForm();

  renderUserData(
    profileImgInput,
    editNameInput,
    editEmailInput,
    editPhoneInput
  );
  editNameInput.classList.remove("is-valid");
  editPasswordInput.classList.remove("is-valid");
  editPhoneInput.classList.remove("is-valid");
  profileImgInput.classList.remove("is-valid");

  // Validate on file change
  profileImgInput.addEventListener("change", function () {
    const file = this.files[0];
    imageMessage.textContent = "";
    imageMessageContainer.classList.add("d-none");

    if (!file) {
      hideError(imageMessageContainer, profileImgInput, imageMessage);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      displayError(
        imageMessageContainer,
        profileImgInput,
        imageMessage,
        "Only JPG, PNG, JPEG, or WebP images are allowed."
      );
      return;
    }

    if (file.size > maxSize) {
      displayError(
        imageMessageContainer,
        profileImgInput,
        imageMessage,
        "Image size must be less than 2MB."
      );
      return;
    }

    hideError(imageMessageContainer, profileImgInput, imageMessage);
    profileImgInput.classList.add("is-valid");
  });

  // name input validation
  editNameInput.addEventListener("input", function () {
    if (!nameRegex.test(editNameInput.value)) {
      displayError(
        editNameMessage,
        editNameInput,
        editNameInputMessage,
        "name must be between 3->20 & chars only"
      );
    } else {
      hideError(editNameMessage, editNameInput, editNameInputMessage);
    }
  });
  //phone input validation
  editPhoneInput.addEventListener("input", function () {
    if (!iti.isValidNumber()) {
      displayError(
        editPhoneMessage,
        editPhoneInput,
        editPhoneInputMessage,
        "Please enter a valid Phone number"
      );
    } else {
      hideError(editPhoneMessage, editPhoneInput, editPhoneInputMessage);
    }
  });

  //edit password input
  editPasswordInput.addEventListener("input", function () {
    if (editPasswordInput.value.length !== 6) {
      displayError(
        editPasswordMessage,
        editPasswordInput,
        editPasswordInputMessage,
        "code must be 6 digits only"
      );
    } else {
      hideError(
        editPasswordMessage,
        editPasswordInput,
        editPasswordInputMessage
      );
    }
  });

  //! send code button
  sendCodeBtn.addEventListener("click", async function () {
    const button = this;
    button.disabled = true;
  
    try {
      const response = await fetch("https://pharaohslegacy.cloud/api/sendUpdateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editEmailInput.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        
        SaveEditProfileChangesBtn.classList.replace("d-none", "d-block");
        button.classList.add("d-none");
        toastr.success("Check your inbox for the verification code");
      }
    } catch (error) {
      console.log(error);
    } finally {
      button.disabled = false;
    }
  });
  

  //! save changes button
  SaveEditProfileChangesBtn.addEventListener("click", function () {
    const file = profileImgInput.files[0];
    const hasImage = profileImgInput.files.length !== 0;
    const isImageSizeValid = hasImage ? file.size <= maxSize : true;
    const isImageTypeValid = hasImage ? allowedTypes.includes(file.type) : true;

    if (hasImage && !isImageSizeValid) {
      displayError(
        imageMessageContainer,
        profileImgInput,
        imageMessage,
        "Image size must be less than 2MB."
      );
      profileImgInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      profileImgInput.focus();
      clearAnimation(profileImgInput);
    } else if (hasImage && !isImageTypeValid) {
      displayError(
        imageMessageContainer,
        profileImgInput,
        imageMessage,
        "Only JPG, PNG, JPEG, or WebP images are allowed."
      );
      profileImgInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      profileImgInput.focus();
      clearAnimation(profileImgInput);
    } else if (editNameInput.value === "") {
      displayError(
        editNameMessage,
        editNameInput,
        editNameInputMessage,
        "Name is required"
      );
      editNameInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      editNameInput.focus();
      clearAnimation(editNameInput);
    } else if (editPhoneInput.value === "") {
      displayError(
        editPhoneMessage,
        editPhoneInput,
        editPhoneInputMessage,
        "Phone is required"
      );
      editPhoneInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      editPhoneInput.focus();
      clearAnimation(editPhoneInput);
    } else if (editPasswordInput.value === "") {
      displayError(
        editPasswordMessage,
        editPasswordInput,
        editPasswordInputMessage,
        "Code is required"
      );
      editPasswordInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      editPasswordInput.focus();
      clearAnimation(editPasswordInput);
    } else if (
      editNameInput.value !== "" &&
      editEmailInput.value !== "" &&
      editPasswordInput.value !== "" &&
      editPhoneInput.value !== "" &&
      emailRegex.test(editEmailInput.value) &&
      nameRegex.test(editNameInput.value) &&
      editPasswordInput.value.length >= 6 &&
      iti.isValidNumber() &&
      isImageSizeValid &&
      isImageTypeValid
    ) {
      async function updateInfo() {
        try {
          SaveEditProfileChangesBtn.querySelector(
            "span.spin"
          ).classList.replace("d-none", "d-block");
          SaveEditProfileChangesBtn.querySelector("span.text").classList.add(
            "d-none"
          );
          SaveEditProfileChangesBtn.setAttribute("disabled", "true");

          const formData = new FormData();
          formData.append("name", editNameInput.value);
          formData.append("email", editEmailInput.value);
          formData.append("phone", editPhoneInput.value);
          formData.append("code", editPasswordInput.value);
          formData.append("address", iti.getSelectedCountryData().name);

          if (hasImage && profileImgInput.files[0]) {
            formData.append("profile_image", profileImgInput.files[0]);
          }

          const response = await fetch("https://pharaohslegacy.cloud/api/confirmUpdate",
            {
              method: "POST",
              body: formData,
            }
          );

          // Check if response is JSON
          // const contentType = response.headers.get("content-type");
          // if (!contentType || !contentType.includes("application/json")) {
          //   const text = await response.text();
          //   console.error("Non-JSON response:", text);
          //   toastr.error("Server returned an unexpected response.");
          //   return;
          // }
      
          if (!response.ok) {
            if (response.status === 401 || response.status === 400) {
            const data = await response.json();

              toastr.error(`${data.error}`);
              return;
              // throw new Error(`${data.error}`);
            }
          }  if (response.status == 200 ) {
            const data = await response.json();

            toastr.success(`${data.message}`);
            console.log(data);
            

            sessionStorage.setItem("userData", data.token);

            userData = {
              img: jwt_decode(sessionStorage.getItem("userData")).profile_image,
              name: jwt_decode(sessionStorage.getItem("userData")).name,
              email: jwt_decode(sessionStorage.getItem("userData")).email,
              phone: jwt_decode(sessionStorage.getItem("userData")).phone,
              country: jwt_decode(sessionStorage.getItem("userData")).address,
            };
            resetForm();

            renderUserData(
              profileImgInput,
              editNameInput,
              editEmailInput,
              editPhoneInput
            );
            editNameInput.classList.remove("is-valid");
            editEmailInput.classList.remove("is-valid");
            editPasswordInput.classList.remove("is-valid");
            editPhoneInput.classList.remove("is-valid");
            profileImgInput.classList.remove("is-valid");
            renderUserCard();
          }
        } catch (error) {
          console.error(error);
        } finally {
          SaveEditProfileChangesBtn.querySelector(
            "span.spin"
          ).classList.replace("d-block", "d-none");
          SaveEditProfileChangesBtn.querySelector("span.text").classList.remove(
            "d-none"
          );
          SaveEditProfileChangesBtn.removeAttribute("disabled");
        }
      }

      updateInfo();
    }
  });
});

//! to display change password button
displayChangePasswordBtn.addEventListener("click", function (e) {
  showSection("password");
  const submitChangePassword = document.querySelector(
    ".submit-change-pass-btn"
  );
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  const passwordErrorMessage = document.querySelector(
    ".password-error-message"
  );
  const newPasswordErrorMessage = document.querySelector(
    ".new-password-error-message"
  );
  const confirmPasswordErrorMessage = document.querySelector(
    ".confirm-password-error-message"
  );

  function resetForm() {
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    currentPasswordInput.classList.remove("is-invalid");
    newPasswordInput.classList.remove("is-invalid");
    confirmPasswordInput.classList.remove("is-invalid");
    currentPasswordInput.classList.remove("is-valid");
    newPasswordInput.classList.remove("is-valid");
    confirmPasswordInput.classList.remove("is-valid");
    passwordErrorMessage.innerHTML = "";
    newPasswordErrorMessage.innerHTML = "";
    confirmPasswordErrorMessage.innerHTML = "";
  }

  resetForm();
  currentPasswordInput.addEventListener("input", function () {
    if (this.value.length < 8) {
      passwordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> password must be at least 8';
      this.classList.add("is-invalid");
    } else {
      passwordErrorMessage.textContent = "";
      this.classList.replace("is-invalid", "is-valid");
    }
  });
  newPasswordInput.addEventListener("input", function () {
    if (this.value.length < 8) {
      newPasswordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> password must be at least 8';
      this.classList.add("is-invalid");
    } else if (newPasswordInput.value === confirmPasswordInput.value) {
      newPasswordErrorMessage.textContent = "";
      confirmPasswordErrorMessage.textContent = "";
      this.classList.replace("is-invalid", "is-valid");
      confirmPasswordInput.classList.replace("is-invalid", "is-valid");
    } else {
      newPasswordErrorMessage.textContent = "";
      this.classList.replace("is-invalid", "is-valid");
    }
  });
  confirmPasswordInput.addEventListener("input", function () {
    if (this.value.length < 8) {
      confirmPasswordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> Confirm password must be at least 8';
      this.classList.add("is-invalid");
    } else if (this.value !== newPasswordInput.value) {
      confirmPasswordErrorMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> confirm password doesn't match password`;
      this.classList.add("is-invalid");
    } else {
      confirmPasswordErrorMessage.textContent = "";
      this.classList.replace("is-invalid", "is-valid");
    }
  });

  submitChangePassword.addEventListener("click", function () {
    if (currentPasswordInput.value.length === 0) {
      passwordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> Old password is required';
      currentPasswordInput.classList.add("is-invalid");
      currentPasswordInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      currentPasswordInput.focus();
      clearAnimation(currentPasswordInput);
    } else if (newPasswordInput.value.length === 0) {
      newPasswordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> New password is required';
      newPasswordInput.classList.add("is-invalid");
      newPasswordInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      newPasswordInput.focus();
      clearAnimation(newPasswordInput);
    } else if (confirmPasswordInput.value.length === 0) {
      confirmPasswordErrorMessage.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> New password is required';
      confirmPasswordInput.classList.add("is-invalid");
      confirmPasswordInput.classList.add(
        "animate__animated",
        "animate__headShake",
        "animate__faster"
      );
      confirmPasswordInput.focus();
      clearAnimation(confirmPasswordInput);
    } else if (
      currentPasswordInput.value !== "" &&
      newPasswordInput.value !== "" &&
      confirmPasswordInput.value !== "" &&
      currentPasswordInput.value.length >= 8 &&
      newPasswordInput.value.length >= 8 &&
      confirmPasswordInput.value.length >= 8 &&
      newPasswordInput.value === confirmPasswordInput.value
    ) {
      async function updatePassword(oldPassword, newPassword, confirmPassword) {
        try {
          submitChangePassword
            .querySelector("span.spin")
            .classList.replace("d-none", "d-block");
          submitChangePassword
            .querySelector("span.text")
            .classList.add("d-none");
          submitChangePassword.setAttribute("disabled", "true");
          const response = await fetch(
            "https://pharaohslegacy.cloud/api/auth/updatePassword",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("userData")}`,
              },
              body: JSON.stringify({
                current_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
              }),
            }
          );
          const data = await response.json();
          if (!response.ok) {
            if (response.status === 401) {
              toastr.error(`${data.error}`);
            } else if (response.status === 400) {
              toastr.error(`${data.message}`);
            } else if (response.status === 500) {
              toastr.error(`${data.error}`);
            }
          }

          if (response.status === 200 && data.message === "successful") {
            toastr.success(`${data.message}`);
            resetForm();
          }
        } catch (error) {
          console.log(error);
        } finally {
          submitChangePassword
            .querySelector("span.spin")
            .classList.replace("d-block", "d-none");
          submitChangePassword
            .querySelector("span.text")
            .classList.remove("d-none");
          submitChangePassword.removeAttribute("disabled");
        }
      }
      updatePassword(
        currentPasswordInput.value,
        newPasswordInput.value,
        confirmPasswordInput.value
      );
    }
  });
});
