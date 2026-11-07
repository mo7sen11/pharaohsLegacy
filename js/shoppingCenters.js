
const centersList = document.getElementById("centersList");
const nameFilter = document.getElementById("nameFilter");
const cityFilter = document.getElementById("cityFilter");
const main = document.querySelector("main");
const searchSection = document.querySelector(".filter-section");
const loaderContainer = document.getElementById("loader-container");
let shoppingCenters = [];
let userFavorites = [];
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
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  hideMethod: "slideUp",
  showMethod: "slideDown",
};

function displayCenters(centersToDisplay) {
  centersList.innerHTML = "";

  if (centersToDisplay.length === 0) {
    centersList.innerHTML = `
                        <div class="col-12 text-center py-5 mx-auto">
                            <i class="fa-solid fa-store fa-4x mb-3" style="color: var(--main-yellow);"></i>
                            <h3> No Shopping Centers Found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    `;
    return;
  }

  centersToDisplay.forEach((center, index) => {
    const rating = Number(center.reviews_avg_rating_value ?? 0);
    const starsHtml = generateStars(rating);
    const imagePath = center.item.image_path || "images/image-not-found.png";
    const isFavorite = userFavorites.some(
      (el) => el.item.Item_ID == center.Item_ID
    );

    const centerCard = `<div class="col-12 col-md-6 col-lg-4 col-xl-4">
                      <div class="card center-card animate__animated animate__fadeInUp">
                          <div class="center-img">
                          <img 
              src="${imagePath}" 
              alt="${center.item.name}" 
              class="img-fluid" 
              loading="lazy"
              onerror="this.src='images/image-not-found.png'"
            ></div>
                          <div class="card-body">
                              <h3 class="center-name text-warning text-truncate text-capitalize">${
                                center.item.name
                              }</h3>
                              <div class="text-muted mb-2 ">
                              <p class="m-0 text-capitalize text-truncate "><i class="fas fa-map-marker-alt me-1 text-warning"></i> ${
                                center.item.city
                              }</p>

                              </div>
                              <div class="rating-stars">
                                  ${starsHtml}
                                  <span class="ms-1">${rating.toFixed(
                                    1
                                  )}</span><span class="text-white-50"> (${formatReviewersNumber(
      center.reviews_count
    )})</span>
                              </div>
                              <p class="card-text">${
                                center.item.description
                              }</p>
                              <div class="card-actions">
              <button class="btn btn-favorite ${
                isFavorite ? "d-none" : ""
              }" data-id="${center.Item_ID}">
                <span class="d-none add-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="add-text"><i class="far fa-heart me-2"></i>Add to Favorites</span>
              </button>
              <button class="btn btn-remove-favorite  ${
                isFavorite ? "" : "d-none"
              }" data-id="${center.Item_ID}">
              <span class="d-none remove-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="remove-text"><i class="fa-solid fa-trash-can me-2"></i>Remove from Favorites</span>
              </button>
              <button class="btn btn-details" data-id="${center.id}">
                Explore <i class="fas fa-arrow-right"></i>
              </button>
            </div>
                          </div>
                      </div>
                  </div>`;
    centersList.insertAdjacentHTML("beforeend", centerCard);
  });
}

//! go to top observer
goToTobObserver.observe(searchSection);

//! actions buttons
main.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".btn-favorite");
  const removeBtn = e.target.closest(".btn-remove-favorite");
  const detailsBtn = e.target.closest(".btn-details");

  const isUser =
    sessionStorage.getItem("userType") === "user" &&
    sessionStorage.getItem("isLoggedIn") === "true" &&
    sessionStorage.getItem("userData");

  if (favBtn) {
    if (!isUser) return (authModal.style.display = "block");
    addToFavorites(favBtn, favBtn.dataset.id);
  } else if (removeBtn) {
    if (!isUser) return (authModal.style.display = "block");
    removeFromFavorites(removeBtn, removeBtn.dataset.id);
  } else if (detailsBtn) {
    const queryString = new URLSearchParams({
      id: detailsBtn.dataset.id,
    }).toString();
    window.location.href = `shoppingCenterDetails.html?${queryString}`;
  }
});

//! fetch api
async function fetchShoppingCenters() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/shoping_center/Display_all_item"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    shoppingCenters = data.data;

    if (sessionStorage.getItem("userData")) {
      await getUserFavorites();
    }
    displayCenters(shoppingCenters);
  } catch (error) {
    console.log(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}

function filterCenters() {
  const nameValue = nameFilter.value.toLowerCase();
  const cityValue = cityFilter.value.toLowerCase();

  const filteredCenters = shoppingCenters.filter((center) => {
    const nameMatch = center.item.name.toLowerCase().includes(nameValue);
    const cityMatch =
      cityValue === "" ||
      center.item.city.split(" ").join("").toLowerCase() === cityValue;
    return nameMatch && cityMatch;
  });

  displayCenters(filteredCenters);
}

nameFilter.addEventListener("input", filterCenters);
cityFilter.addEventListener("change", filterCenters);

fetchShoppingCenters();

//! add to favorite function
async function addToFavorites(button, centerId) {
  try {
    button.querySelector(".add-spin")?.classList.replace("d-none", "d-block");
    button.querySelector(".add-text")?.classList.add("d-none");
    button.setAttribute("disabled", "true");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Add_favorites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: jwt_decode(sessionStorage.getItem("userData")).id,
          item_id: centerId,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        toastr.warning("This item is already in your favorites.");
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    toastr.success(`${data.message}`);
    button.classList.remove("d-block");
    button.classList.add("d-none");
    button
      .closest(".card-actions")
      .querySelector(".btn-remove-favorite")
      .classList.replace("d-none", "d-block");
  } catch (error) {
    // console.error(error.message);
  } finally {
    button.querySelector(".add-spin")?.classList.replace("d-block", "d-none");
    button.querySelector(".add-text")?.classList.remove("d-none");
    button.removeAttribute("disabled");
  }
}
//! remove from favorite function

async function removeFromFavorites(button, centerId) {
  try {
    button
      .querySelector(".remove-spin")
      ?.classList.replace("d-none", "d-block");
    button.querySelector(".remove-text")?.classList.add("d-none");
    button.setAttribute("disabled", "true");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Delete_an_favorites/${centerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: jwt_decode(sessionStorage.getItem("userData")).id,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        toastr.warning("Item not found in favorites");
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    toastr.error(`${data.message}`);
    button.classList.remove("d-block");
    button.classList.add("d-none");
    button
      .closest(".card-actions")
      .querySelector(".btn-favorite")
      .classList.replace("d-none", "d-block");
  } catch (error) {
  } finally {
    button
      .querySelector(".remove-spin")
      ?.classList.replace("d-block", "d-none");
    button.querySelector(".remove-text")?.classList.remove("d-none");
    button.removeAttribute("disabled");
  }
}

//! get user favorites
async function getUserFavorites() {
  try {
    loaderContainer?.classList.remove("d-none");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/favorites/user/${
        jwt_decode(sessionStorage.getItem("userData")).id
      }`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    userFavorites = data.favorites;
  } catch (error) {
    console.log(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}
