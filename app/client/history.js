const archiveField = document.querySelector('.pastIncidentsGrid');
const currentMonthLabel = document.querySelector('.archiveMonth');
const tooltip = document.querySelector('.tooltip');

let currentDate = new Date();
let currentMonth = currentDate.getMonth() + 1;
let currentYear = currentDate.getFullYear();
let month = currentMonth;
let year = currentDate.getFullYear();

function generateArchiveField() {
    archiveField.innerHTML = '';

    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < emptyDays; i++) {
        const div = document.createElement('div');
        div.classList.add('incidentDay', 'emptyDay');
        archiveField.appendChild(div);
    }

    const daysInMonth = lastDayOfMonth.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement('div');
        div.classList.add('incidentDay');

        const dayDate = new Date(currentYear, currentMonth - 1, day);
        const formattedDate = dayDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

        div.setAttribute('date', longDateFormat(dayDate));
        div.addEventListener('mouseenter', (e) => showTooltip(e, formattedDate, getDayStatus(dayDate, e)));
        div.addEventListener('click', (e) => showTooltip(e, formattedDate, getDayStatus(dayDate, e)));

        div.addEventListener('mouseleave', hideTooltip);

        archiveField.appendChild(div);
    }

    currentMonthLabel.textContent = getFullMonthNameInDutch(currentDate);
    createHistoryView();
}

function longDateFormat(d) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1);
    const day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    return `${year}-${month}-${day}`;
}

function getDayStatus(date, e = null) {
    const usableDate = longDateFormat(date);
    let response = "Geen informatie";
    let found = false;
    const monthKey = `${currentYear}-${currentMonth}`;

    if (buffer[monthKey].data && buffer[monthKey].data[usableDate] || (e.target.attributes.today && currentYear === year) == true) {
        let uptime;
        if (buffer[monthKey].data[usableDate])
            uptime = buffer[monthKey].data[usableDate].uptime;
        else if (e.target.attributes.today)
            uptime = api_response.currentDay.uptime;

        response = `uptime ${uptime}%`;
        tooltip.querySelector('#uptime').classList.remove('noInfo', 'online', 'partially', 'major');
        const uptimeParsed = parseInt(uptime);
        const color = (uptimeParsed === 100) ? 'online' : (uptimeParsed >= 99 && uptimeParsed <= 95) ? 'partially' : 'major';
        tooltip.querySelector('#uptime').classList.add(color);

        found = true;
    }

    if (!found) {
        tooltip.querySelector('#uptime').classList.add('noInfo');
    }

    return response;
}

function showTooltip(event, date, status) {
    tooltip.querySelector('#date').textContent = date;
    tooltip.querySelector('#uptime').textContent = status;
    tooltip.style.display = 'block';

    tooltip.style.left = `${event.pageX + 20}px`;
    tooltip.style.top = `${event.pageY - 80}px`;
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function getFullMonthNameInDutch(date) {
    const options = { month: 'long' };
    const formatter = new Intl.DateTimeFormat('nl-NL', options);
    return formatter.format(date);
}


function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentMonth = currentDate.getMonth() + 1;
    currentYear = currentDate.getFullYear();

    generateArchiveField();

    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 12 ? currentYear + 1 : currentYear;
    expandBuffer(nextYear, nextMonth > 12 ? 1 : nextMonth);
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentMonth = currentDate.getMonth() + 1;
    currentYear = currentDate.getFullYear();

    generateArchiveField();

    const prevMonth = currentMonth - 1;
    const prevYear = prevMonth < 1 ? currentYear - 1 : currentYear;
    expandBuffer(prevYear, prevMonth < 1 ? 12 : prevMonth);
}

document.getElementById("prevMonth").addEventListener('click', prevMonth);
document.getElementById("nextMonth").addEventListener('click', nextMonth);


function getUptimeColor(uptime) {
    if (uptime === 0) return '#838383';
    if (uptime === 100) return '#07ff6e';
    if (uptime > 0 && uptime < 95) return '#ff9900';
    if (uptime >= 95 && uptime < 100) return '#fbff00';
    return '#838383';
}

function updateUptimeDisplay(uptime, textFallback = "Geen informatie") {
    const uptimeCounter = document.querySelector('.uptimeCounter');
    uptimeCounter.textContent = (uptime > 0) ? `${uptime}%` : textFallback;
    uptimeCounter.style.color = getUptimeColor(uptime);
}

function createHistoryView() {
    const historyDays = document.querySelectorAll('.incidentDay');
    const monthKey = `${currentYear}-${currentMonth}`;



    const dayDate = JSONdata[0].date.split('/')[0] + "-" + JSONdata[0].date.split('/')[1];

    if (buffer[monthKey].data.length !== 0) {
        console.log(dayDate === monthKey);
        updateUptimeDisplay(buffer[monthKey].globalUptime);
    } else if (dayDate === monthKey) {
        updateUptimeDisplay(JSONdata[0].uptime);
    } else {
        updateUptimeDisplay(0);
    }

    if (buffer[monthKey].data.length !== 0) {
        historyDays.forEach(day => {

            Object.entries(buffer[monthKey].data).forEach(([date, details]) => {
                if (day.getAttribute('date') == date) {
                    const dayData = details.downtime;

                    if (dayData.downtime > 5) {
                        day.classList.add('major');
                    } else if (dayData.downtime > 0) {
                        day.classList.add('partially');
                    } else {
                        day.classList.add('online');
                    }
                }
            });
        });
    }


    const today = new Date;
    let month = today.getMonth() + 1;
    if (currentMonth === month && year === currentYear) {
        let day = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();

        console.log(day);
        document.querySelector(`[date="${currentYear}-${currentMonth}-${day}"]`).classList.add("online");
        document.querySelector(`[date="${currentYear}-${currentMonth}-${day}"]`).setAttribute('today', true)
    }
};