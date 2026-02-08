
let allItems = [];

let currentCategory = "all";
let currentVeg = "all";       
let currentSort = "none";     

const grid = document.getElementById("menuGrid");

/*LOAD DATA */

Promise.all([
  fetch("js/menu.json").then(res => res.json()),
  fetch("js/drinks.json").then(res => res.json())
])
.then(([menuData, drinksData]) => {

  const normalizedDrinks = drinksData.flatMap(section =>
    section.items.map(item => ({
      name: item.name,
      regular: item.regular ?? item.price ?? item.single ?? null,
      large: item.large ?? item.double ?? null,
      category: section.category,
      veg: section.veg,
      img: item.img || "images/drinks/default.png"
    }))
  );

  allItems = [...menuData, ...normalizedDrinks];
  showAll();
})
.catch(err => console.error("Failed to load data:", err));

/*RENDER*/

function render(items) {
  grid.innerHTML = items.map(item => {
    

    let priceHTML = "";

    if (item.regular || item.large) {
      priceHTML = `
        ${item.regular ? `M ₹${item.regular}` : ""}
        ${item.large ? `<span class="large"> | L ₹${item.large}</span>` : ""}
      `;
    } else if (item.price) {
      priceHTML = `₹${item.price}`;
    }

    return `
      <div class="menu-card">
        <img src="${item.img}" alt="${item.name}">
        <div class="menu-info">
          <h4 class="dish-name">
          ${item.veg ? `<img src="${getFoodIcon(item.veg)}" class="food-icon" alt="${item.veg}">` : ""}
          ${item.name}
          </h4>
          <div class="price">${priceHTML}</div>
        </div>
      </div>
    `;
  }).join("");
}

/*FILTERS */

// reset toggle switch
function clearFilters() {
  currentCategory = "all";
  currentVeg = "all";
  currentSort = "none";

  const vegToggle = document.getElementById("vegToggle");
  if (vegToggle) vegToggle.checked = false;

  resetActive();
  applyFilters();
  closeDropdown();
}

function applyFilters() {
  let filtered = [...allItems];

  // Category
  if (currentCategory !== "all") {
    filtered = filtered.filter(item => item.category === currentCategory);
  }

  // Veg / Egg / Non-veg
  if (currentVeg !== "all") {
    filtered = filtered.filter(item => item.veg === currentVeg);
  }

  // Price sorting
  if (currentSort === "low") {
    filtered.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (currentSort === "high") {
    filtered.sort((a, b) => getPrice(b) - getPrice(a));
  }

  render(filtered);
}

function getPrice(item) {
  return item.price || item.regular || 0;
}
function getFoodIcon(type) {
  if (type === "veg") return "assets/icons/veg-icon.png";
  if (type === "egg") return "assets/icons/egg-icon.png";
  if (type === "nonveg") return "assets/icons/nonveg-icon.png";
  return "";
}


/*FILTER ACTIONS */

function showAll() {
  currentCategory = "all";
  currentVeg = "all";
  currentSort = "none";
  resetActive();
  applyFilters();
  closeDropdown();
}

function filterItems(category) {
  currentCategory = category;
  resetActive();

  document
    .querySelector(`.dropdown-content button[onclick="filterItems('${category}')"]`)
    ?.classList.add("active");

  document
    .querySelector(`.pill[onclick="filterItems('${category}')"]`)
    ?.classList.add("active");

  applyFilters();
  closeDropdown();
}

function filterType(type) {
  currentVeg = type; 
  applyFilters();
  closeDropdown();
}

function sortByPrice(type) {
  currentSort = type; 
  applyFilters();
  closeDropdown();
}

function toggleVeg(toggle) {
  currentVeg = toggle.checked ? "veg" : "all";
  applyFilters();
}

function resetActive() {
  document
    .querySelectorAll(".dropdown-content button, .pill")
    .forEach(btn => btn.classList.remove("active"));
}

/*DROPDOWN*/

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function closeDropdown() {
  const dropdown = document.getElementById("dropdown");
  if (dropdown) dropdown.style.display = "none";
}

document.addEventListener("click", e => {
  const box = document.querySelector(".dropdown");
  if (box && !box.contains(e.target)) closeDropdown();
});

/* HERO SLIDER*/

let currentSlide = 0;

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".hero-nav.right");
const prevBtn = document.querySelector(".hero-nav.left");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
  currentSlide = index;
}

nextBtn?.addEventListener("click", () => {
  showSlide((currentSlide + 1) % slides.length);
});

prevBtn?.addEventListener("click", () => {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});
