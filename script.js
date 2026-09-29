/* ============ ELORA — site interactions ============ */

// ←←← EDIT: put your WhatsApp business number here (country code + number, no +, no spaces)
const WHATSAPP_NUMBER = "911234567890"; // DUMMY placeholder — replace with real number

const WA_MESSAGE = encodeURIComponent("Hi Elora! I'd like to order the Emergency Mini-Kit 💕");
const WA_LINK = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + WA_MESSAGE;

(function () {
  "use strict";

  // --- Wire every WhatsApp CTA to the real wa.me link ---
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", WA_LINK);
  });

  // --- Mobile nav toggle ---
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Reveal-on-scroll ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything if IntersectionObserver is unavailable
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // --- FAQ accordion ---
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // Close any other open item
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- Subtle nav shadow on scroll ---
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.style.boxShadow = window.scrollY > 10
        ? "0 8px 24px -12px rgba(74,36,64,0.18)"
        : "none";
    }, { passive: true });
  }
})();

/* ============ ELORA — cart, shop grid, checkout ============ */
(function () {
  "use strict";

  var CART_KEY = "elora_cart";
  var hasCatalog = typeof PRODUCTS !== "undefined" && typeof getProduct === "function" && typeof formatINR === "function";

  function $(id) { return document.getElementById(id); }

  /* ---------- Cart state ---------- */
  function getCart() {
    try {
      var c = JSON.parse(localStorage.getItem(CART_KEY));
      return (c && typeof c === "object") ? c : {};
    } catch (e) { return {}; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartEntries() {
    var cart = getCart(), out = [];
    Object.keys(cart).forEach(function (id) {
      var p = hasCatalog ? getProduct(id) : null;
      var qty = parseInt(cart[id], 10);
      if (p && qty > 0) out.push({ product: p, qty: qty });
    });
    return out;
  }
  function cartCount() {
    return cartEntries().reduce(function (s, e) { return s + e.qty; }, 0);
  }
  function cartSubtotal() {
    return cartEntries().reduce(function (s, e) { return s + e.product.price * e.qty; }, 0);
  }

  /* ---------- Badge ---------- */
  function updateCartBadge() {
    var badge = $("cartCount");
    if (!badge) return;
    var n = cartCount();
    badge.textContent = n;
    badge.classList.toggle("show", n > 0);
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Drawer ---------- */
  function openDrawer() {
    var d = $("cartDrawer"), o = $("drawerOverlay");
    if (!d || !o) return;
    renderCart();
    d.classList.add("open");
    o.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    var d = $("cartDrawer"), o = $("drawerOverlay");
    if (d) d.classList.remove("open");
    if (o) o.classList.remove("open");
    document.body.style.overflow = "";
  }

  function renderCart() {
    var box = $("cartItems"), foot = $("cartFoot"), sub = $("cartSubtotal");
    if (!box) return;
    var entries = cartEntries();
    if (!entries.length) {
      box.innerHTML =
        '<div class="empty-cart"><p>Your cart is empty.</p>' +
        '<a class="btn" href="shop.html">Shop Elora →</a></div>';
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "";
    box.innerHTML = entries.map(function (e) {
      var p = e.product;
      return '<div class="cart-item">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="eloraProdFallback(this)" data-ph="' + p.name + '" />' +
        '<div class="ci-info">' +
          '<div class="ci-name">' + p.name + '</div>' +
          '<div class="ci-price">' + formatINR(p.price) + ' each</div>' +
          '<div class="ci-row"><span class="stepper">' +
            '<button type="button" data-dec="' + p.id + '" aria-label="Decrease quantity">−</button>' +
            '<span>' + e.qty + '</span>' +
            '<button type="button" data-inc="' + p.id + '" aria-label="Increase quantity">+</button>' +
          '</span>' +
          '<button type="button" class="ci-remove" data-del="' + p.id + '">Remove</button></div>' +
        '</div></div>';
    }).join("");
    if (sub) sub.textContent = formatINR(cartSubtotal());
  }

  function addToCart(id, qty) {
    if (!hasCatalog || !getProduct(id)) return;
    var cart = getCart();
    cart[id] = (parseInt(cart[id], 10) || 0) + (qty || 1);
    saveCart(cart);
    updateCartBadge();
    renderCart();
    toast("Added to cart 💕");
  }

  /* ---------- Drawer wiring (guarded) ---------- */
  var cartBtn = $("cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openDrawer);
  var drawerClose = $("drawerClose");
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  var overlay = $("drawerOverlay");
  if (overlay) overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });
  var contShop = $("continueShopping");
  if (contShop) contShop.addEventListener("click", function (e) {
    // If already on the shop page, just close the drawer instead of reloading
    if (window.location.pathname.split("/").pop() === "shop.html") {
      e.preventDefault();
      closeDrawer();
    }
  });

  var cartItems = $("cartItems");
  if (cartItems) {
    cartItems.addEventListener("click", function (e) {
      var t = e.target;
      if (!(t instanceof HTMLElement)) return;
      var inc = t.getAttribute("data-inc"),
          dec = t.getAttribute("data-dec"),
          del = t.getAttribute("data-del");
      if (!inc && !dec && !del) return;
      var cart = getCart();
      if (inc) cart[inc] = (parseInt(cart[inc], 10) || 0) + 1;
      if (dec) {
        cart[dec] = (parseInt(cart[dec], 10) || 1) - 1;
        if (cart[dec] <= 0) delete cart[dec];
      }
      if (del) delete cart[del];
      saveCart(cart);
      updateCartBadge();
      renderCart();
      renderSummary(); // keep checkout summary in sync if open on that page
    });
  }

  /* ---------- Shop product grid ---------- */
  var grid = $("productGrid");
  if (grid && hasCatalog) {
    grid.innerHTML = PRODUCTS.map(function (p) {
      var off = Math.round((1 - p.price / p.mrp) * 100);
      return '<article class="product-card">' +
        '<div class="pc-media">' +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="eloraProdFallback(this)" data-ph="' + p.name + '" />' +
          (p.badge ? '<span class="pc-badge">' + p.badge + '</span>' : '') +
        '</div>' +
        '<div class="pc-body">' +
          '<h3>' + p.name + '</h3>' +
          '<p class="pc-tag">' + p.tagline + '</p>' +
          '<details class="pc-contents"><summary>What\u2019s inside</summary><ul>' +
            p.contents.map(function (c) { return "<li>" + c + "</li>"; }).join("") +
          '</ul></details>' +
          '<div class="pc-price-row">' +
            '<span class="pc-price">' + formatINR(p.price) + '</span>' +
            '<span class="pc-mrp">' + formatINR(p.mrp) + '</span>' +
            '<span class="pc-off">' + off + '% off</span>' +
          '</div>' +
          '<button type="button" class="btn" data-add="' + p.id + '" style="width:100%">Add to Cart</button>' +
        '</div></article>';
    }).join("");
    grid.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        addToCart(btn.getAttribute("data-add"), 1);
      });
    });
  }

  /* ---------- Checkout page ---------- */
  var form = $("checkoutForm");
  var upiRaw = (typeof UPI_ID !== "undefined") ? UPI_ID : "elora@upi";

  function renderSummary() {
    var box = $("summaryItems");
    if (!box || !hasCatalog) return;
    var entries = cartEntries();
    var main = $("checkoutMain"), empty = $("emptyNotice");
    if (!entries.length) {
      if (main) main.style.display = "none";
      if (empty) empty.style.display = "";
      return;
    }
    if (main) main.style.display = "";
    if (empty) empty.style.display = "none";
    box.innerHTML = entries.map(function (e) {
      var p = e.product;
      return '<div class="summary-item">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="eloraProdFallback(this)" data-ph="' + p.name + '" />' +
        '<div class="si-info"><strong>' + p.name + '</strong><span>Qty ' + e.qty + ' × ' + formatINR(p.price) + '</span></div>' +
        '<div class="si-total">' + formatINR(p.price * e.qty) + '</div>' +
      '</div>';
    }).join("");
    var sub = cartSubtotal();
    var sSub = $("sumSubtotal"), sTot = $("sumTotal");
    if (sSub) sSub.textContent = formatINR(sub);
    if (sTot) sTot.textContent = formatINR(sub);
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (done) done();
  }

  var upiChip = $("upiChip");
  if (upiChip) {
    var upiIdEl = upiChip.querySelector(".upi-id");
    if (upiIdEl) upiIdEl.textContent = upiRaw;
    upiChip.addEventListener("click", function (e) {
      e.preventDefault();
      copyText(upiRaw, function () {
        var note = upiChip.querySelector("small");
        if (note) {
          var orig = note.textContent;
          note.textContent = "copied ✓";
          setTimeout(function () { note.textContent = orig; }, 1500);
        }
      });
    });
  }

  function setInvalid(fieldId, bad) {
    var f = $(fieldId);
    if (!f) return;
    var wrap = f.closest(".field");
    if (wrap) wrap.classList.toggle("invalid", !!bad);
  }

  function validateCheckout() {
    var ok = true;
    var name = ($("fName") && $("fName").value.trim()) || "";
    var phoneRaw = ($("fPhone") && $("fPhone").value) || "";
    var phone = phoneRaw.replace(/\D/g, "").slice(-10);
    var address = ($("fAddress") && $("fAddress").value.trim()) || "";
    var city = ($("fCity") && $("fCity").value.trim()) || "";
    var pinRaw = ($("fPin") && $("fPin").value) || "";
    var pin = pinRaw.replace(/\D/g, "");

    if ($("fPhone")) $("fPhone").value = phone;
    if ($("fPin")) $("fPin").value = pin;

    var checks = [
      ["fName", name.length >= 2],
      ["fPhone", /^[6-9]\d{9}$/.test(phone)],
      ["fAddress", address.length >= 8],
      ["fCity", city.length >= 2],
      ["fPin", /^\d{6}$/.test(pin)]
    ];
    checks.forEach(function (c) {
      setInvalid(c[0], !c[1]);
      if (!c[1]) ok = false;
    });
    return ok ? { name: name, phone: phone, address: address, city: city, pin: pin } : null;
  }

  if (form) {
    // Live-clear errors while typing
    ["fName", "fPhone", "fAddress", "fCity", "fPin"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", function () { setInvalid(id, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = validateCheckout();
      if (!data) {
        toast("Please fix the highlighted fields");
        return;
      }
      var entries = cartEntries();
      if (!entries.length) {
        toast("Your cart is empty");
        return;
      }
      var payEl = document.querySelector('input[name="pay"]:checked');
      var payLabel = (payEl && payEl.value === "upi") ? "UPI" : "Cash on Delivery";

      var lines = ["Hi Elora! I'd like to place an order 💕", ""];
      entries.forEach(function (en) {
        lines.push("• " + en.product.name + " × " + en.qty + " — " + formatINR(en.product.price * en.qty));
      });
      lines.push(
        "",
        "Subtotal: " + formatINR(cartSubtotal()),
        "Shipping: FREE 🎉",
        "Payment: " + payLabel,
        "",
        "Name: " + data.name,
        "Phone: " + data.phone,
        "Address: " + data.address + ", " + data.city + " — " + data.pin
      );
      var link = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(link, "_blank");

      // Clear cart and show success
      saveCart({});
      updateCartBadge();
      var main = $("checkoutMain"), success = $("orderSuccess");
      if (main) main.style.display = "none";
      if (success) success.classList.add("show");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    renderSummary();
  }

  /* ---------- Boot ---------- */
  updateCartBadge();
  renderCart();
})();
