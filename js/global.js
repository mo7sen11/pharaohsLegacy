const links = document.querySelectorAll(".nav-link");
const link = window.location.pathname.slice(1).split(".").at(0);
const logoutBtn = document.getElementById("logout-btn");
const logoutBtnSidebar = document.getElementById("logout-sidebar-btn");
const navBarFavoriteBtn = document.getElementById("navbar-favorite-btn");
const navBarFavoriteBtnSidebar = document.getElementById(
  "navbar-sidebar-favorite-btn"
);
const navBarProfileBtn = document.getElementById("navbar-profile-btn");
const navBarProfileBtnSidebar = document.getElementById(
  "navbar-sidebar-profile-btn"
);
const authModal = document.getElementById("loginModal");
const goTopBtn = document.getElementById("btnGoTop");
// const header = document.querySelector(".header");
// const searchSection = document.querySelector(".search-section");
// const thumbnailSlider = document.getElementById("thumbnail-slider");


//! make links active
links.forEach((el) => {
  const name = el.getAttribute("data-name");
  if (!name) return;

  const isActive = name === link || (link === "" && name === "index");
  el.classList.toggle("Active", isActive);
});



if (
  sessionStorage.getItem("userType") === "user" &&
  sessionStorage.getItem("isLoggedIn") === "true"
) {
  logoutBtn.classList.remove("d-none");
  logoutBtnSidebar.classList.remove("d-none");
}

//! logout for two buttons

async function logOut() {
  try {
    const token = sessionStorage.getItem("userData"); 
    const response = await fetch("https://pharaohslegacy.cloud/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {      
      throw new Error("Logout failed");
    }

   else if(response.ok){
    sessionStorage.removeItem("userData");
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.setItem("userType", "user");
    window.location.reload();
    window.location.replace("index.html");
   }


  } catch (error) {
    console.error("Logout error:", error);
  }
}


logoutBtnSidebar.addEventListener("click", logOut);
logoutBtn.addEventListener("click", logOut);

//! global function that display or hide text
const splitText = function (btn, splitEl, text) {
  const words = text.split(" ");
  const shortText = words.slice(0, 20).join(" ");
  const fullText = text;

  const isInitiallyShort = words.length > 20;
  splitEl.textContent = isInitiallyShort ? shortText : fullText;
  btn.textContent = isInitiallyShort ? "See More" : "See Less";
  btn.style.display = words.length > 20 ? "inline-block" : "none";

  btn.addEventListener("click", function () {
    if (splitEl.textContent === shortText) {
      splitEl.textContent = fullText;
      btn.textContent = "See Less";
    } else {
      splitEl.textContent = shortText;
      btn.textContent = "See More";
    }
  });
};

//! modal authentication functions
function authLoginCloseModal() {
  authModal.style.display = "none";
}
//! Redirect to your actual login page
function authLoginGoToLogin() {
  window.location.href = "auth.html";
}
// !Close modal if clicking outside it
window.onclick = function (event) {
  if (event.target == authModal) {
    authLoginCloseModal();
  }
};

//! to check if user login before goto favorite
function checkUserLoginForAction(page) {
  return function () {
    if (
      sessionStorage.getItem("userType") === "user" &&
      sessionStorage.getItem("isLoggedIn") === "true"
      &&sessionStorage.getItem("userData")
    ) {
      window.location.assign(page);
    } else {
      authModal.style.display = "block";
    }
  };
}
navBarFavoriteBtn.addEventListener(
  "click",
  checkUserLoginForAction("favorite.html")
);
navBarFavoriteBtnSidebar.addEventListener(
  "click",
  checkUserLoginForAction("favorite.html")
);
navBarProfileBtn.addEventListener(
  "click",
  checkUserLoginForAction("profile.html")
);
navBarProfileBtnSidebar.addEventListener(
  "click",
  checkUserLoginForAction("profile.html")
);

//! format number of reviewers
function formatReviewersNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
}

//! Go to top button functionality
goTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//! go to top observer
const toggleGoTopButton = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    goTopBtn.classList.remove("show");
  } else {
    goTopBtn.classList.add("show");
  }
};

const goToTobObserver = new IntersectionObserver(toggleGoTopButton, {
  root: null,
  threshold: 0,
});

//! generate stars
function generateStars(rating) {
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  starsHtml += '<i class="fas fa-star text-warning  me-1"></i>'.repeat(fullStars);
  if (hasHalfStar)
    starsHtml += '<i class="fas fa-star-half-alt text-warning me-1"></i>';
  starsHtml += '<i class="far fa-star text-white-50 me-1"></i>'.repeat(
    emptyStars
  );

  return starsHtml;
}

//! calc new avg
function updateAverage(currentAvg, currentCount, newRating) {
  currentAvg = Number(currentAvg);
  currentCount = Number(currentCount);
  newRating = Number(newRating);
  return (currentAvg * currentCount + newRating) / (currentCount + 1);
}

//! formate date()
function formatDate(inputDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const now = new Date();
  const date = new Date(inputDate); 
  const diff = Number(now) - Number(date);
  const noOfDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (noOfDays === 0) {
    return "Today";
  } else if (noOfDays > 0 && noOfDays < 8) {
    return `${noOfDays} day${noOfDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString(undefined, options);
  }
}




