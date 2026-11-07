// Elements
const createPostTrigger = document.getElementById("create-post-trigger");
const floatingPostBtn = document.getElementById("floating-post-btn");
const postModal = document.getElementById("post-modal");
const modalClose = document.getElementById("modal-close");
const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");
const postContent = document.getElementById("post-content");
const postSubmit = document.getElementById("post-submit");
const postsContainer = document.querySelector(".posts-container");
const layer = document.querySelector(".layer");
const layerImage = document.querySelector(".layer-img");
const layerCloseBtn = document.getElementById("layer-close");
const loaderContainer = document.getElementById("loader-container");

let posts = [];

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
  showMethod: "slideDown",
  hideMethod: "slideUp",
};

//! display posts
function displayPosts() {
  postsContainer.innerHTML = "";

   if (posts.length === 0) {
    const content =`<div class="col-12 text-center py-5 mx-auto">
                          <i class="fa-solid fa-users  fa-4x mb-3 text-warning"></i>
                          <h3>No stories found. Your journey could be the first to inspire others!</h3>
                      </div>`;
    postsContainer.insertAdjacentHTML("beforeend", content);
    return;
  }

  createPostTrigger.previousElementSibling.setAttribute(
    "src",
    `${
      sessionStorage.getItem('userData')&&jwt_decode(sessionStorage.getItem("userData")).profile_image ? jwt_decode(sessionStorage.getItem("userData")).profile_image:"images/boy.png"
    }`
  );
  let singleOrMultiple;
  posts.forEach((post) => {
    singleOrMultiple = post.images.length > 1 ? "multiple" : "single";
    // const date = new Date(post.date);

    const postsContent = `<article class="post">
        <div class="post-header position-relative">
          <img src="${
            typeof post.user.profile_image === "string" ? (post.user.profile_image || "images/boy.png") : "images/boy.png"
          }" alt="User-profile-image" class="avatar" onerror="this.src='images/image-not-found.png'">
          <div class="d-flex justify-content-between w-100">
            <div class="post-user-info">
              <div class="post-user-name">${post.user.name}</div>
              
             
              <div class="post-user-location d-flex align-items-center gap-2 ">
                <i class="fas ${post.user.address? '':'d-none'} fa-location-dot text-warning"></i><span class="${post.user.address? '':'d-none'} text-white-50">${
                  post.user.address
                } | </span><i class="fa-solid fa-calendar-days text-warning"></i><span class="text-white-50">${formatDate(post.date)}</span>
              </div>
             
              </div>
            </div>

          </div>
        </div>

        <div class="post-content ">
          <span class="post-text">${post.description
            .split(" ")
            .slice(0, 20)
            .join(" ")}</span>
          <button type="button" data-id="${post.id}"
            class=" ${post.description.split(' ').length < 30 ?'d-none': ''}  see see-more border-0 fst-italic bg-transparent text-warning text-decoration-underline rounded-5 pb-2">See
            More</button>
          <div class="post-images ${singleOrMultiple}">
            ${post.images
              .map((img) => {
                console.log( post.user , post.user.profile_image);
                
                  return `<img src="${img}" alt="post-image" class="post-image" onerror="this.src='images/image-not-found.png'">`;
               
              })
              .join("")}
           
          </div>
        </div>
      </article>`;
    postsContainer.insertAdjacentHTML("beforeend", postsContent);
  });
}

//! Selected files for upload
let selectedFiles = [];

//! Open modal
function openModal() {
  postModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

//! Close modal
function closeModal() {
  postModal.classList.remove("active");
  document.body.style.overflow = "auto";
  resetForm();
}


// !Reset form

function resetForm() {
  postContent.value = "";
  imagePreview.innerHTML = "";
  selectedFiles = [];
  updatePostSubmitState();
}

//! Update the state of the post submit button
function updatePostSubmitState() {
  postSubmit.disabled = selectedFiles.length === 0 || postContent.value === "";
}

//! Handle image selection
function handleImageSelection(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  resetForm(); // Clear previous selections

  const validFiles = files.filter(
    (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
  );

  if (validFiles.length === 0) {
    toastr.warning("No valid images selected. Please choose images under 2MB.");

    return;
  } else if (validFiles.length > 4) {
    toastr.warning("You can only select up to 4 images.");

    return;
  } else {
    selectedFiles = [...validFiles];

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const container = document.createElement("div");
        container.className = "preview-image-container";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "preview-image";

        const removeBtn = document.createElement("div");
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        removeBtn.className = "remove-image";
        removeBtn.style.cssText = `
          cursor: pointer; width: 25px; height: 25px; color: white;
          background-color: var(--primary); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin-left: auto;
        `;

        removeBtn.addEventListener("click", function () {
          selectedFiles = selectedFiles.filter((_, i) => i !== index);
          container.remove();

          // Force reindexing to prevent skipping issues
          refreshPreview();

          updatePostSubmitState();
        });

        container.appendChild(removeBtn);
        container.appendChild(img);
        imagePreview.appendChild(container);
      };

      reader.readAsDataURL(file);
    });

    updatePostSubmitState();
  }
}

//! Refresh the preview images and rebind remove events
function refreshPreview() {
  imagePreview.innerHTML = "";
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const container = document.createElement("div");
      container.className = "preview-image-container";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "preview-image";

      const removeBtn = document.createElement("div");
      removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      removeBtn.className = "remove-image";
      removeBtn.style.cssText = `
          cursor: pointer; width: 25px; height: 25px; color: white;
          background-color: var(--primary); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin-left: auto;
        `;

      removeBtn.addEventListener("click", function () {
        selectedFiles = selectedFiles.filter((_, i) => i !== index);
        container.remove();
        refreshPreview();
        updatePostSubmitState();
      });

      container.appendChild(removeBtn);
      container.appendChild(img);
      imagePreview.appendChild(container);
    };

    reader.readAsDataURL(file);
  });
}

//! to check if user login before goto favorite
function checkUserLoginForAction() {
  if (
    sessionStorage.getItem("userType") === "user" &&
    sessionStorage.getItem("userData") &&
    sessionStorage.getItem("isLoggedIn") === "true"
  ) {
    openModal();
  } else {
    authModal.style.display = "block";
  }
}
// Event listeners
postContent.addEventListener("input", updatePostSubmitState);
createPostTrigger.addEventListener("click", checkUserLoginForAction);
floatingPostBtn.addEventListener("click", checkUserLoginForAction);
modalClose.addEventListener("click", closeModal);
fileInput.addEventListener("change", handleImageSelection);
postSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  addStory();
});

//! Close modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === postModal) {
    closeModal();
  }
});

//!display layer
postsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("post-image")) {
    const src = e.target.getAttribute("src");
    layerImage.setAttribute("src", src);
    layer.classList.replace("d-none", "d-grid");
  }
});
layerCloseBtn.addEventListener("click", function () {
  layer.classList.replace("d-grid", "d-none");
});

layer.addEventListener("click", function (e) {
  if (e.target.tagName !== "IMG") {
    layer.classList.replace("d-grid", "d-none");
  }
});
//! to display or hide more content
postsContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("see")) return;
  if (e.target.classList.contains("see-more")) {
    e.target.previousElementSibling.textContent = posts.find(
      (post) => post.id === Number(e.target.dataset.id)
    ).description;
    e.target.classList.replace("see-more", "see-less");
    e.target.textContent = "See Less";
  } else if (e.target.classList.contains("see-less")) {
    e.target.previousElementSibling.textContent = posts
      .find((post) => post.id === Number(e.target.dataset.id))
      .description.split(" ")
      .slice(0, 20)
      .join(" ");
    e.target.classList.replace("see-less", "see-more");
    e.target.textContent = "See More";
  }
});
//! fetch posts
async function fetchPosts() {
  try {
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/stories/get_all_stories",{
        method: "GET",
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    posts = data;
    displayPosts();
    console.log(data);
    
  } catch (error) {
    console.log(error);
  } finally {
    loaderContainer.classList.add("d-none");
  }
}
fetchPosts();

async function addStory() {
  try {
    const form = new FormData();
    const user = jwt_decode(sessionStorage.getItem("userData"));
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    form.append("user_id", user.id);
    form.append("description", postContent.value);
    form.append("date", formattedDate);
    selectedFiles.forEach((file, index) => {
      form.append(`images[${index}]`, file);
    });
    postSubmit.querySelector("span.spin").classList.remove("d-none");
    postSubmit.querySelector("span.text").classList.add("d-none");
    postSubmit.disabled = true;
    const response = await fetch(
      "https://pharaohslegacy.cloud/api/stories/add_story",
      {
        method: "POST",
        body: form,
      }
    );
    const data = await response.json();

    if (!response.ok) 
      {
        if(response.status === 500)
        toastr.error(`${data.error}`);
        
        throw new Error(`HTTP error! status: ${response.status}`)
      };

   
    resetForm();
    closeModal();
    posts.unshift(data.story);
    displayPosts();

    toastr.success("Post added successfully");
  } catch (error) {
    console.error(error);
  }
  finally{
    postSubmit.querySelector("span.spin").classList.add("d-none");
    postSubmit.querySelector("span.text").classList.remove("d-none");
    postSubmit.disabled = false;
  }
}
