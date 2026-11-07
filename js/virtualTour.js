
const placesList = document.getElementById("placesList");
const main = document.querySelector("main");
const pageTitle = document.querySelector(".page-title");
const loaderContainer=document.getElementById("loader-container");
let landmarks=[];

function displayPlaces(placesToDisplay) {
  placesList.innerHTML = "";

  if (placesToDisplay.length === 0) {
    placesList.innerHTML = `
      <div class="col-12 text-center py-5 mx-auto">
        <i class="fas fa-vr-cardboard fa-4x mb-3" style="color: var(--main-yellow);"></i>
        <h3>There are no places to display </h3>
      </div>
    `;
    return;
  }

  let html = "";

  placesToDisplay.forEach((place) => {
    html += `
      <div class="col-12 col-md-6 col-lg-4 col-xl-4">
        <div class="card place-card animate__animated animate__fadeInUp">
          <a rel="noopener" href="${place.link}" target="_blank" class="text-decoration-none">
            <img src="${place.main_image_path}" 
                 class="card-img-top animate__animated animate__slideInDown animate__delay-1s animate__slow" 
                 alt="${place.name || 'Virtual Tour'}" 
                 onerror="this.src='images/image-not-found.png'">
            <div class="card-body">
              <h4 class="animate__animated animate__fadeInRight animate__slow animate__delay-1s text-warning card-title text-truncate text-capitalize">
                ${place.name}
              </h4>
            </div>
          </a>
        </div>
      </div>
    `;
  });

  placesList.innerHTML = html;
}



//! fetch api
async function fetchVirtualImages() {
  try {
    const response = await fetch("https://pharaohslegacy.cloud/api/vertual-images");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const landmarks = await response.json();
    displayPlaces(landmarks);
  } catch (error) {
    console.error(error);
  } finally {
    loaderContainer?.classList.add("d-none");
  }
}

fetchVirtualImages();







//! go to top observer
goToTobObserver.observe(pageTitle);
