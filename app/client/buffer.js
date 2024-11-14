let buffer = {};
let targetMonth = new Date().getMonth() + 1;
let targetYear = new Date().getFullYear();

function loadInitialBuffer() {
    for (let i = -2; i <= 2; i++) {
        let monthToLoad = targetMonth + i;
        let yearToLoad = targetYear;

        if (monthToLoad < 1) {
            monthToLoad += 12;
            yearToLoad -= 1;
        } else if (monthToLoad > 12) {
            monthToLoad -= 12;
            yearToLoad += 1;
        }

        fetchData(yearToLoad, monthToLoad, 'initial');
    }
}

function expandBuffer(year, month) {
    const monthKey = `${year}-${month}`;

    if (buffer[monthKey]) {
        console.log("Month already loaded in buffer.");
        return;
    }

    fetchData(year, month, 'expand');

    maintainBuffer();
}

function fetchData(year, month, action) {
    const url = `https://status.vqndr.nl/app/modules/db_history_provider.php?year=${year}&month=${month}&action=${action}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                console.error(data.error);
                return;
            }

            const monthKey = `${year}-${month}`;
            buffer[monthKey] = buffer[monthKey] || {};

            if (data[monthKey] && typeof data[monthKey] === 'object') {
                const monthData = data[monthKey];

                for (const date in monthData) {
                    if (monthData.hasOwnProperty(date)) {
                        buffer[monthKey][date] = monthData[date];
                    }
                }
            } else {
                console.error('No data available for the requested month or empty array:', data[monthKey]);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


function maintainBuffer() {
    let minMonth = targetMonth - 2;
    let maxMonth = targetMonth + 2;
    let minYear = targetYear;
    let maxYear = targetYear;

    if (minMonth < 1) {
        minMonth += 12;
        minYear -= 1;
    }
    if (maxMonth > 12) {
        maxMonth -= 12;
        maxYear += 1;
    }

    for (let i = -2; i <= 2; i++) {
        let monthToLoad = targetMonth + i;
        let yearToLoad = targetYear;

        if (monthToLoad < 1) {
            monthToLoad += 12;
            yearToLoad -= 1;
        } else if (monthToLoad > 12) {
            monthToLoad -= 12;
            yearToLoad += 1;
        }

        const monthKey = `${yearToLoad}-${monthToLoad}`;
        if (!buffer[monthKey]) {
            fetchData(yearToLoad, monthToLoad, 'expand');
        }
    }
}

loadInitialBuffer();