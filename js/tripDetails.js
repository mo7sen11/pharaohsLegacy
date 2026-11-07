//! selectors

const main = document.querySelector("main");
const loaderContainer = document.getElementById("loader-container");
let trips = [];
let hasOffer = "";
let pricePerPerson = 0;
const options = { day: "2-digit", month: "short", year: "numeric" };
const isUser =
  sessionStorage.getItem("userType") === "user" &&
  sessionStorage.getItem("isLoggedIn") === "true" &&
  sessionStorage.getItem("userData");

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

//! render trips
function renderTrips(trip) {
  //! Update SEO Tags
  document.title = `${trip.name} | Trip in Egypt`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      `${trip.description} Book your spot for a memorable experience starting on ${trip.trip_date}.`
    );
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", `${trip.name} | Trip in Egypt`);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc)
    ogDesc.setAttribute(
      "content",
      `${trip.name} offers a thrilling journey through Egypt, starting on ${trip.trip_date}.`
    );

  const ogURL = document.querySelector('meta[property="og:url"]');
  if (ogURL)
    ogURL.setAttribute(
      "content",
      `https://pharaohslegacy.cloud/tripDetails?id=${trip.id}`
    );

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && trip.main_image)
    ogImage.setAttribute("content", trip.main_image);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical)
    canonical.setAttribute(
      "href",
      `https://pharaohslegacy.cloud/tripDetails?id=${trip.id}`
    );
  main.innerHTML = "";
  const tripDate = new Date(trip.trip_date);
  const card = `   <div class="container ">
            <section id="main-slider" class="splide mt-3 " aria-label="Main Image Slider">
                <div class="splide__track ">
                    <ul class="splide__list ">

                        ${trip.photos
                          .map(
                            (photo) =>
                              ` <li class="splide__slide rounded-2"><img data-splide-lazy="${
                                photo.image_path ||
                                " images/image-not-found.png"
                              }" alt="${trip.name}"></li>`
                          )
                          .join("")}
                    </ul>
                </div>
            </section>

            <!-- Thumbnail Slider -->
            <section id="thumbnail-slider" class="splide thumbnail-slider mt-3" aria-label="Thumbnail Slider">
                <div class="splide__track">
                    <ul class="splide__list">

                        ${trip.photos
                          .map(
                            (photo) =>
                              `<li class="splide__slide"><img src="${
                                photo.image_path ||
                                " images/image-not-found.png"
                              }" alt="${trip.name}"></li>`
                          )
                          .join("")}

                    </ul>
                </div>
            </section>

        </div>


        <div class="container ">
            <div class="info-card ">
                <div class=" d-flex justify-content-end mt-2 mb-4 ">
                    <button class="share-btn ">
                        <i class="fas fa-share"></i> Share
                    </button>

                </div>
                <h1 class="my-2  text-capitalize">${trip.name} </h1>


                <div class="d-flex align-items-center gap-2 my-2 ">
                    <h4 class="text-warning m-0">From: </h4><span class="city fs-5 text-capitalize">${
                      trip.from_location
                    }</span>
                </div>
                <div class="d-flex align-items-center gap-2 my-2 ">
                    <h4 class="text-warning m-0">To: </h4><span class="city fs-5 text-capitalize">${
                      trip.to_location
                    }</span>
                </div>
                <div class="d-flex align-items-center gap-2 my-2 ">
                    <h4 class="text-warning m-0">Price: </h4><span
                        class="price fs-5 ${
                          hasOffer === "true"
                            ? "text-decoration-line-through text-white-50"
                            : ""
                        }">EGP${Number(trip.price).toFixed(0)}</span><span
                        class="price ${
                          hasOffer === "true" ? "" : "d-none"
                        } fs-5 text-white">EGP${Number(trip.offers).toFixed(
    0
  )}</span>
                    <span class="bg-success ${
                      hasOffer === "true" ? "" : "d-none"
                    } text-white px-2 py-1 rounded-3 ms-2 fs-5">Offer
                        ${Number(trip.bayment_bersent).toFixed(0)}%</span>
                </div>

                <div>
                    <h4 class="d-inline-block text-warning m-0">Description: </h4>
                    <span class="description fs-5  text-wrap"></span> <button type="button" id="see-more"
                        class="border-0 fst-italic bg-transparent text-warning text-decoration-underline rounded-5 px-2 py-1">See
                        More</button>
                </div>

                <hr>
                <div class="itinerary-section  overflow-x-hidden">

                    <h2 class="section-title text-warning ">Trip Itinerary</h2>
                    <div class="timeline">

                    </div>
                </div>
                <hr>

                <div class="my-5 ">
                    <div class="row g-4">
                        <div class="d-flex flex-column  col-md-6 gap-3">
                            <h2 class="section-title text-warning">TRIP RULES</h2>
                            <div class="feature-card card">
                                <div class="card-header text-warning">ALLOWED</div>
                                <ul class="list-group list-group-flush">
                                    ${trip.includes
                                      .map((point) => {
                                        return ` <li class="list-group-item"><i
                                            class="fa-solid fa-check-double text-warning"></i>
                                        ${point.point}</li>`;
                                      })
                                      .join("")}

                                </ul>
                            </div>
                            <div class="feature-card excluded card">
                                <div class="card-header text-danger">NOT ALLOWED</div>
                                <ul class="list-group list-group-flush">
                                    
                                    ${trip.excludes
                                      .map((point) => {
                                        return ` <li class="list-group-item"><i class="fa-solid fa-xmark text-danger"></i>
                                
                                        ${point.point}</li>`;
                                      })
                                      .join("")}

                                </ul>
                            </div>
                        </div>
                        <div class=" col-md-6">
                            <div class="container animate__animated animate__zoomIn">
                                <h2 class="section-title text-warning">Book Your Trip Now</h2>
                                <div class="booking-card">
                                    <form id="bookingForm" class="booking-form">
                                        <div class="form-group">
                                            <label for="travelDate" class="form-label">Trip Date <span
                                                    class="text-white-50">(read only)</span></label>
                                            <div class="input-group">
                                                <i class="fas fa-calendar-alt form-icon"></i>
                                                <input type="text" class="form-control" id="travelDate"
                                                    value="${tripDate.toLocaleDateString(
                                                      "en-US",
                                                      options
                                                    )}" readonly>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="numPeople" class="form-label">Number of Persons</label>
                                            <div class="input-group">
                                                <i class="fas fa-users form-icon"></i>
                                                <input type="number" class="form-control" id="numPeople" min="1"
                                                    max="100"  required>
                                            </div>
                                        </div>
                                        <div class="booking-summary">
                                            <p><strong>Price per Person:</strong> EGP${
                                              hasOffer === "true"
                                                ? trip.offers
                                                : trip.price
                                            }</p>
                                            <p><strong>Number of Persons:</strong> <span id="summaryNumPeople">1</span>
                                            </p>
                                            <p><strong>Total Price:</strong> <span id="summaryTotalPrice">EGP</span>
                                            </p>
                                            <p><strong>Selected Date:</strong> <span
                                                    id="summaryTravelDate">${tripDate.toLocaleDateString(
                                                      "en-US",
                                                      options
                                                    )}</span>
                                            </p>
                                        </div>

                                        <div class="text-center mt-3">
                                            <button id="submitBooking" type="button" class="btn btn-custom"><span class="spin px-4  d-none"><i class="fa-solid fa-spinner fa-spin"></i></span>  <span class="text">Book
                                                Now</span></button>
                                        </div>
                                        <div class="mt-3">
                                            <div class="d-flex justify-content-center flex-wrap gap-3">
                                                <i title="Visa" class="fa-brands fa-cc-apple-pay payment-icon"></i>
                                                <i title="Mastercard"
                                                    class="fa-brands fa-cc-mastercard payment-icon"></i>
                                                <i title="PayPal" class="fa-brands fa-cc-paypal payment-icon"></i>
                                                <i title="Google Pay" class="fa-brands fa-google-pay payment-icon"></i>
                                                <i title="Apple Pay" class="fa-brands fa-apple-pay payment-icon"></i>


                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>











        </div>`;

  main.insertAdjacentHTML("afterbegin", card);
  // ! Initialize the timeline when the DOM is loaded
  createTimelineItems();
  const description = document.querySelector(".description");
  const seeMoreBtn = document.getElementById("see-more");
  const shareBtn = document.querySelector(".share-btn");
  const mainSlide = document.getElementById("main-slider");
  const submitBookingBtn = document.getElementById("submitBooking");
  const numPeopleInput = document.getElementById("numPeople");
  const travelDateInput = document.getElementById("travelDate");
  const summaryNumPeopleSpan = document.getElementById("summaryNumPeople");
  const summaryTotalPriceSpan = document.getElementById("summaryTotalPrice");
  document.getElementById("numPeople").value=1;
  travelDateInput.readOnly = true;
  pricePerPerson = hasOffer === "true" ? trips.offers : trips.price;
  updateBookingData();

  //! share button
  const shareData = {
    title: document.title,
    text: `${trip.name} - from: ${trip.from_location} - to: ${
      trip.to_location
    } - ${
      hasOffer === "true"
        ? ` save ${Number(trip.bayment_bersent).toFixed(0)}%`
        : `only EGP${Number(trips.price).toFixed(0)}`
    } `,
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
  splitText(seeMoreBtn, description, trip.description);
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

  submitBookingBtn.addEventListener("click", function () {
    const numPeople = Number(document.getElementById("numPeople").value);
    if (!isUser) {
      authModal.style.display = "block";
      return;
    } else if (numPeople < 1 || numPeople > 100) {
      toastr.error("Number of people must be between 1 and 100.");
      return;
    }
    bookTrip();
  });

  function updateBookingData() {
    const numPeople = parseInt(numPeopleInput.value) || 1;
    const totalPrice = numPeople * pricePerPerson || 0;

    summaryNumPeopleSpan.textContent = numPeople;
    summaryTotalPriceSpan.textContent = `EGP${totalPrice}`;
  }

  numPeopleInput.addEventListener("input", updateBookingData);

  numPeopleInput.addEventListener("change", function () {
    const numPeople = parseInt(this.value);
    if (numPeople < 1 || numPeople > 100) {
      // toastr.error("Number of people must be between 1 and 100.");
      // this.value = 1;
      updateBookingData();
    }
  });

  //! Function to create timeline items
  function createTimelineItems() {
    const timeline = document.querySelector(".timeline");

    trips.steps.forEach((step, index) => {
      // Extract day number and description
      const dayParts = step.step.split(": ");
      const dayNumber = dayParts[0]; // "Day 1", "Day 2", etc.
      const description = dayParts[1];

      // Calculate position and animation based on index
      const isEven = index % 2 === 0;
      const position = isEven ? "left" : "right";
      // const animation = isEven ? 'animate__fadeInLeft' : 'animate__fadeInRight';

      // Create timeline item
      const timelineItem = document.createElement("div");
      // timelineItem.className = `timeline-item ${position}  ${animation}  animate__delay-5s`;
      timelineItem.className = `timeline-item ${position} `;

      timelineItem.innerHTML = `
                    <div class="timeline-card">
                        <div class="timeline-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <h5>${dayNumber}:</h5>
                        <p>${description}</p>
                    </div>
                `;

      timeline.appendChild(timelineItem);
    });
  }

  async function bookTrip() {
    try {
      submitBookingBtn.setAttribute("disabled", true);
      submitBookingBtn.querySelector("span.spin").classList.remove("d-none");
      submitBookingBtn.querySelector("span.text").classList.add("d-none");
      const response = await fetch(
        "https://pharaohslegacy.cloud/api/book-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_id: itemId.get("id"),
            user_id: jwt_decode(sessionStorage.getItem("userData")).id,
            number_of_people: Number(document.getElementById("numPeople").value),
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500) {
          toastr.error(data.error);
          return;
        }
        throw new Error("Failed to book trip");
      } else if (response.ok) {
        bookingForm.reset();
        window.location.replace(data.payment_url);
        infoCardSection.classList.replace("d-block", "d-none");
      }
    } catch (error) {
      console.log(error.error);
    } finally {
      submitBookingBtn.removeAttribute("disabled");
      submitBookingBtn.querySelector("span.spin").classList.add("d-none");
      submitBookingBtn.querySelector("span.text").classList.remove("d-none");
    }
  }
}

//! fetch api for restaurant details
async function fetchData() {
  try {
    const response = await fetch(
      `https://pharaohslegacy.cloud/api/Trip/show_specific_trip/${itemId.get(
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
      trips = data.trip;
      hasOffer = data.hasOffer;
      renderTrips(trips);
    }
  } catch (err) {
    console.info(err);
  } finally {
    loaderContainer.classList.add("d-none");
  }
}

fetchData();
