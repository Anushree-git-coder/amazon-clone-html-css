// ── 1. PRODUCT DATA ─
const products = [
  { id: 1, name: "Classic Cotton T-Shirt",    category: "Clothes",                  price: 499,  image: "box1_image.jpg", rating: 4.3 },
  { id: 2, name: "Vitamin C Serum",           category: "Health & Personal Care",   price: 349,  image: "box2_image.jpg", rating: 4.6 },
  { id: 3, name: "Wooden Bookshelf",          category: "Furniture",                price: 3999, image: "box3_image.jpg", rating: 4.1 },
  { id: 4, name: "Wireless Earbuds",          category: "Electronics",              price: 1299, image: "box4_image.jpg", rating: 4.7 },
  { id: 5, name: "Lipstick Set",              category: "Beauty Pics",              price: 599,  image: "box5_image.jpg", rating: 4.4 },
  { id: 6, name: "Dog Food Premium",          category: "Pet Care",                 price: 799,  image: "box6_image.jpg", rating: 4.5 },
  { id: 7, name: "LEGO Building Set",         category: "New Arrivals & Toys",      price: 1499, image: "box7_image.jpg", rating: 4.8 },
  { id: 8, name: "Floral Summer Dress",       category: "Discover Fashion Trends",  price: 999,  image: "box8_image.jpg", rating: 4.2 },
];

// ── 2. CART STATE ──
let cart = JSON.parse(localStorage.getItem("amazonCart")) || [];

function saveCart() {
  localStorage.setItem("amazonCart", JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ── 3. CART COUNTER UPDATE ──
function updateCartCounter() {
  const count = getCartCount();

  let badge = document.getElementById("cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "cart-badge";
    Object.assign(badge.style, {
      position: "absolute", top: "-8px", left: "18px",
      background: "#f08804", color: "#111", fontWeight: "800",
      fontSize: "0.72rem", borderRadius: "50%",
      width: "20px", height: "20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: "10",
      transition: "transform 0.2s cubic-bezier(.175,.885,.32,1.4)"
    });
    const cartEl = document.querySelector(".nav-cart");
    if (cartEl) {
      cartEl.style.position = "relative";
      cartEl.appendChild(badge);
    }
  }

  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";

  // Bounce animation on every update
  badge.style.transform = "scale(1.5)";
  setTimeout(() => { badge.style.transform = "scale(1)"; }, 250);
}

// ── 4. ADD TO CART ─
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartCounter();
  updateCardButtons(productId);
  showToast(`"${product.name}" added to cart 🛒`);
}

// ── 5. REMOVE FROM CART ─
function removeFromCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (!existing) return;

  if (existing.qty > 1) {
    existing.qty -= 1;
  } else {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
  updateCartCounter();
  updateCardButtons(productId);
  showToast(`Item removed from cart 🗑️`);
}

// ── 6. SYNC CARD BUTTONS WITH CART STATE ─
function updateCardButtons(productId) {
  const box = document.querySelector(`.box[data-product-id="${productId}"]`);
  if (!box) return;

  const cartItem = cart.find(item => item.id === productId);
  const qty = cartItem ? cartItem.qty : 0;

  const qtyDisplay = box.querySelector(".card-qty-display");
  const removeBtn  = box.querySelector(".remove-from-cart-btn");

  if (qtyDisplay) qtyDisplay.textContent = qty > 0 ? `In cart: ${qty}` : "";
  if (removeBtn)  removeBtn.style.display = qty > 0 ? "block" : "none";
}

// ── 7. TOAST NOTIFICATION ─
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:fixed; bottom:30px; left:50%;
      transform:translateX(-50%) translateY(80px);
      background:#232f3e; color:white; padding:12px 28px;
      border-radius:4px; font-size:0.9rem; z-index:9999;
      box-shadow:0 4px 15px rgba(0,0,0,0.3);
      transition:transform 0.35s cubic-bezier(.175,.885,.32,1.275), opacity 0.35s;
      opacity:0; white-space:nowrap; pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = "translateX(-50%) translateY(0)";
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(80px)";
    toast.style.opacity = "0";
  }, 2500);
}

// ── 8. BUILD PRODUCT CARDS ─
function enhanceProductBoxes() {
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box, index) => {
    const product = products[index];
    if (!product) return;

    box.dataset.productId = product.id;
    box.dataset.category  = product.category.toLowerCase();

    const content = box.querySelector(".box-content");

    // Stars
    const ratingRow = document.createElement("div");
    ratingRow.className = "rating-row";
    ratingRow.innerHTML = `${generateStars(product.rating)}
      <span style="font-size:0.75rem;color:#007185;margin-left:4px;">${product.rating}</span>`;
    ratingRow.style.cssText = "display:flex;align-items:center;margin-bottom:6px;";

    // Price
    const priceTag = document.createElement("p");
    priceTag.innerHTML = `<span style="font-size:0.7rem;vertical-align:top;">₹</span>${product.price.toLocaleString("en-IN")}`;
    priceTag.style.cssText = "font-size:1.1rem;font-weight:700;color:#0f1111;margin-bottom:8px;";

    // "In cart: N" display
    const qtyDisplay = document.createElement("p");
    qtyDisplay.className = "card-qty-display";
    const savedQty = cart.find(i => i.id === product.id)?.qty || 0;
    qtyDisplay.textContent = savedQty > 0 ? `In cart: ${savedQty}` : "";
    qtyDisplay.style.cssText = "font-size:0.78rem;color:#555;margin-bottom:6px;min-height:1.1em;";

    // ADD button
    const addBtn = document.createElement("button");
    addBtn.className = "add-to-cart-btn";
    addBtn.textContent = "Add to Cart";
    addBtn.style.cssText = `
      width:100%; padding:8px 0; background:#ffd814;
      border:1px solid #fcd200; border-radius:20px;
      font-size:0.85rem; font-weight:700; cursor:pointer;
      color:#0f1111; transition:background 0.2s, box-shadow 0.2s;
      margin-bottom:6px;
    `;
    addBtn.addEventListener("click", e => {
      e.stopPropagation();
      addToCart(product.id);
      addBtn.textContent = "✓ Added!";
      addBtn.style.background = "#067d62";
      addBtn.style.color = "white";
      setTimeout(() => {
        addBtn.textContent = "Add to Cart";
        addBtn.style.background = "#ffd814";
        addBtn.style.color = "#0f1111";
      }, 1000);
    });
    addBtn.addEventListener("mouseenter", () => addBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)");
    addBtn.addEventListener("mouseleave", () => addBtn.style.boxShadow = "none");

    // REMOVE button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-from-cart-btn";
    removeBtn.textContent = "− Remove from Cart";
    removeBtn.style.cssText = `
      width:100%; padding:7px 0; background:white;
      border:1px solid #c45500; border-radius:20px;
      font-size:0.82rem; font-weight:700; cursor:pointer;
      color:#c45500; transition:background 0.2s, color 0.2s;
      display:${savedQty > 0 ? "block" : "none"};
    `;
    removeBtn.addEventListener("click", e => {
      e.stopPropagation();
      removeFromCart(product.id);
    });
    removeBtn.addEventListener("mouseenter", () => {
      removeBtn.style.background = "#c45500";
      removeBtn.style.color = "white";
    });
    removeBtn.addEventListener("mouseleave", () => {
      removeBtn.style.background = "white";
      removeBtn.style.color = "#c45500";
    });

    content.appendChild(ratingRow);
    content.appendChild(priceTag);
    content.appendChild(qtyDisplay);
    content.appendChild(addBtn);
    content.appendChild(removeBtn);

    // Hover lift effect
    box.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
    box.style.cursor = "pointer";
    box.addEventListener("mouseenter", () => {
      box.style.transform = "translateY(-6px) scale(1.02)";
      box.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
    });
    box.addEventListener("mouseleave", () => {
      box.style.transform = "";
      box.style.boxShadow = "";
    });
  });
}

function generateStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)          html += `<span style="color:#f0a500;font-size:0.85rem;">★</span>`;
    else if (rating >= i-0.5) html += `<span style="color:#f0a500;font-size:0.85rem;">⯨</span>`;
    else                      html += `<span style="color:#ccc;font-size:0.85rem;">★</span>`;
  }
  return html;
}

// ── 9. SEARCH BAR ───
function initSearch() {
  const input      = document.querySelector(".Search-input");
  const searchIcon = document.querySelector(".search-icon");
  const select     = document.querySelector(".search-select");

  const categories = ["All", ...new Set(products.map(p => p.category))];
  select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");

  function doSearch() {
    const query       = input.value.trim().toLowerCase();
    const selectedCat = select.value;
    const boxes       = document.querySelectorAll(".box");
    let matchCount    = 0;

    boxes.forEach((box, index) => {
      const product   = products[index];
      if (!product) return;
      const nameMatch = product.name.toLowerCase().includes(query);
      const catMatch  = selectedCat === "All" || product.category === selectedCat;
      const visible   = nameMatch && catMatch;

      box.style.transition = "opacity 0.3s";
      if (visible) {
        box.style.opacity = "1";
        box.style.display = "";
        matchCount++;
      } else {
        box.style.opacity = "0";
        setTimeout(() => { if (box.style.opacity === "0") box.style.display = "none"; }, 300);
      }
    });

    let noResultsEl = document.getElementById("no-results");
    if (!noResultsEl) {
      noResultsEl = document.createElement("div");
      noResultsEl.id = "no-results";
      noResultsEl.style.cssText = "width:100%;text-align:center;padding:40px;font-size:1.1rem;color:#555;display:none;";
      document.querySelector(".shop-section").appendChild(noResultsEl);
    }
    noResultsEl.textContent = `No products found for "${input.value}"`;
    noResultsEl.style.display = (matchCount === 0 && query !== "") ? "block" : "none";
  }

  searchIcon.addEventListener("click", doSearch);
  input.addEventListener("input", doSearch);
  input.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
  select.addEventListener("change", doSearch);
}

// ── 10. HERO SLIDER ───
const heroSlides = [
  { bg: "hero_image.jpg",  label: "Mega Sale – Up to 70% Off" },
  { bg: "box4_image.jpg",  label: "Top Electronics Deals"      },
  { bg: "box1_image.jpg",  label: "Fashion Week Specials"      },
  { bg: "box3_image.jpg",  label: "New Furniture Collection"   },
];

function initSlider() {
  const heroSection = document.querySelector(".hero-section");
  if (!heroSection) return;

  heroSection.style.position = "relative";
  heroSection.style.overflow = "hidden";

  heroSlides.forEach((slide, i) => {
    const div = document.createElement("div");
    div.className = "hero-slide";
    div.style.cssText = `position:absolute;inset:0;background-image:url('${slide.bg}');background-size:cover;background-position:center;opacity:${i===0?"1":"0"};transition:opacity 0.8s ease-in-out;`;
    const lbl = document.createElement("div");
    lbl.style.cssText = "position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.55);color:white;padding:8px 20px;border-radius:4px;font-size:1rem;font-weight:600;white-space:nowrap;";
    lbl.textContent = slide.label;
    div.appendChild(lbl);
    heroSection.appendChild(div);
  });

  const prevBtn = createSliderBtn("❮", "left:12px");
  const nextBtn = createSliderBtn("❯", "right:12px");
  heroSection.appendChild(prevBtn);
  heroSection.appendChild(nextBtn);

  const dotsWrapper = document.createElement("div");
  dotsWrapper.style.cssText = "position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10;";
  heroSlides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.style.cssText = `width:10px;height:10px;border-radius:50%;background:${i===0?"white":"rgba(255,255,255,0.45)"};cursor:pointer;display:inline-block;transition:background 0.3s;`;
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrapper.appendChild(dot);
  });
  heroSection.appendChild(dotsWrapper);

  let current = 0;
  let timer = setInterval(() => goToSlide((current + 1) % heroSlides.length), 4000);

  function goToSlide(n) {
    const slides = heroSection.querySelectorAll(".hero-slide");
    const dots   = dotsWrapper.querySelectorAll("span");
    slides[current].style.opacity = "0";
    dots[current].style.background = "rgba(255,255,255,0.45)";
    current = n;
    slides[current].style.opacity = "1";
    dots[current].style.background = "white";
  }

  prevBtn.addEventListener("click", () => { clearInterval(timer); goToSlide((current-1+heroSlides.length)%heroSlides.length); timer=setInterval(()=>goToSlide((current+1)%heroSlides.length),4000); });
  nextBtn.addEventListener("click", () => { clearInterval(timer); goToSlide((current+1)%heroSlides.length); timer=setInterval(()=>goToSlide((current+1)%heroSlides.length),4000); });
}

function createSliderBtn(symbol, pos) {
  const btn = document.createElement("button");
  btn.innerHTML = symbol;
  btn.style.cssText = `position:absolute;top:50%;${pos};transform:translateY(-50%);z-index:10;background:rgba(0,0,0,0.45);color:white;border:none;border-radius:50%;width:36px;height:36px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;`;
  btn.addEventListener("mouseenter", () => btn.style.background="rgba(0,0,0,0.75)");
  btn.addEventListener("mouseleave", () => btn.style.background="rgba(0,0,0,0.45)");
  return btn;
}

// ── 11. CART SIDEBAR ──────────────────────────
function initCartPanel() {
  const cartEl = document.querySelector(".nav-cart");
  if (!cartEl) return;

  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;";
  document.body.appendChild(overlay);

  const panel = document.createElement("div");
  panel.id = "cart-panel";
  panel.style.cssText = "position:fixed;top:0;right:-420px;width:400px;max-width:95vw;height:100vh;background:white;z-index:1001;box-shadow:-4px 0 20px rgba(0,0,0,0.2);transition:right 0.35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;";
  panel.innerHTML = `
    <div style="background:#232f3e;color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
      <h2 style="font-size:1.1rem;font-weight:700;">🛒 Shopping Cart</h2>
      <button id="close-cart" style="background:none;border:none;color:white;font-size:1.4rem;cursor:pointer;">✕</button>
    </div>
    <div id="cart-items" style="flex:1;overflow-y:auto;padding:16px;"></div>
    <div id="cart-footer" style="padding:16px;border-top:1px solid #ddd;background:#f9f9f9;"></div>
  `;
  document.body.appendChild(panel);

  const openCart  = () => { renderCartItems(); overlay.style.display="block"; panel.style.right="0"; document.body.style.overflow="hidden"; };
  const closeCart = () => { overlay.style.display="none"; panel.style.right="-420px"; document.body.style.overflow=""; };

  cartEl.style.cursor = "pointer";
  cartEl.addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);
  document.getElementById("close-cart").addEventListener("click", closeCart);

  function renderCartItems() {
    const container = document.getElementById("cart-items");
    const footer    = document.getElementById("cart-footer");

    if (cart.length === 0) {
      container.innerHTML = `<div style="text-align:center;margin-top:60px;color:#888;"><div style="font-size:3rem;">🛒</div><p style="margin-top:12px;">Your cart is empty</p></div>`;
      footer.innerHTML = "";
      return;
    }

    container.innerHTML = cart.map(item => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee;">
        <div style="width:60px;height:60px;background-image:url('${item.image}');background-size:cover;border-radius:4px;flex-shrink:0;"></div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name}</p>
          <p style="font-size:0.8rem;color:#555;margin-top:2px;">₹${item.price.toLocaleString("en-IN")} each</p>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" style="width:26px;height:26px;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:1rem;background:white;font-weight:700;">−</button>
            <span style="font-size:0.9rem;font-weight:700;min-width:16px;text-align:center;">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" style="width:26px;height:26px;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:1rem;background:white;font-weight:700;">+</button>
            <button class="qty-btn" data-action="del" data-id="${item.id}" style="font-size:0.75rem;color:#c45500;background:none;border:none;cursor:pointer;text-decoration:underline;margin-left:4px;">Remove</button>
          </div>
        </div>
        <p style="font-size:0.9rem;font-weight:700;white-space:nowrap;">₹${(item.price * item.qty).toLocaleString("en-IN")}</p>
      </div>
    `).join("");

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    footer.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1rem;margin-bottom:12px;">
        <span>Subtotal (${getCartCount()} item${getCartCount()!==1?"s":""})</span>
        <span>₹${total.toLocaleString("en-IN")}</span>
      </div>
      <button onclick="alert('Proceeding to checkout! 🎉')" style="width:100%;padding:10px;background:#ffd814;border:1px solid #fcd200;border-radius:20px;font-weight:700;font-size:0.95rem;cursor:pointer;">Proceed to Checkout</button>
      <button id="clear-cart-btn" style="width:100%;padding:8px;background:white;border:1px solid #ccc;border-radius:20px;font-size:0.85rem;cursor:pointer;margin-top:8px;color:#555;">Clear Cart</button>
    `;

    container.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id     = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const idx    = cart.findIndex(i => i.id === id);
        if (idx === -1) return;

        if      (action === "inc") { cart[idx].qty += 1; }
        else if (action === "dec") { cart[idx].qty -= 1; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
        else if (action === "del") { cart.splice(idx, 1); }

        saveCart();
        updateCartCounter();
        updateCardButtons(id);
        renderCartItems();
      });
    });

    document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
      cart = [];
      saveCart();
      updateCartCounter();
      products.forEach(p => updateCardButtons(p.id));
      renderCartItems();
    });
  }
}

// ── 12. BACK TO TOP ───
function initBackToTop() {
  const panel = document.querySelector(".foot-panel1");
  if (!panel) return;
  panel.style.cursor = "pointer";
  panel.textContent  = "▲  Back to Top";
  panel.addEventListener("click",      () => window.scrollTo({ top: 0, behavior: "smooth" }));
  panel.addEventListener("mouseenter", () => panel.style.background = "#485769");
  panel.addEventListener("mouseleave", () => panel.style.background = "#37475a");
}

// ── 13. STICKY NAV SHADOW ───
function initStickyNav() {
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 10 ? "0 2px 10px rgba(0,0,0,0.4)" : "none";
  });
}

// ── INIT ───
document.addEventListener("DOMContentLoaded", () => {
  enhanceProductBoxes();
  updateCartCounter();
  initSearch();
  initSlider();
  initCartPanel();
  initBackToTop();
  initStickyNav();
});
