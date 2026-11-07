const searchSection = document.querySelector(".search-section");
const main = document.querySelector("main");
const cardsContainer = document.getElementById("cardsContainer");
const loaderContainer = document.getElementById("loader-container");
const nameFilter = document.getElementById("Name").value.toLowerCase();
  const categoryFilter = document.getElementById("categorySelect");
let cardsData = [];
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

// !Render trip cards
function renderCards(cardList) {
  console.log(cardList);
  
  cardsContainer.innerHTML = "";

  if (cardList.length === 0) {
    cardsContainer.innerHTML = `
      <div><h3 class="fs-1 text-center"> <i class="fa-solid fa-ban me-1 text-danger"></i> No Items founded</h3></div>`;
    return;
  } else if (cardsData.length === 0) {
    cardsContainer.innerHTML = `
      <div><h3 class="fs-1 text-center"> <i class="fa-solid fa-ban me-1 text-danger"></i> No Items founded</h3></div>`;
    return;
  }

  cardList.forEach((anItem) => {
    const rating = Number(anItem.rating_avg ?? 0);
    const starsHtml = generateStars(rating);
    const imagePath = anItem.item.image_path || "images/image-not-found.png";
     const TYPE = anItem.type;
     
     
    const itemCard = `
    <div class="card ${anItem.type} shadow mb-4">
      <div class="position-relative">
        <img src="${imagePath}" loading="lazy" class="card-img-top" alt="${
      anItem.item.name
    }" onerror="src='images/image-not-found.png'">
      
        ${
          anItem.type === "landmark"
            ? `<span class="landmark-type-badge text-warning rounded-5">${anItem.item.landmark.type}</span>`
            : ""
        }
        <span class="category-badge text-capitalize">${anItem.type == "shopping_center" ?'Shopping Center' : anItem.type}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title text-yellow text-truncate text-capitalize">${
          anItem.item.name
        }</h3>
        
        ${
          anItem.item.city
            ? `
        <p class="mb-2 card-location">
          <span class="card-city text-white-50 text-capitalize fw-semibold">
            <i class="fas fa-location-dot me-1 text-warning"></i>${anItem.item.city}
          </span>
        </p>`
            : ""
        }

        ${
          anItem.type === "restaurant"
            ? `
        <p class="mb-2 card-cuisine">
          <span class="card-city text-white-50 text-capitalize fw-semibold">
            <i class="fa-solid text-warning me-1 fa-utensils"></i>${anItem.item.restaurant.cuisine_type}
          </span>
        </p>`
            : ""
        }

       

        

        <p class="card-rating mb-2">
          ${starsHtml} <span class="text-warning">${rating.toFixed(
      1
    )}</span> <span class="text-white-50">(${formatReviewersNumber(
      anItem.reviews_count
    )})</span>
        </p>

        <p class="card-description text-white-50">${anItem.item.description}</p>

        <div class="card-actions">
          <button class="btn btn-delete" data-id="${
            anItem.item.Item_ID
          }"><i class="fas fa-trash me-2"></i>Remove From Favorites</button>
          <button  class="btn btn-details" onclick="window.location.assign('${
            anItem.type === "shopping_center" ? "shoppingCenter" : anItem.type
          }Details.html?${new URLSearchParams({
      id: anItem.item[TYPE]?.id,
    }).toString()}')" data-id="${
      anItem.item.Item_ID
    }">Explore <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `;

    cardsContainer.insertAdjacentHTML("beforeend", itemCard);
  });
}

//! go to top observer
goToTobObserver.observe(searchSection);

main.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".btn-delete");

  const isUser =
    sessionStorage.getItem("isLoggedIn") === "true" &&
    sessionStorage.getItem("userData");

  if (removeBtn && isUser) {
    removeFromFavorites(removeBtn, removeBtn.dataset.id);
  }
});

//! fetch api
async function fetchFavorites() {
  try {
    const response = await fetch(
      `https://pharaohslegacy.cloud/api/favorites/user/${
        jwt_decode(sessionStorage.getItem("userData")).id
      }`
    );
    if (!response.ok) {
      if (response.status === 404) {
        cardsContainer.innerHTML = `
        <div><h3 class="fs-1 text-center"> <i class="fa-solid fa-ban me-1 text-danger"></i> No Items founded</h3></div>`;
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cardsData = data.favorites;

    renderCards(cardsData);
  } catch (error) {
    console.log(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}
//! Real-time search functionality

function filterCards() {
  const nameFilter = document.getElementById("Name").value.toLowerCase();
  const categoryFilter = document.getElementById("categorySelect").value;

  const filteredCards = cardsData.filter((card) => {
    const nameMatch = card.item.name.toLowerCase().includes(nameFilter);
    const categoryMatch =!categoryFilter ||
      card.type === categoryFilter;
    return nameMatch && categoryMatch;
  });
  renderCards(filteredCards);
}
document.querySelectorAll(".search-input").forEach((input) => {
  input.addEventListener("input", filterCards);
});

fetchFavorites();

//! remove from favorite function

async function removeFromFavorites(button, landmarkId) {
  try {

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

    if (response.ok) {
      cardsData = cardsData.filter(
        (i) => i.item.Item_ID !== Number(landmarkId)
      );
      categoryFilter.value = "";
      nameFilter.value = "";
      renderCards(cardsData);

    }
  } catch (error) {
  } finally {
    button.removeAttribute("disabled");
  }
}
