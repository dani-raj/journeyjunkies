// === DOM references ===
const menuToggler = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const imageGallery = document.getElementById('image-gallery');
const selectedImg = document.getElementById('selected-img');
const popUpGallery = document.getElementById('pop-up-gallery');
const imgCounter = document.getElementById('image-num-count');
const exitBtn = document.getElementById('exit-gallery-btn');
const tours = document.getElementById('tours');
const selectedTour = document.getElementById('tour-options');
const messageSentMsg = document.getElementById('sent-msg');

const form = document.getElementById('contact-form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const startingDate = document.getElementById('from-date');
const body = document.body;

// === State / constants ===
let imageNum = 0;
const MAX_IMAGES = 8;

const STORAGE_TOUR_KEY = 'tour-selected';
const STORAGE_DATE_KEY = 'starting-date';

// === Helpers ===
function todayISO() {
  return new Date().toISOString().split('T')[0]; // yyyy-mm-dd
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Load defaults (localStorage -> fallback values)
function applyStoredDefaults() {
  selectedTour.value = localStorage.getItem(STORAGE_TOUR_KEY) ?? 'cebu';
  startingDate.value = localStorage.getItem(STORAGE_DATE_KEY) ?? todayISO();
}

// Show “message sent” banner, then hide it after 5s
function msgSent() {
  setTimeout(() => {
    messageSentMsg.classList.remove('show');
  }, 5000);
}

// Mark a field invalid and display message
function setInvalid(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  formControl.classList.add('invalid');
  small.innerText = message;
}

// Mark a field valid (remove red state)
function setValid(input) {
  const formControl = input.parentElement;
  formControl.classList.remove('invalid');
}

function checkEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Validate the date field (used on change + submit)
function validateDate() {
  const selected = startingDate.value; // yyyy-mm-dd
  const today = todayISO();

  if (!selected) {
    setInvalid(startingDate, 'Please select a date');
    return false;
  }

  if (selected < today) {
    setInvalid(startingDate, "Please select a date that's not in the past");
    return false;
  }

  setValid(startingDate);
  return true;
}

// Validate form fields (used on submit)
function isValid() {
  let ok = true;

  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();

  // Name
  if (!usernameValue) {
    setInvalid(username, 'Please share your name with us');
    ok = false;
  } else {
    setValid(username);
  }

  // Email
  if (!emailValue) {
    setInvalid(email, "Don't forget to add your email address");
    ok = false;
  } else if (!checkEmail(emailValue)) {
    setInvalid(email, "That doesn't quite look like a valid email");
    ok = false;
  } else {
    setValid(email);
  }

  // Date
  if (!validateDate()) ok = false;

  return ok;
}

// === Mobile menu ===

// Toggle mobile menu open/close
menuToggler.addEventListener('click', () => {
  body.classList.toggle('open');
});

// Close menu when a nav item is clicked (mobile UX)
navLinks.addEventListener('click', (e) => {
  // Only close if the click came from a link inside the nav
  if (!e.target.closest('a')) return;
  body.classList.remove('open');
});

// === Gallery popup ===

// Open popup when clicking a gallery image (desktop only)
imageGallery.addEventListener('click', (e) => {
  const img = e.target.closest('.image');
  if (!img) return;
  if (window.innerWidth < 768) return;

  // ids are like "img1", "img6" -> take the numeric part
  imageNum = Number(img.id.slice(3));
  showFullImg(imageNum);
});

// Show the popup + render selected image
function showFullImg(num) {
  popUpGallery.classList.add('show');
  selectedImg.innerHTML = `<img src="./images/gallery0${num}.webp" alt="Selected gallery image">`;
  imgCounter.innerHTML = `${num}/${MAX_IMAGES}`;
}

// Handle next/prev navigation via click or keyboard
function getImage(event) {
  if (!popUpGallery.classList.contains('show')) return;

  const nextClicked = event.target?.closest?.('.next-arrow');
  const prevClicked = event.target?.closest?.('.previous-arrow');

  if (event.code === 'ArrowRight' || nextClicked) {
    imageNum = clamp(imageNum + 1, 1, MAX_IMAGES);
    showFullImg(imageNum);
  }

  if (event.code === 'ArrowLeft' || prevClicked) {
    imageNum = clamp(imageNum - 1, 1, MAX_IMAGES);
    showFullImg(imageNum);
  }
}

popUpGallery.addEventListener('click', getImage);
document.addEventListener('keydown', getImage);

// Close popup via X button or Escape
exitBtn.addEventListener('click', exitPopUpGallery);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') exitPopUpGallery();
});

function exitPopUpGallery() {
  if (!popUpGallery.classList.contains('show')) return;

  popUpGallery.classList.remove('show');
  imageNum = 0;
}

// === Tours selection -> set select + persist ===

// Clicking "Apply now" sets the select value and saves it
tours.addEventListener('click', (e) => {
  const btn = e.target.closest('.tour-btn');
  if (!btn) return;

  localStorage.setItem(STORAGE_TOUR_KEY, btn.id);
  selectedTour.value = btn.id;
});

// === Form validation + submit ===

// Live validate date and persist it if valid
startingDate.addEventListener('change', () => {
  if (!validateDate()) return;
  localStorage.setItem(STORAGE_DATE_KEY, startingDate.value);
});

// On page load: restore defaults
applyStoredDefaults();

// Submit: validate, show confirmation, reset, then restore defaults
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!isValid()) return;

  messageSentMsg.classList.add('show');
  msgSent();

  // Reset form values (this would also reset date/select), so we restore defaults after
  form.reset();
  applyStoredDefaults();

  // Clear validation state after successful submission
  setValid(username);
  setValid(email);
  setValid(startingDate);
});
