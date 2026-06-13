/* =========================================================
   GALAXY FASHION BD - JAVASCRIPT
   Product prices, product codes, delivery price and slider settings
   are easy to update from this file.
========================================================= */

/* ================= PRODUCT DATA / PRICE SETTINGS START =================
   MAIN COMBO PRICE: 1199
   RELATED PRODUCT PRICE: 590 each
   Hidden product codes submit to Netlify Forms with order data.
======================================================================= */
const products = [
  {
    id: 'combo',
    code: 'GFB-CMB-001', // Main combo hidden product code
    name: 'Tropical Fusion Duo Pack - 1 × 1',
    desc: '2 Premium Shirts',
    price: 1199, // Main combo price
    img: 'assets/product-combo.svg',
    gallery: ['assets/product-combo.svg', 'assets/hero-1.svg', 'assets/showcase-1.svg']
  },
  {
    id: 'tropical',
    code: 'GFB-SHIRT-002', // Related product hidden product code
    name: 'Tropical Print Shirt',
    desc: 'Premium Quality',
    price: 590, // Related product price
    img: 'assets/product-1.svg',
    gallery: ['assets/product-1.svg', 'assets/showcase-1.svg', 'assets/hero-2.svg']
  },
  {
    id: 'leafy',
    code: 'GFB-SHIRT-003',
    name: 'Leafy Style Shirt',
    desc: 'Premium Quality',
    price: 590,
    img: 'assets/product-2.svg',
    gallery: ['assets/product-2.svg', 'assets/hero-3.svg', 'assets/showcase-2.svg']
  },
  {
    id: 'navy',
    code: 'GFB-SHIRT-004',
    name: 'Navy Abstract Shirt',
    desc: 'Premium Quality',
    price: 590,
    img: 'assets/product-3.svg',
    gallery: ['assets/product-3.svg', 'assets/showcase-2.svg', 'assets/hero-1.svg']
  },
  {
    id: 'white',
    code: 'GFB-SHIRT-005',
    name: 'White Bloom Shirt',
    desc: 'Premium Quality',
    price: 590,
    img: 'assets/product-4.svg',
    gallery: ['assets/product-4.svg', 'assets/showcase-2.svg', 'assets/hero-2.svg']
  },
  {
    id: 'ocean',
    code: 'GFB-SHIRT-006',
    name: 'Ocean Vibe Shirt',
    desc: 'Premium Quality',
    price: 590,
    img: 'assets/product-5.svg',
    gallery: ['assets/product-5.svg', 'assets/hero-3.svg', 'assets/showcase-1.svg']
  }
];
/* ================= PRODUCT DATA / PRICE SETTINGS END ================= */

/* ================= GLOBAL STATE START ================= */
let cart = { combo: 1 }; // Main product is selected by default
let delivery = 0; // Delivery charge updates after shipment radio select
let slide = 0;
let sliderTimer = null;
let lbGallery = [];
let lbIndex = 0;
const taka = n => '৳ ' + Number(n).toLocaleString('en-US') + '.00';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
/* ================= GLOBAL STATE END ================= */

/* ================= HERO SLIDER START ================= */
function initSlider() {
  const slides = $$('.hero-slide');
  const dots = $('.slider-dots');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.onclick = () => showSlide(i);
    dots.appendChild(dot);
  });

  $('.next').onclick = () => showSlide(slide + 1);
  $('.prev').onclick = () => showSlide(slide - 1);

  showSlide(0);
  sliderTimer = setInterval(() => showSlide(slide + 1), 4500); // Slider autoplay time
}

function showSlide(i) {
  const slides = $$('.hero-slide');
  const dots = $$('.slider-dots button');
  slide = (i + slides.length) % slides.length;
  slides.forEach((item, index) => item.classList.toggle('active', index === slide));
  dots.forEach((dot, index) => dot.classList.toggle('active', index === slide));
}
/* ================= HERO SLIDER END ================= */

/* ================= RELATED PRODUCTS START ================= */
function renderRelated() {
  const wrap = $('#relatedProducts');
  wrap.innerHTML = products
    .filter(product => product.id !== 'combo')
    .map(product => `
      <article class="product-card">
        <img src="${product.img}" alt="${product.name}" data-lightbox="${product.id}">
        <h3>${product.name}</h3>
        <b>${taka(product.price).replace('.00', '')}</b>
        <button class="add-btn ${cart[product.id] ? 'added' : ''}" type="button" data-add="${product.id}">
          ${cart[product.id] ? '✓ Added' : '+ Add'}
        </button>
      </article>
    `).join('');

  wrap.querySelectorAll('[data-add]').forEach(btn => {
    btn.onclick = () => {
      cart[btn.dataset.add] = (cart[btn.dataset.add] || 0) + 1;
      renderAll();
    };
  });

  wrap.querySelectorAll('[data-lightbox]').forEach(img => {
    img.onclick = () => openLightbox(img.dataset.lightbox);
  });
}
/* ================= RELATED PRODUCTS END ================= */

/* ================= CART RENDER START ================= */
function renderCart() {
  const wrap = $('#cartItems');
  wrap.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return `
      <div class="cart-item">
        <img src="${product.img}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <p>Product Code: ${product.code}</p>
          <div class="qty">
            <button type="button" data-dec="${id}">−</button>
            <span>${qty}</span>
            <button type="button" data-inc="${id}">+</button>
          </div>
        </div>
        <div class="item-price">${taka(product.price * qty)}</div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('[data-inc]').forEach(btn => {
    btn.onclick = () => {
      cart[btn.dataset.inc]++;
      renderAll();
    };
  });

  wrap.querySelectorAll('[data-dec]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.dec;
      cart[id]--;
      if (cart[id] <= 0 && id !== 'combo') delete cart[id];
      if (id === 'combo' && cart[id] < 1) cart[id] = 1;
      renderAll();
    };
  });
}
/* ================= CART RENDER END ================= */

/* ================= ORDER SUMMARY START ================= */
function renderSummary() {
  const wrap = $('#summaryItems');
  wrap.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return `
      <div class="summary-item">
        <img src="${product.img}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>× ${qty}</p>
        </div>
        <b>${taka(product.price * qty)}</b>
      </div>
    `;
  }).join('');
}

function updateTotals() {
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * qty;
  }, 0);

  const total = subtotal + delivery;

  $('#subtotalText').textContent = taka(subtotal);
  $('#totalText').textContent = taka(total);
  $('#buttonTotal').textContent = taka(total);

  // Netlify hidden submit fields
  $('#orderItemsInput').value = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return `${product.name} (${product.code}) x ${qty} = ${product.price * qty}`;
  }).join(' | ');

  $('#productCodesInput').value = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return `${product.code} x ${qty}`;
  }).join(', ');

  $('#subtotalInput').value = subtotal;
  $('#deliveryInput').value = delivery;
  $('#totalInput').value = total;
}
/* ================= ORDER SUMMARY END ================= */

/* ================= LIGHTBOX START ================= */
function openLightbox(id) {
  const product = products.find(item => item.id === id);
  lbGallery = product.gallery;
  lbIndex = 0;
  $('#lightbox').classList.add('open');
  $('#lightbox').setAttribute('aria-hidden', 'false');
  renderLightbox();
}

function closeLightbox() {
  $('#lightbox').classList.remove('open');
  $('#lightbox').setAttribute('aria-hidden', 'true');
}

function renderLightbox() {
  $('#lightboxImage').src = lbGallery[lbIndex];
  $('#lightboxThumbs').innerHTML = lbGallery.map((src, index) => `
    <img src="${src}" class="${index === lbIndex ? 'active' : ''}" alt="Preview ${index + 1}">
  `).join('');

  $$('#lightboxThumbs img').forEach((img, index) => {
    img.onclick = event => {
      event.stopPropagation();
      lbIndex = index;
      renderLightbox();
    };
  });
}

$('.lightbox-close').onclick = closeLightbox;
$('.lb-prev').onclick = event => {
  event.stopPropagation();
  lbIndex = (lbIndex - 1 + lbGallery.length) % lbGallery.length;
  renderLightbox();
};
$('.lb-next').onclick = event => {
  event.stopPropagation();
  lbIndex = (lbIndex + 1) % lbGallery.length;
  renderLightbox();
};

$('#lightbox').addEventListener('click', event => {
  // Click outside image, arrows, close button and thumbnails = close lightbox
  if (!event.target.closest('.lightbox-content') && !event.target.closest('.lightbox-thumbs') && !event.target.closest('.lightbox-close')) {
    closeLightbox();
  }
});

$('.lightbox-content').addEventListener('click', event => event.stopPropagation());
/* ================= LIGHTBOX END ================= */

/* ================= SHIPMENT / DELIVERY START =================
   Delivery charge values come from HTML data-cost:
   Dhaka inside = 70
   Dhaka outside = 140
============================================================= */
$$('input[name="shipment"]').forEach(radio => {
  radio.addEventListener('change', event => {
    delivery = Number(event.target.dataset.cost);
    updateTotals();
  });
});
/* ================= SHIPMENT / DELIVERY END ================= */

/* ================= FLOATING CONTACT BUTTON START ================= */
$('#fab .fab-main').onclick = () => $('#fab').classList.toggle('collapsed');
/* ================= FLOATING CONTACT BUTTON END ================= */

/* ================= FORM VALIDATION START ================= */
$('#order').addEventListener('submit', event => {
  if (!document.querySelector('input[name="shipment"]:checked')) {
    event.preventDefault();
    alert('অনুগ্রহ করে Shipment নির্বাচন করুন: ঢাকার ভিতরে অথবা ঢাকার বাইরে।');
  }
});
/* ================= FORM VALIDATION END ================= */

/* ================= RENDER ALL START ================= */
function renderAll() {
  renderCart();
  renderSummary();
  renderRelated();
  updateTotals();
}

initSlider();
renderAll();
/* ================= RENDER ALL END ================= */





//test code eta remove korte hobe pore

async function loadAirtableData() {
  try {
    const res = await fetch("/.netlify/functions/get-site-data");
    const data = await res.json();

    console.log("Airtable Data:", data);
  } catch (error) {
    console.error("Airtable load error:", error);
  }
}

loadAirtableData();
