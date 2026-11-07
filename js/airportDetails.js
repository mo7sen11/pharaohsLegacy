//! selectors

const main = document.querySelector("main");
const loaderContainer = document.getElementById("loader-container");

let airports = [];
let userFavorites = [];
let ratingValueNumber = 0;

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

//! id for hotel details when the backend finish
const queryString = window.location.search;
const itemId = new URLSearchParams(queryString);

//! Go to top button functionality
goTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//! render airports
function renderAirports(airport) {
  //! Update SEO Tags
  document.title = `${airport.item.name} | Airport in ${airport.item.city}`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      `Explore ${airport.item.name}, a major airport in ${airport.item.city}, Egypt. Get flight details, services, and location info.`
    );
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle)
    ogTitle.setAttribute(
      "content",
      `${airport.item.name} | Airport in ${airport.item.city}`
    );

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc)
    ogDesc.setAttribute(
      "content",
      `${airport.item.name} in ${airport.item.city} is one of Egypt's primary international gateways. Learn about services and connections.`
    );

  const ogURL = document.querySelector('meta[property="og:url"]');
  if (ogURL)
    ogURL.setAttribute(
      "content",
      `https://pharaohslegacy.cloud/airportDetails?id=${airport.id}`
    );

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && airport.item.image_path)
    ogImage.setAttribute("content", airport.item.image_path);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical)
    canonical.setAttribute(
      "href",
      `https://pharaohslegacy.cloud/airportDetails?id=${airport.id}`
    );
  main.innerHTML = "";
  const isFavorite = userFavorites.some(
    (el) => el.item.Item_ID == airport.Item_ID
  );
  const card = `  <div class="container ">
            <section id="main-slider" class="splide mt-3 " aria-label="Main Image Slider">
                <div class="splide__track ">
                    <ul class="splide__list ">
                       
                       ${airport.item.photos
                         .map(
                           (photo) =>
                             ` <li class="splide__slide rounded-2"><img data-splide-lazy="${
                               photo.image_path || "images/image-not-found.png"
                             }" alt="${airport.item.name}"></li>`
                         )
                         .join("")}
                    </ul>
                </div>
            </section>

            <!-- Thumbnail Slider -->
            <section id="thumbnail-slider" class="splide thumbnail-slider mt-3" aria-label="Thumbnail Slider">
                <div class="splide__track">
                    <ul class="splide__list">
                        
                       ${airport.item.photos
                         .map(
                           (photo) =>
                             `<li class="splide__slide"><img src="${
                               photo.image_path || "images/image-not-found.png"
                             }" alt="${airport.item.name}"></li>`
                         )
                         .join("")}
                        
                    </ul>
                </div>
            </section>

        </div>


        <div class="container ">
            <div class="info-card ">
                <div class="buttons d-flex gap-2 justify-content-end ms-auto mt-2 mb-4 flex-wrap">

<button class="btn  btn-favorite-details ${
    isFavorite ? "d-none" : ""
  }" data-id="${airport.Item_ID}">
                <span class="d-none add-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="add-text"><i class="far fa-heart me-2"></i>Add to Favorites</span>
              </button>
              <button class="btn btn-remove-favorite-details  ${
                isFavorite ? "" : "d-none"
              }" data-id="${airport.Item_ID}">
              <span class="d-none remove-spin"><i class="fa-solid fa-spinner fa-spin px-5 py-1 "></i></span> <span class="remove-text"><i class="fa-solid fa-trash-can me-2"></i>Remove from Favorites</span>
              </button>


                    <button class="share-btn ">
                        <i class="fas fa-share"></i> Share
                    </button>

                </div>
                <h1 class="my-2  text-capitalize">${airport.item.name} </h1>


                <div class="d-flex align-items-center gap-2 my-2 ">
                    <h4 class="text-warning m-0">City: </h4><span class="city fs-5 text-capitalize">${
                      airport.item.city
                    }</span>
                </div>
               
                <div class="d-flex align-items-center gap-2 my-2 ">
                    <h4 class="text-warning m-0">Category: </h4><span class="category fs-5">Airports</span>
                </div>

                <div>
                    <h4 class="d-inline-block text-warning m-0">Description: </h4>
                    <span class="description fs-5  text-wrap"></span> <button type="button" id="see-more"
                        class="border-0 fst-italic bg-transparent text-warning text-decoration-underline rounded-5 px-2 py-1">See
                        More</button>
                </div>
                <hr>
                <div class="my-3">
                    <h4 class="text-warning text-capitalize ">${
                      airport.item.name
                    } Facilities:</h4>
                    <div class="facilities d-flex align-items-center gap-3 flex-wrap p-2">
                        
                        ${airport.facilities_airport

                          .map(
                            (facility) =>
                              ` <span class="facility-item rounded-pill bg-transparent  border-start border-bottom border-2 border-warning text-white  px-2 py-1">${facility.facility_name}</span>`
                          )
                          .join("")}

                    </div>
                </div>
              <hr>
                <div class="my-3">
                    <h4 class="text-warning">Airlines Companies:</h4>
                    <div class="airline-companies row g-3 p-2">
                       ${airport.airlines
                         .map((airline) => {
                           return `
                         <div class="col-12 col-md-6 col-lg-4 col-xl-3 ">
                            <div class="d-flex flex-column gap-2 rounded-3 border-bottom border-start border-warning p-3">
                                <h5 class="m-0 text-white text-capitalize text-truncate"><i class="fa-solid fa-plane-departure text-white me-1"></i>
                                   ${airline.name} </h5>
                                <hr>
                                <span class="text-capitalize text-truncate"><i class="fas fa-location-dot text-warning me-1"></i> ${airline.terminal}</span>
                                <span><i class="fas fa-earth text-warning me-1"></i> <a
                                        class="text-white text-decoration-none" target="_blank" href="${airline.website_link}">
                                        Website</a></span>
                                <span><i class="fas fa-envelope text-warning me-1"></i> <a
                                        class="text-white text-decoration-none" target="_blank" href="mailto:email">
                                        Email</a></span>
                                <span><i class="fas fa-phone text-warning me-1"></i> <a
                                        class="text-white text-decoration-none" target="_blank" href="tel:${airline.phone}">
                                        Phone</a></span>
                            </div>
                        </div>
                        `;
                         })
                         .join("")}

                    </div>
                </div>
                <hr>

                <div class="my-3">
                    <h4 class="text-warning">Contacts:</h4>
                    <div class="  d-flex align-items-center gap-3 gap-md-2 flex-wrap p-2">
                        <div>
                            <a rel="noopener" href="${airport.item.location}"
                                class=" text-decoration-none fs-6 fst-italic fw-medium px-2 py-1  rounded-pill bg-transparent text-white  border-bottom border-2 border-warning"
                                target="_blank"><i class="fas fa-location-dot fs-5 text-warning me-1"></i> Location </a>
                        </div>
                        <div>
                            <a rel="noopener" href="${airport.website_link}"
                                class=" text-decoration-none fs-6 fst-italic fw-medium px-2 py-1 rounded-pill bg-transparent text-white  border-bottom border-2 border-warning"
                                target="_blank"><i class="fas fa-globe fs-5 text-warning me-2"></i> Website </a>
                        </div>
                     
                        <div>
                            <a href="tel:${airport.phone}"
                                class=" text-decoration-none fs-6 fst-italic fw-medium px-2 py-1 rounded-pill bg-transparent text-white  border-bottom border-2 border-warning"
                                target="_blank"><i class="fas fa-phone fs-5 text-warning me-2"></i> Phone </a>
                        </div>
                      
                    </div>
                </div>
                <hr>
            </div>

   <div class="container d-none rating-form-container">
   
        <form id="rating-form" class="">
            <div class="rate-stars mb-3">
                <div class="d-flex gap-2 align-items-center justify-content-between"><h5>How Would You Rate Your Experience?</h5><button type="button" id="close-review-button" class=" p-0 m-0  bg-transparent btn text-danger "><i class="fa-solid fa-xmark fa-2x"></i></button></div>
                <span><i title="Bad" data-rate="1" class="far fa-star rate"></i></span>
                <span><i title="Poor" data-rate="2" class="far fa-star rate"></i></span>
                <span><i title="Average" data-rate="3" class="far fa-star rate"></i></span>
                <span><i title="Very Good" data-rate="4" class="far fa-star rate"></i></span>
                <span><i title="Excellent" data-rate="5" class="far fa-star rate"></i></span>
                <span class="rate-title text-white fs-5 ms-3"></span>
            </div>
            <div>
                <textarea class=" rounded-2 w-100" name="review-text" id="review-text"
                    placeholder="Give Us Your Experience"></textarea>
            </div>
            <button type="submit" id="submit-review"
                class="border-0 py-2 px-3 rounded-pill bg-warning my-2"><span class="spin px-5 d-none"><i class="fa-solid fa-spinner fa-spin"></i></span><span class="text">Submit Review</span>
            </button>
        </form>
    </div>



            

            <div class="container    ">
                <div
                    class="d-flex flex-column   flex-md-row  gap-2 gap-md-0 justify-content-md-between align-items-md-center">
                    <div class="d-flex align-items-center gap-2 order-2 order-md-0">
                        <h3>Reviews</h3>
                        <div class="rating-count bg-warning text-dark d-flex justify-content-center align-items-center">
                          <span class="text-bold fs-6"> <span><i class="fa-solid fa-star"></i> ${
                            airport.item.average_rating
                              ? airport.item.average_rating.toFixed(1)
                              : 0.0
                          }</span> (${formatReviewersNumber(
    airport.item.total_reviews
  )})</span>  
                        </div>
                    </div>

                    <button id="write-review"
                        class=" align-self-end align-self-md-auto   py-1 px-1 px-sm-2 rounded-pill border-0 bg-warning text-dark "><i
                            class="fa-solid fa-pen"></i> Write a Review</button>
                </div>
                <div class="row g-3 reviews-container">
                    ${airport.item.reviews
                      .map((rev) => {
                        const rating = Number(rev.rating_value ?? 0);
                        const starsHtml = generateStars(rating);
                        return `<div class="col-md-12">
                        <div class="review-card">
                            <div class="d-flex align-items-center ">
                                <div class="me-3 align-self-start">
                                    <img src="${
                                      rev.user.profile_image || "images/boy.png"
                                    }" class="review-img " alt="user-review-photo">
                                </div>
                                <div>
                                    <h5>${rev.user.name}</h5>
                                    <p class=" m-0 mb-2"><span class="${rev.user.address ? '':'d-none'}"><i class="fa-solid fa-location-dot text-warning me-2"></i>${
                                      rev.user.address
                                    } | </span><span><i class="fa-solid fa-calendar-days text-warning me-2"></i>${
                          formatDate(rev.date)
                        }</span></p>
                                    <div class="rating-stars">
                                        ${starsHtml}
                                        <span class="ms-2">${
                                          rev.rating_value
                                        }</span>
                                    </div>
                                    <p class="mt-2">${rev.content ?? ""}</p>
                                </div>
                            </div>
                        </div>
                            </div>`;
                      })
                      .slice(0, 3)
                      .join("")}
                

                </div>
                <button id="load-more" class=" m-auto  mt-5 py-2 px-4 rounded-5  ${
                  airport.item.total_reviews > 4 ? "d-block" : "d-none"
                }"> <i
                        class="fa-solid fa-rotate-right"></i>
                    Load More</button>
            <div class="no-reviews  ${
              airport.item.total_reviews > 0 ? "d-none" : "d-block"
            } my-5 text-center text-warning "><h6 class="fs-4">Oops! No reviews here yet , wanna be the cool one who writes the first ? </h6></div>

            </div>
        </div>`;

  main.insertAdjacentHTML("afterbegin", card);

  const description = document.querySelector(".description");
  const writeReviewBtn = document.getElementById("write-review");
  const RatingFormContainer = document.querySelector(".rating-form-container");
  const submitReview = document.getElementById("submit-review");
  const stars = document.querySelectorAll(".rate");
  const seeMoreBtn = document.getElementById("see-more");
  const rateTitle = document.querySelector(".rate-title");
  const rateStars = document.querySelector(".rate-stars");
  const shareBtn = document.querySelector(".share-btn");
  const closeReviewBtn = document.getElementById("close-review-button");
  const reviewText = document.getElementById("review-text");
  const mainSlide = document.getElementById("main-slider");
  const reviewsContainer = document.querySelector(".reviews-container");
  const noReviewsContainer = document.querySelector(".no-reviews");
  //! close button
  closeReviewBtn.addEventListener("click", function () {
    RatingFormContainer.classList.replace("d-block", "d-none");
  });
  // ! write review button
  writeReviewBtn.addEventListener("click", function () {
    const isUser =
      sessionStorage.getItem("userType") === "user" &&
      sessionStorage.getItem("isLoggedIn") === "true" &&
      sessionStorage.getItem("userData");
    if (!isUser) {
      authModal.style.display = "block";
      return;
    }
    RatingFormContainer.classList.replace("d-none", "d-block");
  });

  // ! make stars colored
  rateStars.addEventListener("click", function (e) {
    const title = e.target.getAttribute("title");
    ratingValueNumber = e.target.dataset.rate;
    if (e.target.hasAttribute("title")) {
      rateTitle.textContent = title;
      for (const [i, el] of Array.from(stars).entries()) {
        if (i + 1 <= ratingValueNumber) {
          el.classList.replace("far", "fas");
          el.classList.add("text-warning");
        } else {
          el.classList.replace("fas", "far");
          el.classList.remove("text-warning");
        }
      }
    }
  });

  // ! submit button for rating
  submitReview.addEventListener("click", function (e) {
    e.preventDefault();

    async function addReview() {
      if (ratingValueNumber === 0) {
        toastr.error("please choose the rate between 1 and 5 ");
        return;
      } else {
        try {
          submitReview
            .querySelector("span.spin")
            .classList.replace("d-none", "d-block");
          submitReview.querySelector("span.text").classList.add("d-none");
          submitReview.setAttribute("disabled", "true");
          const date = new Date();
          const formattedDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const isContent = reviewText.value === "" ? false : true;
          let requestBody = "";
          if (isContent) {
            requestBody = JSON.stringify({
              rating_value: ratingValueNumber,
              content: reviewText.value,
              Item_ID: airport.Item_ID,
              id: jwt_decode(sessionStorage.getItem("userData")).id,
              date: formattedDate,
            });
          } else {
            requestBody = JSON.stringify({
              rating_value: ratingValueNumber,
              Item_ID: airport.Item_ID,
              id: jwt_decode(sessionStorage.getItem("userData")).id,
              date: formattedDate,
            });
          }

          const response = await fetch(
            "https://pharaohslegacy.cloud/api/Review/store_new_review",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: requestBody,
            }
          );
          const data = await response.json();

          if (!response.ok) {
            if (response.status === 500) {
              console.log(data.error);
            }
            throw new Error("Failed to add review");
          } else if (response.ok) {
            RatingFormContainer.classList.replace("d-block", "d-none");
            toastr.success(`Your review has been added successfully`);
            airports.item.reviews.unshift(data);

            airports.item.average_rating = updateAverage(
              airports.item.average_rating ?? 0,
              airports.item.total_reviews ?? 0,
              ratingValueNumber
            );
            airports.item.total_reviews += 1;
            ratingValueNumber = 0;
            reviewText.value = "";
            noReviewsContainer.classList.replace("d-block", "d-none");
            loadMoreBtn.classList.replace("d-none", "d-block");

            renderAirports(airports);
          }
        } catch (error) {
          console.error("Error adding review:", error);
        } finally {
          submitReview
            .querySelector("span.spin")
            .classList.replace("d-block", "d-none");
          submitReview.querySelector("span.text").classList.remove("d-none");
          submitReview.removeAttribute("disabled");
        }
      }
    }
    addReview();
  });

  //! share button
  const shareData = {
    title: document.title,
    text: `${airport.item.name} - ${airport.item.city} `,
    url: window.location.href,
  };

  //! Share must be triggered by "user activation"
  shareBtn.addEventListener("click", async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err);
    }
  });

  //! hide or display text in description
  splitText(seeMoreBtn, description, airport.item.description);
  //! Initialize the main slider
  const mainSlider = new Splide("#main-slider", {
    type: "loop", // Change 'fade' to 'loop' if autoplay still fails
    heightRatio: 0.55,
    pagination: false,
    arrows: false,
    cover: true,
    autoplay: true, // Enable autoplay
    interval: 3000, // 3-second delay
    pauseOnHover: true,
    pauseOnFocus: false,
    lazyLoad: "sequential",
    // focus: "center",
    breakpoints: {
      768: {
        heightRatio: 1.2,
      },
      992: {
        heightRatio: 0.7,
      },
    },
  });

  //! Initialize the thumbnail slider
  const thumbnailSlider = new Splide("#thumbnail-slider", {
    fixedWidth: 110,
    fixedHeight: 70,
    isNavigation: true,
    arrows: false,
    gap: 10,
    // focus: 'center',
    pagination: false,
    cover: true,
    breakpoints: {
      600: {
        fixedWidth: 70,
        fixedHeight: 40,
      },
    },
  });

  //! Sync both sliders
  mainSlider.sync(thumbnailSlider);
  mainSlider.mount();
  thumbnailSlider.mount();
  //! go to top button
  goToTobObserver.observe(mainSlide);

  //! load more reviews
  let reviews = airport.item.reviews;
  let currentReviews = 2;
  const loadMoreBtn = document.getElementById("load-more");

  function appendMoreReviews() {
    const nextBatch = reviews.slice(currentReviews, currentReviews + 3);

    nextBatch.forEach((rev) => {
      const rating = Number(rev.rating_value ?? 0);
      const starsHtml = generateStars(rating);
      const reviewHtml = `
        <div class="col-md-12">
          <div class="review-card">
            <div class="d-flex align-items-center">
              <div class="me-3 align-self-start">
                <img src="${
                  rev.user.profile_image || "images/boy.png"
                }" class="review-img" alt="user-review-photo">
              </div>
              <div>
                <h5>${rev.user.name}</h5>
                <p class="m-0 mb-2">
                  <span class="${rev.user.address ? '':'d-none'}"><i class="fa-solid fa-location-dot text-warning me-2"></i>${
                    rev.user.address
                  } | </span>
                  <span><i class="fa-solid fa-calendar-days text-warning me-2"></i>${
                    formatDate(rev.date)
                  }</span>
                </p>
                <div class="rating-stars">
                  ${starsHtml}
                  <span class="ms-2">${rev.rating_value}</span>
                </div>
                <p class="mt-2">${rev.content ?? ""}</p>
              </div>
            </div>
          </div>
        </div>`;
      reviewsContainer.insertAdjacentHTML("beforeend", reviewHtml);
    });

    currentReviews += 3;

    if (currentReviews >= reviews.length) {
      loadMoreBtn.classList.replace("d-block", "d-none");
      loadMoreBtn.classList.add("d-none");
    }
  }

  loadMoreBtn.addEventListener("click", appendMoreReviews);
}
//! actions buttons
main.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".btn-favorite-details");
  const removeBtn = e.target.closest(".btn-remove-favorite-details");

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
  }
});

//! fetch api for restaurant details
async function fetchData() {
  try {
    const response = await fetch(
      `https://pharaohslegacy.cloud/api/airport/show_specific_item/${itemId.get(
        "id"
      )}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    } else if (response.ok) {
      const data = await response.json();
      console.log(data);
      airports = data.airport;
      if (sessionStorage.getItem("userData")) {
        await getUserFavorites();
      }
      renderAirports(airports);
    }
  } catch (err) {
    console.info(err);
  } finally {
    loaderContainer.classList.add("d-none");
  }
}

fetchData();

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
      .closest(".buttons")
      .querySelector(".btn-remove-favorite-details")
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
      .closest(".buttons")
      .querySelector(".btn-favorite-details")
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
