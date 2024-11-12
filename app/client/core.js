const dataRow = document.querySelector('.statusRow');
const pageSelector = document.querySelectorAll('.pageSelector');
let currentPage = 1;
let JSONdata = [];

pageSelector.forEach(page => {
    page.addEventListener('click', () => {
        currentPage = (page.getAttribute('data-page-name') == 'live') ? 1 : 2;
        changePage(currentPage);
    });
});

let hideTooltipTimeout;


console.log(document.querySelector('section.bodyWrapper>header'))

document.querySelector('section.bodyWrapper>nav>header').addEventListener('mouseover', () => {

    console.log('test');

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

function returnStatusElement(downtime) {

    let span = document.createElement('span');

    span.addEventListener('click', (e) => createEventHover(e));
    span.addEventListener('mouseover', (e) => createEventHover(e));

    document.querySelector('.holder').addEventListener('mouseout', (e) => {

        document.querySelector('.toolTip').style.display = 'none';

    });


    if (downtime >= 5)
        span.classList.add('major');
    else if (downtime < 5 && downtime > 0)
        span.classList.add('partially');
    else if (downtime == 0)
        span.classList.add('online');

    span.classList.add('statusDay')

    return span;
}

function positionToolTip(clickedElement) {
    let statusDays = document.querySelectorAll('.statusDay');
    const container = document.querySelector('.statusRow');
    const containerRect = container.getBoundingClientRect();

    if (statusDays.length === 0) {
        console.error('No statusDays found!');
        return;
    }

    const firstStatusDay = statusDays[0].getBoundingClientRect();
    const lastStatusDay = statusDays[statusDays.length - 1].getBoundingClientRect();

    if (!(clickedElement instanceof Element)) {
        console.error('clickedElement is not a valid DOM element.');
        return;
    }

    const clickedRect = clickedElement.getBoundingClientRect();
    const centerX = clickedRect.left + clickedRect.width / 2 - 45;

    let positionX = centerX;

    const padding = 2 * parseFloat(getComputedStyle(container).fontSize);

    if (positionX < firstStatusDay.left + padding) {
        positionX = firstStatusDay.left + padding;
    } else if (positionX + 150 > lastStatusDay.right - padding) {
        positionX = lastStatusDay.right - 150 + padding;
    }

    const toolTip = document.querySelector('.toolTip');
    toolTip.style.left = `${positionX - containerRect.left}px`;
    toolTip.style.display = 'block';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('nl-NL', { month: 'short' });
    return `${day} ${month}.`;
}

function editToolTip(date) {
    const length = JSONdata.length;
    console.log(formatDate(date));

    const tooltipHeader = document.querySelector('.toolTip>header');
    const tooltipText = document.querySelector('.toolTip>p');

    tooltipHeader.textContent = formatDate(date);

    tooltipText.classList.remove('noInfo', 'online', 'partially', 'major');

    let dateFound = false;

    for (let i = 0; i < length; i++) {
        console.log(date, JSONdata[i].date);

        if (date === JSONdata[i].date) {
            tooltipText.textContent = "uptime " + JSONdata[i].uptime + "%";
            dateFound = true;

            if (JSONdata[i].uptime > 95 && JSONdata[i].uptime <= 99) {
                tooltipText.classList.add('partially');
            } else if (JSONdata[i].uptime > 0 && JSONdata[i].uptime <= 95) {
                tooltipText.classList.add('major');
            } else {
                tooltipText.classList.add('online');
            }
            break;
        }
    }

    if (!dateFound) {
        tooltipText.textContent = "Geen informatie";
        tooltipText.classList.add('noInfo');
    }
}



function createEventHover(e) {
    if (!e.target.classList.contains('statusDay')) {
        return;
    }

    positionToolTip(e.target);
    editToolTip(e.target.dataset.date)
}


function returnData90DaysAgo() {
    const today = new Date();
    today.setDate(today.getDate() - 89);
    const todayParts = today.toDateString().split(' ');
    return `${todayParts[2]} ${todayParts[1]}. `;
}

function createWebserviceBar(data) {
    let span = document.createElement('span');

    console.log(data);

    //History data
    for (var i = 88; i >= 0; i--) {
        if (data.history.history_days[i] !== undefined) {
            span = returnStatusElement(data.history.history_days[i].downtime);
        } else {
            span = returnStatusElement(-1)
        }
        var offset = -1 - i;
        span.setAttribute('data-date', getDate(offset));
        dataRow.appendChild(span);
    }

    //Today
    span = returnStatusElement(data.currentDay.downtime);
    span.setAttribute('data-date', getDate());
    dataRow.appendChild(span);
}

function returnGroupedInformation(data) {
    const statusSummary = {};

    const serviceGroups = {
        "Mail": ["IMAP", "SMTP"],
        "Applicaties": ["contact", "wordle"],
        "Database": ["db01", "db02"],
        "Hosting": ["web01", "web02"]
    };

    Object.keys(serviceGroups).forEach(groupName => {
        const groupServices = serviceGroups[groupName];
        const onlineCount = groupServices.filter(service => data[service] === "online").length;

        if (onlineCount === groupServices.length) {
            statusSummary[groupName] = "online";
        } else if (onlineCount > 0) {
            statusSummary[groupName] = "partially";
        } else {
            statusSummary[groupName] = "major";
        }
    });

    return statusSummary;
}

function changeStatusIcons(information) {
    Object.keys(information).forEach(key => {
        const htmlIcon = {
            "major": `<path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path>`,
            "partially": `<path fill="currentColor" d="M10.03 3.659c.856-1.548 3.081-1.548 3.937 0l7.746 14.001c.83 1.5-.255 3.34-1.969 3.34H4.254c-1.715 0-2.8-1.84-1.97-3.34zM12.997 17A.999.999 0 1 0 11 17a.999.999 0 0 0 1.997 0m-.259-7.853a.75.75 0 0 0-1.493.103l.004 4.501l.007.102a.75.75 0 0 0 1.493-.103l-.004-4.502z"></path>`,
            "online": `<path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd"></path>`
        };
        document.querySelector(`[data-serviceName=${key.toLowerCase()}]>svg`).innerHTML = htmlIcon[information[key]];
        document.querySelector(`[data-serviceName=${key.toLowerCase()}]`).classList.add(information[key]);
    });
}

function getDate(offset = 0) {
    const today = new Date();
    today.setDate(today.getDate() + offset);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`;
}


function prepEnv(information) {
    let newForm = [];

    const today = {
        "date": getDate(),
        "downtime": information.currentDay.downtime,
        "uptime": information.currentDay.uptime
    };
    newForm.push(today);
    const oldDates = information.history.history_days;
    newForm = newForm.concat(oldDates);

    JSONdata = newForm;
}


window.onload = function() {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://status.vqndr.nl/app/modules/db_provider.php', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);

            //Adjust uptime counter
            document.querySelector('#uptimePer').textContent = data.history.globalUptime;

            //Adjust uptime date
            document.querySelector('.statusDate>p:first-child').textContent = returnData90DaysAgo();

            createWebserviceBar(data);

            const information = returnGroupedInformation(data.currentDay.currentServiceStatus);
            changeStatusIcons(information);

            prepEnv(data);
        }
    }
    xhr.send();
}