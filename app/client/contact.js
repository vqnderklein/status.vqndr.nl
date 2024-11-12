// Set up event listeners for each contact button
const contactBttn = document.querySelectorAll('.contact-bttn');

contactBttn.forEach(button => {
    button.addEventListener('click', () => openPoppup());
});

// Function to show the popup and blur the background
function openPoppup() {
    document.querySelector('.contactPoppup').style.display = 'flex';
    document.querySelector('body>section.bodyWrapper').style.filter = 'blur(4px)';
}

// Close the popup when clicking outside the form
document.querySelector('.contactPoppup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) { // Only close if clicking on the background, not inside the form
        closePoppup();
    }
});

// Stop event propagation when clicking inside the form
document.querySelector('.contactPoppup form').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Function to hide the popup and remove the blur effect
function closePoppup() {
    document.querySelector('.contactPoppup').style.display = 'none';
    document.querySelector('body>section.bodyWrapper').style.filter = 'blur(0px)';
}