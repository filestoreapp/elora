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
