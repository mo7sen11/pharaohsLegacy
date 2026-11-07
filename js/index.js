
sessionStorage.setItem("userCity", "");
if (!sessionStorage.getItem("isLoggedIn")) {
  sessionStorage.setItem("userType", "guest");
  sessionStorage.setItem("isLoggedIn", "false");
}





const header = document.getElementById("home");
const sections = document.querySelectorAll(".section");
const exploreBtn = document.querySelector(".explore-btn");
const allCategories = document.querySelector(".categories");
const main = document.querySelector("main");
const images = document.querySelectorAll(".slider img");
const trendingRow = document.getElementById("trendingRow");
const recommendedRow = document.getElementById("recommendedRow");
const slider = document.querySelector(".slider");
// const defaultBtn=document.querySelector('.button-default');

// const loaderContainer = document.getElementById("loader-container");
let landmarks = [];
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

//! Render landmarks cards
function renderLandmarks(landmarkList, container) {
  container.innerHTML = "";

  if (landmarkList.length === 0) {
    container.innerHTML =
      `<div class="col-12 text-center py-5"><h3>No Landmarks Founded In Your Current Location</h3></div>
      <button onclick="goToDefaultCity()" class="button-default w-auto border-0 rounded-5  border-warning  d-block mx-auto px-3 py-2 bg-warning fw-bold fst-italic ">Use Default</button>
      `;
    return;
  }

  landmarkList.forEach((landmark, index) => {
    const rating = Number(landmark.reviews_avg_rating_value ?? 0);
    const starsHtml = generateStars(rating);
    const imagePath = landmark.item.image_path || "images/image-not-found.png";
    const isFavorite = userFavorites.some(
      (el) => el.item.Item_ID == landmark.Item_ID
    );

    const landmarkCard = `
      <div class="col-md-6 col-lg-4 animate__animated animate__fadeIn">
        <div class="landmark-card">
          <div class="landmark-img">
            <img 
              src="${imagePath}" 
              alt="${landmark.item.name}" 
              class="img-fluid" 
              loading="lazy"
              onerror="this.src='images/image-not-found.png'"
            >
            <div class="landmark-type px-2 rounded-5 fst-italic text-truncate text-capitalize">
              ${landmark.type}
            </div>
          </div>
          <div class="landmark-info p-3">
            <h3 class="landmark-name text-yellow text-truncate text-capitalize">
              ${landmark.item.name}
            </h3>
            <p class="landmark-location text-truncate text-capitalize">
              <i class="fas fa-map-marker-alt me-2 text-warning"></i>${
                landmark.item.city
              }
            </p>
            <div class="landmark-rating mb-3">
              <div class="rating-wrapper">
                <div class="stars text-warning">${starsHtml}</div>
                <span class="rating-value">${rating.toFixed(1)}</span>
                <span class="rating-count">(${formatReviewersNumber(
                  landmark.reviews_count
                )})</span>
              </div>
            </div>
            <p class="landmark-desc">${landmark.item.description}</p>
            <div class="card-actions">
              <button class="btn btn-favorite ${
                isFavorite ? "d-none" : ""
              }" data-id="${landmark.Item_ID}">
                <span class="d-none add-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="add-text"><i class="far fa-heart me-2"></i>Add to Favorites</span>
              </button>
              <button class="btn btn-remove-favorite  ${
                isFavorite ? "" : "d-none"
              }" data-id="${landmark.Item_ID}">
              <span class="d-none remove-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="remove-text"><i class="fa-solid fa-trash-can me-2"></i>Remove from Favorites</span>
              </button>
              <button class="btn btn-details" data-id="${landmark.id}">
                Explore <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;

    container.insertAdjacentHTML("beforeend", landmarkCard);
  });
}
//! go to default city
function goToDefaultCity() {
  sessionStorage.removeItem("userCity");
  filterByCity(landmarks, "cairo");
}
//! sections observer
const sectionsObserverCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    if (entry.isIntersecting) {
      entry.target.classList.remove("hidden-section");
      entry.target.classList.add(
        "animate__slideInUp",
        "animate__animated",
        "animate__slow"
      );
      observer.unobserve(entry.target);
    }
  });
};
const sectionsObserverOptions = {
  root: null,
  threshold: 0.1,
};

const sectionsObserver = new IntersectionObserver(
  sectionsObserverCallback,
  sectionsObserverOptions
);
sections.forEach((section) => {
  sectionsObserver.observe(section);
});

// //! explore button
exploreBtn.addEventListener("click", function () {
  document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
});

//! categories buttons

allCategories.addEventListener("click", function (e) {
  if (!e.target.closest(".category")?.querySelector("h5")) return;
  window.location.href = `${
    e.target.closest(".category").querySelector("h5").dataset.categoryname
  }.html`;
});

//! slider
let currentIndex = 0;
function showNextImage() {
  // Hide the current image
  const currentImage = images[currentIndex];
  currentImage.classList.remove("active", "animate__slideInRight");
  currentImage.classList.add("animate__slideOutLeft");
  // Move to the next image
  currentIndex = (currentIndex + 1) % images.length;
  const nextImage = images[currentIndex];
  // Show the next image
  nextImage.classList.remove("animate__slideOutLeft");
  nextImage.classList.add("active", "animate__slideInRight");
}
images[currentIndex].classList.add("active", "animate__slideInRight");
let intervalId;

function startSlider() {
  intervalId = setInterval(showNextImage, 8000);
}

function stopSlider() {
  clearInterval(intervalId);
}
startSlider();

slider.addEventListener("mouseenter", stopSlider);
slider.addEventListener("mouseleave", startSlider);

//! go to top observer
goToTobObserver.observe(header);

//! action buttons
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
    window.location.href = `landmarkDetails.html?${queryString}`;
  }
});

//! fetch api
async function fetchLandmarks() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/Landmark/Display_all_item"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    landmarks = data.data;
    if (sessionStorage.getItem("userData")) {
      await getUserFavorites();
    }
    filterLandmarks(landmarks);
    //! geolocation
    if (sessionStorage.getItem("userCity")) {
      filterByCity(landmarks, sessionStorage.getItem("userCity"));
    } else {
      function handleUserInteraction() {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            console.log(position.coords.latitude, position.coords.longitude);

            let request_url = `https://api.opencagedata.com/geocode/v1/json?key=c6e0f9abbd25481282b699144572c70d&q=${encodeURIComponent(
              position.coords.latitude + "," + position.coords.longitude
            )}&pretty=1&no_annotations=1`;

            fetch(request_url)
              .then((response) => response.json())
              .then((data) => {
                const userCity = data.results[0].components.state;
                sessionStorage.setItem("userCity", userCity);
                console.log(data.results[0]);

                filterByCity(landmarks, userCity);
              })
              .catch((error) => {
                filterByCity(landmarks, "cairo");
              })
              .finally(() => {});
          },
          (err) => {
            filterByCity(landmarks, "cairo");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
        window.removeEventListener("click", handleUserInteraction);
        window.removeEventListener("scroll", handleUserInteraction);
      }

      window.addEventListener("click", handleUserInteraction);
      window.addEventListener("scroll", handleUserInteraction);
    }
  } catch (error) {
    console.log(error);
  } finally {
    // loaderContainer.classList.add("d-none");
  }
}

//! filter trending
function filterLandmarks(landmarksList) {
  const filtered = landmarksList
    .filter((landmark) => landmark.reviews_avg_rating_value >= 4.5)
    .slice(0, 6);
  renderLandmarks(filtered, trendingRow);
}
//! filter by city recommended
function filterByCity(landmarksList, city) {
  const filtered = landmarksList
    .filter(
      (landmark) => landmark.item.city.toLowerCase() === city.toLowerCase()
    )
    .slice(0, 6);

  renderLandmarks(filtered, recommendedRow);
}
//!initial fetch
fetchLandmarks();

//! add to favorite function
async function addToFavorites(button, landmarkId) {
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
          item_id: landmarkId,
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

async function removeFromFavorites(button, landmarkId) {
  try {
    button
      .querySelector(".remove-spin")
      ?.classList.replace("d-none", "d-block");
    button.querySelector(".remove-text")?.classList.add("d-none");
    button.setAttribute("disabled", "true");

    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Delete_an_favorites/${landmarkId}`,
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
    // loaderContainer.classList.remove("d-none");

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
    // loaderContainer.classList.add("d-none");
  }
}
