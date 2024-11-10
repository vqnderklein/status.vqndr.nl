const dataRow = document.querySelector('.statusRow');
const pageSelector = document.querySelectorAll('.pageSelector');
let currentPage = 1;

pageSelector.forEach(page => {
    page.addEventListener('click', () => {
        currentPage = (page.getAttribute('data-page-name') == 'live') ? 1 : 2;
        changePage(currentPage);
    });
});

function changePage(currentPage) {
    if (currentPage == 2) {
        document.querySelector('.live').style.display = 'none';
        document.querySelector('.history').style.display = 'block';
    } else {
        document.querySelector('.live').style.display = 'block';
        document.querySelector('.history').style.display = 'none';
    }
}

let counter = 0;
for (var i = 0; i < 90; i++) {

    let span = document.createElement('span');
    span.classList.add('statusDay');

    dataRow.appendChild(span);

    counter++;

}