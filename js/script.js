let menuToggler = document.querySelector('.menu-toggle');
let navLink = document.querySelector('.nav-links');
let body = document.querySelector('body');
let imageGallery = document.getElementById('image-gallery')
let selectedImg = document.getElementById('selected-img')
let popUpGallery = document.getElementById('pop-up-gallery')
let imgCounter = document.getElementById('image-num-count')
let arrow = document.getElementsByClassName('arrow');
let arrowArr = Array.from(arrow);
let exitBtn = document.getElementById('exit-gallery-btn');
let tours = document.getElementById('tours');
let selectedTour = document.getElementById('tour-options');
let messageSentMsg = document.getElementById('sent-msg');

const form = document.getElementById('contact-form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message')
const startingDate = document.getElementById('from-date');

let imageNum = 0;

// Menu toggler can open and hide the menu with a click on it
menuToggler.addEventListener('click', function(){
    body.classList.toggle('open');
})

// Navlinks can also hide the menu with a click on them
navLink.addEventListener('click', function(){
    body.classList.toggle('open');
})

// To show the images in a bigger size, we give them an event listener that 
// activates if we click on an image and if the browser window is bigger than 768px.
// We have to get the 3rd character of the image's name, because their file names are like "img1" or "img6", and we only wan't to get the number.
imageGallery.addEventListener('click', (e) => {
    e.preventDefault() 
    if (e.target.classList.contains('image') && window.innerWidth >= 768) {
        imageNum = parseInt(e.target.id.charAt(3))
        showFullImg(imageNum)
    }
})

// First we set the pop-up gallery to visible and we set the selected image to be presented in a bigger size
function showFullImg(imageNum) {
    popUpGallery.classList.add('show')
    selectedImg.innerHTML = `<img src="./images/gallery0${imageNum}.jpg"></img>`
    imgCounter.innerHTML = `${imageNum}/8`
}

// Users can get the previous or the next image of the gallery by whether clicking the arrow buttons or hitting the next/prev. keys.
popUpGallery.addEventListener('click', event => getImage(event))
document.addEventListener("keydown", event => getImage(event))

// The function only works if the pop up gallery is being shown and if there is a previous/next image
function getImage(event) {
    if (popUpGallery.classList.contains("show")) {
        if (event.code === 'ArrowRight' || event.target.classList.contains('next-arrow')) {
            imageNum++
            if (imageNum > 8) {
                 imageNum = 8;
            }
            showFullImg(imageNum)
        } else if (event.code === 'ArrowLeft' || event.target.classList.contains('previous-arrow')) {
            imageNum--
             if (imageNum < 1) {
                 imageNum = 1;
             }
             showFullImg(imageNum) 
        }
    }
}

// Clicking on the X button or hitting Escape when the pop-up gallery is being shown, we set it to invisible
exitBtn.addEventListener('click', event => exitPopUpGallery(event))

document.addEventListener('keydown', event => {
    if (event.code === "Escape") {
        exitPopUpGallery(event)
    }
})

function exitPopUpGallery(event) {
    if (popUpGallery.classList.contains("show")) {
        popUpGallery.classList.remove("show")
        imageNum = 0;
    }
}

// Selecting a tour option by clicking 'Apply now" will set the selected tour option in the contact form.
// And we also save it to the localStorage so if the user refreshes the page, the value won't get lost.
tours.addEventListener('click', (e) => {
    if (e.target.classList.contains("tour-btn")) {
        localStorage.setItem('tour-selected', e.target.id)
        selectedTour.value = e.target.id
    }
})

// FROM VALIDATION
form.addEventListener('submit', e => {
    e.preventDefault();
    isValid();
})

// Checking if the user sets the starting date of their booking with a valid date (past dates shouldn't be selected).
startingDate.addEventListener('change', (e) => {
    let startDate = e.target.value;
    let selectedStartDate = new Date(startDate).toISOString().split('T')[0];
    let today = new Date().toISOString().split('T')[0];

    if (selectedStartDate < today) {
        setInvalid(startingDate, 'Please select a date that\'s not in the past')
    }
    localStorage.setItem('starting-date', selectedStartDate)
})

// So when the page loads, it first checks if there's a selected tour in the localStorage. If there isn't, we set it to the default Cebu tour.
// We also do the same with the starting date. If there isn't a date saved in localStorage, we set it to the current date.
selectedTour.value = localStorage.getItem('tour-selected') !== null ? localStorage.getItem('tour-selected') : 'cebu'
startingDate.value = localStorage.getItem('starting-date') !== null ? localStorage.getItem('starting-date') : (new Date()).toISOString().split('T')[0];

function isValid() {
    //Removing whitespace
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();

    // If user tries to submit the form without giving us their name, we show an error message.
    // But if there's a username, we remove error message. (if there was one)
    if (usernameValue === '') {
        setInvalid(username, 'Please share your name with us');
    } else {
        setValid(username)
    }

    // We also check if they give us their e-mail address, and if it's a valid one.
    if (emailValue === '') {
        setInvalid(email, 'Don\'t forget to add your email address');
    } else if (!checkEmail(emailValue)) {
        setInvalid(email, 'That doesn\'t quite look like a valid email');
    } else {
        setValid(email);
    }
}

function checkEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// The function receives the field's name and the message accordingly.
function setInvalid(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.classList.add("invalid");
    small.innerText = message;
}

// If every required input field is valid, we let the user know that their booking was successfull.
function setValid(input, e) {
	const formControl = input.parentElement;
	formControl.classList.remove("invalid");
    messageSentMsg.classList.add("show")
    msgSent()
}

// After 5s we remove the message.
function msgSent() {
    setTimeout(function(){
        messageSentMsg.classList.remove("show")
    }, 5000);
}

