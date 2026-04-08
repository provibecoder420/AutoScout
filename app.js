// ── DOM References ──
const makeSelect = document.getElementById("make");
const modelSelect = document.getElementById("model");
const yearMinSelect = document.getElementById("yearMin");
const yearMaxSelect = document.getElementById("yearMax");
const searchForm = document.getElementById("searchForm");
const resetBtn = document.getElementById("resetBtn");
const platformsGrid = document.getElementById("platformsGrid");
const quickLinks = document.getElementById("quickLinks");
const linksList = document.getElementById("linksList");

// ── Populate Makes ──
const makes = Object.keys(VEHICLE_DATA).sort();
makes.forEach(make => {
  const opt = document.createElement("option");
  opt.value = make;
  opt.textContent = make;
  makeSelect.appendChild(opt);
});

// ── Populate Years (current year down to 1990) ──
const currentYear = new Date().getFullYear();
for (let y = currentYear + 1; y >= 1990; y--) {
  const optMin = document.createElement("option");
  optMin.value = y;
  optMin.textContent = y;
  yearMinSelect.appendChild(optMin);

  const optMax = document.createElement("option");
  optMax.value = y;
  optMax.textContent = y;
  yearMaxSelect.appendChild(optMax);
}

// ── Make → Model Cascade ──
makeSelect.addEventListener("change", () => {
  const make = makeSelect.value;
  modelSelect.innerHTML = '<option value="">Any Model</option>';

  if (make && VEHICLE_DATA[make]) {
    modelSelect.disabled = false;
    VEHICLE_DATA[make].forEach(model => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  } else {
    modelSelect.disabled = true;
  }
  renderPlatformCards();
});

// ── Render Platform Cards (with section headers) ──
function renderPlatformCards() {
  platformsGrid.innerHTML = "";

  // Marketplace section
  const marketHeader = document.createElement("div");
  marketHeader.className = "platform-section-header";
  marketHeader.textContent = "Marketplace Aggregators";
  platformsGrid.appendChild(marketHeader);

  MARKETPLACE_PLATFORMS.forEach(p => {
    platformsGrid.appendChild(createPlatformCard(p));
  });

  // Dealer CPO section
  const dealerHeader = document.createElement("div");
  dealerHeader.className = "platform-section-header";
  dealerHeader.textContent = "Dealership / Certified Pre-Owned";
  platformsGrid.appendChild(dealerHeader);

  const selectedMake = makeSelect.value.toLowerCase();
  const sorted = [...DEALER_PLATFORMS].sort((a, b) => {
    const aMatch = a.name.toLowerCase().includes(selectedMake) ? 0 : 1;
    const bMatch = b.name.toLowerCase().includes(selectedMake) ? 0 : 1;
    return aMatch - bMatch;
  });

  sorted.forEach(p => {
    platformsGrid.appendChild(createPlatformCard(p));
  });
}

function createPlatformCard(p) {
  const card = document.createElement("a");
  card.className = "platform-card";
  card.href = p.buildUrl(getFilters());
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.innerHTML = `
    <div class="platform-header">
      <div class="platform-icon" style="background:${p.color}">${p.letter}</div>
      <span class="platform-name">${p.name}</span>
    </div>
    <p class="platform-desc">${p.description}</p>
    <span class="platform-badge">${p.badge}</span>
  `;
  return card;
}

// ── Collect Filter Values ──
function getFilters() {
  return {
    make: makeSelect.value,
    model: modelSelect.value,
    yearMin: document.getElementById("yearMin").value,
    yearMax: document.getElementById("yearMax").value,
    priceMin: document.getElementById("priceMin").value,
    priceMax: document.getElementById("priceMax").value,
    mileageMax: document.getElementById("mileageMax").value,
    zipCode: document.getElementById("zipCode").value.trim(),
    radius: document.getElementById("radius").value,
    bodyStyle: document.getElementById("bodyStyle").value,
    transmission: document.getElementById("transmission").value,
    fuelType: document.getElementById("fuelType").value,
    drivetrain: document.getElementById("drivetrain").value,
    color: document.getElementById("color").value,
    sortBy: document.getElementById("sortBy").value
  };
}

// ── Build Human-readable Filter Summary ──
function buildFilterSummary(f) {
  const parts = [];
  if (f.yearMin && f.yearMax) parts.push(`${f.yearMin}\u2013${f.yearMax}`);
  else if (f.yearMin) parts.push(`${f.yearMin}+`);
  else if (f.yearMax) parts.push(`Up to ${f.yearMax}`);

  if (f.make) {
    let v = f.make;
    if (f.model) v += ` ${f.model}`;
    parts.push(v);
  }

  if (f.priceMin && f.priceMax) parts.push(`$${Number(f.priceMin).toLocaleString()}\u2013$${Number(f.priceMax).toLocaleString()}`);
  else if (f.priceMin) parts.push(`$${Number(f.priceMin).toLocaleString()}+`);
  else if (f.priceMax) parts.push(`Under $${Number(f.priceMax).toLocaleString()}`);

  if (f.mileageMax) parts.push(`Under ${Number(f.mileageMax).toLocaleString()} mi`);
  if (f.transmission) parts.push(f.transmission.charAt(0).toUpperCase() + f.transmission.slice(1));
  if (f.fuelType) parts.push(f.fuelType.charAt(0).toUpperCase() + f.fuelType.slice(1).replace("_", " "));
  if (f.drivetrain) parts.push(f.drivetrain.toUpperCase());
  if (f.color) parts.push(f.color.charAt(0).toUpperCase() + f.color.slice(1));
  if (f.bodyStyle) parts.push(f.bodyStyle.charAt(0).toUpperCase() + f.bodyStyle.slice(1));
  if (f.zipCode) parts.push(`Near ${f.zipCode}${f.radius ? ` (${f.radius} mi)` : ""}`);

  return parts.length ? parts.join(" &middot; ") : "All used vehicles (no filters applied)";
}

// ── Search: Generate Links ──
function performSearch() {
  const filters = getFilters();

  quickLinks.style.display = "block";

  const summaryHtml = `<div class="filter-summary"><strong>Searching:</strong> ${buildFilterSummary(filters)}</div>`;

  let linksHtml = summaryHtml;

  linksHtml += `<div class="platform-section-header" style="margin-top:0.5rem;">Marketplace Aggregators</div>`;
  MARKETPLACE_PLATFORMS.forEach((p, i) => {
    const url = p.buildUrl(filters);
    linksHtml += buildLinkHtml(p, url, i);
  });

  linksHtml += `<div class="platform-section-header" style="margin-top:1rem;">Dealership / Certified Pre-Owned</div>`;
  DEALER_PLATFORMS.forEach((p, i) => {
    const url = p.buildUrl(filters);
    linksHtml += buildLinkHtml(p, url, i + MARKETPLACE_PLATFORMS.length);
  });

  linksList.innerHTML = linksHtml;

  renderPlatformCards();

  quickLinks.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildLinkHtml(p, url, index) {
  return `
    <a class="search-link" href="${url}" target="_blank" rel="noopener noreferrer" style="animation-delay: ${index * 0.03}s">
      <div class="link-icon" style="background:${p.color}">${p.letter}</div>
      <div>
        <div class="link-name">${p.name}</div>
        <div class="link-filters">${p.badge}</div>
      </div>
      <span class="link-arrow">&#8599;</span>
    </a>
  `;
}

// ── Event Listeners ──
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  performSearch();
});

resetBtn.addEventListener("click", () => {
  searchForm.reset();
  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="">Any Model</option>';
  quickLinks.style.display = "none";
  linksList.innerHTML = "";
  renderPlatformCards();
});

// Update platform card links whenever a filter changes
document.querySelectorAll(".filters-panel select, .filters-panel input[type='text']").forEach(el => {
  el.addEventListener("change", renderPlatformCards);
});

// ── Collapsible Filter Section (mobile) ──
const filtersToggle = document.getElementById("filtersToggle");
const filtersBody = document.getElementById("filtersBody");

function isMobile() {
  return window.matchMedia("(max-width: 600px)").matches;
}

function initCollapsible() {
  if (isMobile()) {
    filtersBody.classList.add("collapsed");
    filtersBody.classList.remove("expanded");
    filtersToggle.classList.remove("open");
  } else {
    filtersBody.classList.remove("collapsed");
    filtersBody.classList.add("expanded");
    filtersBody.style.maxHeight = "none";
  }
}

filtersToggle.addEventListener("click", () => {
  const isCollapsed = filtersBody.classList.contains("collapsed");
  if (isCollapsed) {
    filtersBody.classList.remove("collapsed");
    filtersBody.classList.add("expanded");
    filtersBody.style.maxHeight = filtersBody.scrollHeight + "px";
    filtersToggle.classList.add("open");
  } else {
    filtersBody.classList.add("collapsed");
    filtersBody.classList.remove("expanded");
    filtersBody.style.maxHeight = "0";
    filtersToggle.classList.remove("open");
  }
});

window.addEventListener("resize", () => {
  if (!isMobile()) {
    filtersBody.classList.remove("collapsed");
    filtersBody.classList.add("expanded");
    filtersBody.style.maxHeight = "none";
  }
});

// ── Initial Render ──
initCollapsible();
renderPlatformCards();
