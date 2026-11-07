
const searchSection = document.querySelector(".search-section");
const main = document.querySelector("main");
const loaderContainer = document.getElementById("loader-container");


let trips = [];
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


//! Render trip cards
function renderTrips(tripList) {
  const tripsRow = document.getElementById("tripsRow");
  tripsRow.innerHTML = "";

  if (tripList.length === 0) {
    tripsRow.innerHTML = `
                      <div class="col-12 text-center py-5 mx-auto">
                          <i class="fa-solid fa-suitcase-rolling  fa-4x mb-3 text-warning"></i>
                          <h3>No Trips found matching your criteria</h3>
                      </div>
                  `;
    return;
  }
  else if (trips.length === 0) {
    tripsRow.innerHTML = `
                      <div class="col-12 text-center py-5 mx-auto">
                          <i class="fa-solid fa-suitcase-rolling  fa-4x mb-3 text-warning"></i>
                          <h3>No Trips Founded Now</h3>
                      </div>
                  `;
    return;
  }

  tripList.forEach((trip) => {
    const imagePath =
      trip.main_image || "images/image-not-found.png";
   

    const tripCard = `
                
                    <div class="col-md-6 col-lg-4">
                        <div class="card trip-card shadow mb-4">
                            <div class="position-relative">
                                <img src="${
                                  imagePath
                                }" class="card-img-top" alt="${trip.name}" >
                                <span class="image-badge" style="display: ${
                                  trip.hasoffer === "true" ? "block" : "none"
                                };">Hot Deal</span>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title text-yellow text-truncate text-capitalize">${
                                  trip.name
                                }</h3>
                                <p class="card-text">
                                    <strong>From:</strong><span class="text-white text-capitalize"> ${
                                      trip.from_location
                                    }</span><br>
                                    <strong>To:</strong> <span class="text-white text-capitalize">${
                                      trip.to_location
                                    }</span>
                                </p>
                                <p class="card-text price-container">
                                    <strong class="me-1">Price: </strong>
                                    <span class="${
                                      trip.hasoffer === "true"
                                        ? "price-mutated"
                                        : "price-normal"
                                    }">EGP${Number(trip.price).toFixed(2)}</span>
                                    <span class="offer-text" style="display: ${
                                      trip.hasoffer === "true" ? "inline" : "none"
                                    };">
                                       EGP${
                                          trip.hasoffer === "true"
                                            ? Number(trip.offers).toFixed(2)
                                            : ""
                                        }
                                    </span>
                                    <span class="badge badge-offer ms-2" style="display: ${
                                      trip.hasoffer === "true" ? "inline" : "none"
                                    };">Offer ${Number(trip.bayment_bersent).toFixed()}%</span>
                                </p>
                             
                                <p class="card-text">${
                                  trip.description
                                }</p>
                                <div class="my-0">
              <button class="btn book-btn  rounded-5 d-block mx-auto  fs-6 fst-italic w-50" data-id="${trip.id}">
               Book Now <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
            </div>
                            </div>
                        </div>
                    </div>
                `;

    tripsRow.insertAdjacentHTML("beforeend", tripCard);
  });
}





 //! go to top observer
 goToTobObserver.observe(searchSection);
 
//! actions buttons
main.addEventListener("click", (e) => {
  const detailsBtn = e.target.closest(".book-btn");

 
  
 if (detailsBtn) {
    const queryString = new URLSearchParams({ id: detailsBtn.dataset.id }).toString();
    window.location.href = `tripDetails.html?${queryString}`;
  }
});

//! fetch api
async function fetchTrips() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/Trip/Display_all_trip"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    trips = data.data;
     console.log(trips);

     
   
    
  
    renderTrips(trips);
  } catch (error) {
    console.log(error);
    
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}



//! Real-time search functionality
function filterTrips() {
  const toQuery = document.getElementById("to").value.toLowerCase();
  const fromQuery = document.getElementById("from").value.toLowerCase();

  const filteredTrips = trips.filter((trip) => {
    const toMatch =  trip.to_location.toLowerCase().includes(toQuery);
    const fromMatch =  trip.from_location.toLowerCase().includes(fromQuery);

    return toMatch && fromMatch;
  });

  renderTrips(filteredTrips);
}
document.querySelectorAll(".search-input").forEach((input) => {
  input.addEventListener("input", filterTrips);
});


//! Initial render
fetchTrips();


