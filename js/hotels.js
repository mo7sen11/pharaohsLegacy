// Sample hotel data (unchanged)

const searchSection = document.querySelector(".search-section");
const main = document.querySelector("main");
const loaderContainer = document.getElementById("loader-container");



// Render hotel cards
let hotels = [];
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
function renderHotels(hotelsList) {
  const hotelsRow = document.getElementById("hotelsRow");
  hotelsRow.innerHTML = "";

  if (hotelsList.length === 0) {
    hotelsRow.innerHTML =
      '<div class="col-12 text-center py-5"><h3>No hotels found matching your criteria</h3></div>';
    return;
  }

  hotelsList.forEach((hotel) => {
    const rating = Number(hotel.reviews_avg_rating_value ?? 0);
    const starsHtml = generateStars(rating);
    const imagePath = hotel.item.image_path || "images/image-not-found.png";
    const isFavorite = userFavorites.some(
      (el) => el.item.Item_ID == hotel.Item_ID
    );

    const hotelCard = `
                <div class="col-md-6 col-lg-4 animate__animated animate__fadeIn">
                    <div class="hotel-card">
                        <div class="hotel-img">
                            <img 
              src="${imagePath}" 
              alt="${hotel.item.name}" 
              class="img-fluid" 
              loading="lazy"
              onerror="this.src='images/image-not-found.png'"
            >
                            <div class="hotel-type px-3 rounded-5">${
                              hotel.level
                            } ${hotel.level > 1 ? "stars" : "star"}</div>
                        </div>
                        <div class="hotel-info p-3">
                            <h3 class="hotel-name text-yellow text-truncate text-capitalize">${
                              hotel.item.name
                            }</h3>
                            <p class="hotel-location text-truncate text-capitalize"><i class="fas fa-map-marker-alt me-2 text-warning"></i>${
                              hotel.item.city
                            }</p>
                             <div class="hotel-rating mb-3">
                                <div class="rating-wrapper">
                                    <div class="stars">
                                        ${starsHtml}
                                    </div>
                                    <span class="rating-value">${rating.toFixed(
                                      1
                                    )}</span>
                                    <span class="rating-count">(${formatReviewersNumber(
                                      hotel.reviews_count
                                    )})</span>
                                </div>
                            </div>
                            <p class="hotel-desc">${hotel.item.description}</p>
                           
                           <div class="card-actions">
              <button class="btn btn-favorite ${
                isFavorite ? "d-none" : ""
              }" data-id="${hotel.Item_ID}">
                <span class="d-none add-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="add-text"><i class="far fa-heart me-2"></i>Add to Favorites</span>
              </button>
              <button class="btn btn-remove-favorite  ${
                isFavorite ? "" : "d-none"
              }" data-id="${hotel.Item_ID}">
              <span class="d-none remove-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="remove-text"><i class="fa-solid fa-trash-can me-2"></i>Remove from Favorites</span>
              </button>
              <button class="btn btn-details" data-id="${hotel.id}">
                Explore <i class="fas fa-arrow-right"></i>
              </button>
            </div>
                        </div>
                    </div>
                </div>
            `;

    hotelsRow.insertAdjacentHTML("beforeend", hotelCard);
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
    window.location.href = `hotelDetails.html?${queryString}`;
  }
});

//! fetch api
async function fetchHotels() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/hotel/Display_all_item"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    hotels = data.data;
    if (sessionStorage.getItem("userData")) {
      await getUserFavorites();
    }
    renderHotels(hotels);
  } catch (error) {
    console.error(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}

function filterHotels() {
  const nameQuery = document.getElementById("hotelName").value.toLowerCase();
  const cityFilter = document.getElementById("citySelect").value.toLowerCase();
  const typeFilter = document.getElementById("hotelType").value;

  const filteredHotels = hotels.filter((hotel) => {
    const nameMatch = hotel.item.name.toLowerCase().includes(nameQuery);
    const cityMatch =
      !cityFilter ||
      hotel.item.city.split(" ").join("").toLowerCase() === cityFilter;
    const typeMatch = !typeFilter || hotel.level.toString() === typeFilter;

    return nameMatch && cityMatch && typeMatch;
  });

  renderHotels(filteredHotels);
}
//! Real-time search functionality
document.querySelectorAll(".search-input").forEach((input) => {
  input.addEventListener("input", filterHotels);
});

//! initial display
fetchHotels();

//! add to favorite function
async function addToFavorites(button, hotelId) {
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
          item_id: hotelId,
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
    console.error(error.message);
  } finally {
    button.querySelector(".add-spin")?.classList.replace("d-block", "d-none");
    button.querySelector(".add-text")?.classList.remove("d-none");
    button.removeAttribute("disabled");
  }
}
//! remove from favorite function

async function removeFromFavorites(button, hotelId) {
  try {
    button
      .querySelector(".remove-spin")
      ?.classList.replace("d-none", "d-block");
    button.querySelector(".remove-text")?.classList.add("d-none");
    button.setAttribute("disabled", "true");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Delete_an_favorites/${hotelId}`,
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
