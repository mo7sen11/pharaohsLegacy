const searchBar=document.getElementById("searchBar"),filterBar=document.getElementById("filter"),favoritesList=document.getElementById("favoritesList");
//! Helper function to update the displayed cards
function updateCards(e,t){const a=document.querySelectorAll("#favoritesList div.col-md-4"),n=Array.from(a).filter((a=>{const n=a.querySelector(".card-title").textContent.toLocaleLowerCase().includes(t.toLocaleLowerCase()),s="all"===e||a.dataset.category===e;return n&&s}));a.forEach((e=>e.style.display="none")),n.forEach((e=>e.style.display="block"));const s=document.getElementById("no-items");s&&(s.classList.toggle("d-none",n.length>0),s.classList.toggle("d-block",0===n.length))}
//! Search bar event listener
searchBar.addEventListener("input",(function(){const e=searchBar.value;updateCards(filterBar.value,e)})),
//! Filter bar event listener
filterBar.addEventListener("change",(function(){updateCards(filterBar.value,searchBar.value)})),
//! details btn 
favoritesList.addEventListener("click",(function(e){e.target.closest(".btn")?.classList.contains("btn-details")&&window.location.assign("landmarkDetails.html")}));