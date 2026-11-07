const restaurantsList = document.getElementById("restaurantsList");
const nameFilter = document.getElementById("nameFilter");
const cityFilter = document.getElementById("cityFilter");
const main = document.querySelector("main");
const searchSection = document.querySelector(".filter-section");
const loaderContainer = document.getElementById("loader-container");

let restaurants = [];
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

function displayRestaurants(restaurantsToDisplay) {
  restaurantsList.innerHTML = "";

  if (restaurantsToDisplay.length === 0) {
    restaurantsList.innerHTML = `
                      <div class="col-12 text-center py-5 mx-auto">
                          <i class="fas fa-utensils fa-4x mb-3" style="color: var(--main-yellow);"></i>
                          <h3>No Restaurants Found</h3>
                          <p>Try adjusting your search criteria</p>
                      </div>
                  `;
    return;
  }

  restaurantsToDisplay.forEach((restaurant, index) => {
    const rating = Number(restaurant.reviews_avg_rating_value ?? 0);
    const starsHtml = generateStars(rating);
    const imagePath =
      restaurant.item.image_path || "images/image-not-found.png";
    const isFavorite = userFavorites.some(
      (el) => el.item.Item_ID == restaurant.Item_ID
    );
    restaurantsList.innerHTML += `<div class="col-12 col-md-6 col-lg-4 col-xl-4">
                    <div class="card restaurant-card animate__animated animate__fadeInUp">
                        <div class="hotel-img">
                         <img 
              src="${imagePath}" 
              alt="${restaurant.item.name}" 
             
              onerror="this.src='images/image-not-found.png'"
            >
                        </div>
                            
                        <div class="card-body">
                            <h5 class="card-title text-truncate text-capitalize">${
                              restaurant.item.name
                            }</h5>
                            <div class="cuisine-city text-muted">
                            <p class="m-0 text-capitalize text-truncate"><i class="fas fa-map-marker-alt me-1 text-warning"></i> ${
                              restaurant.item.city
                            }</p>
                                <p class="m-0 text-capitalize text-truncate"><i class="fas fa-utensils  text-truncate me-1 text-warning"></i> ${
                                  restaurant.cuisine_type
                                }</p>
                            </div>
                            <div class="rating-stars">
                                ${starsHtml}
                                <span class="ms-1">${rating.toFixed(
                                  1
                                )}</span><span class="text-white-50"> (${formatReviewersNumber(
      restaurant.reviews_count
    )})</span>
                            </div>
                            <p class="card-text">${
                              restaurant.item.description
                            }</p>
                            <div class="card-actions">
              <button class="btn btn-favorite ${
                isFavorite ? "d-none" : ""
              }" data-id="${restaurant.Item_ID}">
                <span class="d-none add-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="add-text"><i class="far fa-heart me-2"></i>Add to Favorites</span>
              </button>
              <button class="btn btn-remove-favorite  ${
                isFavorite ? "" : "d-none"
              }" data-id="${restaurant.Item_ID}">
              <span class="d-none remove-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="remove-text"><i class="fa-solid fa-trash-can me-2"></i>Remove from Favorites</span>
              </button>
              <button class="btn btn-details" data-id="${restaurant.id}">
                Explore <i class="fas fa-arrow-right"></i>
              </button>
            </div>
                        </div>
                    </div>
                </div>`;
  });
}
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
    window.location.href = `restaurantDetails.html?${queryString}`;
  }
});

//! go to top observer
goToTobObserver.observe(searchSection);

//! fetch api
async function fetchRestaurants() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/resturant/Display_all_item"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    restaurants = data.data;
    if (sessionStorage.getItem("userData")) {
      await getUserFavorites();
    }
    displayRestaurants(restaurants);
  } catch (error) {
    console.log(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}

function filterRestaurants() {
  const nameValue = nameFilter.value.toLowerCase();
  const cityValue = cityFilter.value.toLowerCase();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const nameMatch = restaurant.item.name.toLowerCase().includes(nameValue);
    const cityMatch =
      cityValue === "" ||
      restaurant.item.city.split(" ").join("").toLowerCase() === cityValue;
    return nameMatch && cityMatch;
  });

  displayRestaurants(filteredRestaurants);
}

nameFilter.addEventListener("input", filterRestaurants);
cityFilter.addEventListener("change", filterRestaurants);
fetchRestaurants();

//! add to favorite function
async function addToFavorites(button, restaurantId) {
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
          item_id: restaurantId,
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
async function removeFromFavorites(button, restaurantId) {
  try {
    button
      .querySelector(".remove-spin")
      ?.classList.replace("d-none", "d-block");
    button.querySelector(".remove-text")?.classList.add("d-none");
    button.setAttribute("disabled", "true");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Delete_an_favorites/${restaurantId}`,
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
