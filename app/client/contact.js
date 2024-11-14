const contactBttn = document.querySelectorAll('.contact-bttn');

contactBttn.forEach(button => {
    button.addEventListener('click', () => openPoppup());
});

function openPoppup() {
    document.querySelector('.contactPoppup').style.display = 'flex';
    document.querySelector('body>section.bodyWrapper').style.filter = 'blur(4px)';
    document.querySelector('body').style.position = 'fixed';
}

document.querySelector('.contactPoppup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closePoppup();
    }
});

document.querySelector('.contactPoppup form').addEventListener('click', (e) => {
    e.stopPropagation();
});

function closePoppup() {
    document.querySelector('.contactPoppup').style.display = 'none';
    document.querySelector('body>section.bodyWrapper').style.filter = 'blur(0px)';
    document.querySelector('body').style.position = 'static';

}