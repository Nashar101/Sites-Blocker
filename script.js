const generateHTML = pageName => {
    return (
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="UTF-8">\n' +
        '<title>Blocked</title>\n' +
        '<link rel="stylesheet" type="text/css" href="style.css">\n' +
        '</head>\n' +
        '<body style="align-items: center; justify-content: center; width: 100%;">\n' +
        '<div style="border-bottom: 7px solid black;">\n' +
        '</div>\n' +
        '<div id="runner">\n' +
        '</div>\n' +
        '<div id="road">\n' +
        '</div>\n' +
        '<div style="border-bottom: 7px solid black; height: 200px">\n' +
        '</div>\n' +
        '<div style="width: 100%; height:0px;">\n' +
        '</div>\n' +
        '<div style="animation: myAnim 2s ease 0s 1 normal forwards; text-align: center; position: center">Sorry this website has been blocked</div>\n' +
        '<div>\n' +
        '<script type="text/javascript" src="Content.js">' +
        '</script>\n' +
        '<div id="site" style="text-align: center; animation: myAnim 2s ease 0s 1 normal forwards;">\n' +
        '</div>\n' +
        '</div>\n' +
        '<div class="cloud">\n' +
        '</div>\n' +
        '</body>\n' +
        '</html>'
    );
};

var sites = []
current_user = null
token = null
const login = () => {
}

boot()
function boot(){
    fetchData()
}
function getToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('token', (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.token);
        });
    });
}
 async function fetchData(){
            console.log("im here")
            token = await getToken()
            try{
                console.log(token)
                const response = await fetch("http://localhost:3000/api/v1/sites/get_sites", {
                    method: 'get',
                    headers: {
                        "content-type": 'application/json',
                        Authorization: token,
                    }
                })
                console.log(response)
                if(response.ok){
                    const json = await response.json();
                    console.log(json)
                    sites = json.sites
                    console.log(sites)
                    current_user = json.user
                }
                else{
                    throw response;
                }
            } catch (e){
                console.log("An error occured" + e);
            } finally {
                block()
            }

}
function display() {
    var store = "<table class=\"table table-striped table-dark\">\n" +
        "    <thead>\n" +
        "    <tr>\n" +
        "        <th scope=\"col\">#</th>\n" +
        "        <th scope=\"col\">Site URL</th>\n" +
        "        <th scope=\"col\">Duration Type</th>\n" +
        "        <th scope=\"col\">Time Remaining</th>\n" +
        "        <th scope=\"col\"></th>\n" +
        "    </tr>\n" +
        "    </thead>\n" +
        "    <tbody>";

    for (let i = 0; i < sites.length; i++) {
        if(sites[i].duration == "Timed") {
            store += "<tr>\n" +
                "        <th scope=\"row\"> " + i + "</th>\n" +
                "        <td>" + sites[i].url + "</td>\n" +
                "        <td>" + sites[i].duration + "</td>\n" +
                "        <td>" + "<div id='timer " + i + "' style='display: flex'>" +
                "<div id='days " + i + "' style='display: flex'>" + "</div>" +
                ":" + "<div id='hours " + i + "' style='display: flex'>" + "</div>" +
                ":" + "<div id='minutes " + i + "' style='display: flex'>" + "</div>" +
                ":" + "<div id='seconds " + i + "' style='display: flex'>" + "</div>" +
                "</div>" + "</td>\n" +
                "<td>" + "<button class='btn btn-secondary' id='delete " + i + "' style='display: flex' value=\"" + sites[i].id + "\">×" + "</button>" + "</td>"
            "    </tr>";
        }
        else{
            store += "<tr>\n" +
                "        <th scope=\"row\"> " + i + "</th>\n" +
                "        <td>" + sites[i].url + "</td>\n" +
                "        <td>" + sites[i].duration + "</td>\n" +
                "        <td>" + "<div id='timer " + i + "' style='display: flex'>" +
                "<div id='days " + i + "' style='display: flex'>" + "--</div>" +
                ":" + "<div id='hours " + i + "' style='display: flex'>" + "--</div>" +
                ":" + "<div id='minutes " + i + "' style='display: flex'>" + "--</div>" +
                ":" + "<div id='seconds " + i + "' style='display: flex'>" + "--</div>" +
                "</div>" + "</td>\n" +
                "<td>" + "<button class='btn btn-secondary' id='delete " + i + "' style='display: flex' value=\"" + sites[i].id + "\">×" + "</button>" + "</td>"
            "    </tr>";
        }
    }
    store += "</tbody>\n" + "</table>";
//btn btn-secondary
    // Set the HTML content after the loop to avoid setting HTML multiple times
    document.getElementById('display').innerHTML = store;

    // Add event listeners to delete buttons after they are created
    const deleteButtons = document.querySelectorAll('.btn.btn-secondary');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log(" i was clicked")
            unBlock(event.target.value)
            // Implement delete functionality here
        });
    });

    // Start timer for each site
    for (let i = 0; i < sites.length; i++) {
        if(sites[i].duration == "Timed")
            startTimer(i, sites[i].expiration_date, sites[i].id);
    }
}


async function unBlock(id){
    console.log("im here")
    token = await getToken()
    try{
        console.log(token)
        const response = await fetch("http://localhost:3000/api/v1/sites/" + id, {
            method: 'delete',
            headers: {
                "content-type": 'application/json',
                Authorization: token,
            }
        })
        console.log(response)
        if(response.ok){
            fetchData()
        }
        else{
            throw response;
        }
    } catch (e){
        console.log("An error occured" + e);
    } finally {
        block()
    }

}
function startTimer(number, duedate, id) {
    try {
        const intervalId = setInterval(function () {
            var d = (new Date(duedate)-3600000) - Date.now();

            if (d < 0) {
                // Timer expired
                document.getElementById('days ' + number).innerHTML = 0;
                document.getElementById('hours ' + number).innerHTML = 0;
                document.getElementById('minutes ' + number).innerHTML = 0;
                document.getElementById('seconds ' + number).innerHTML = 0;
                clearInterval(intervalId); // Stop the interval
                unBlock(id)
                return;
            }

            // Retrieve the elements
            const daysElement = document.getElementById('days ' + number);
            const hoursElement = document.getElementById('hours ' + number);
            const minutesElement = document.getElementById('minutes ' + number);
            const secondsElement = document.getElementById('seconds ' + number);

            // Check if elements are found
            if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
                clearInterval(intervalId); // Stop the interval if any element is not found
                return;
            }

            // Calculate time components
            let days = display_days(d);
            let hours = display_hours(d);
            let minutes = display_minutes(d);
            let seconds = display_seconds(d);

            // Update elements
            daysElement.innerHTML = days;
            hoursElement.innerHTML = hours;
            minutesElement.innerHTML = minutes;
            secondsElement.innerHTML = seconds;
        }, 1000);
    } catch (e) {
        console.error(e);
        return;
    }
}

function display_days(duedate){
    return Math.floor(duedate / (1000 * 60 * 60 * 24));
}

function display_hours(duedate){
    return Math.floor((duedate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
}

function display_minutes(duedate){
    return Math.floor((duedate % (1000 * 60 * 60)) / (1000 * 60));
}

function display_seconds(duedate){
    return Math.floor((duedate % (1000 * 60)) / 1000);
}


document.querySelector("#block").addEventListener("click", () => {
    const daysToAdd = parseInt(document.getElementById("days").value) || 0;
    const hoursToAdd = parseInt(document.getElementById("hours").value) || 0;
    const minutesToAdd = parseInt(document.getElementById("minutes").value) || 0;
    const secondsToAdd = parseInt(document.getElementById("seconds").value) || 0;

    // Calculate the total duration to add in milliseconds
    const durationToAdd = (daysToAdd * 24 * 60 * 60 * 1000) +
        (hoursToAdd * 60 * 60 * 1000) +
        (minutesToAdd * 60 * 1000) +
        (secondsToAdd * 1000);

    // Calculate the new date
    const currentDate = new Date(Date.now() + durationToAdd);

    console.log("this is the days you wanted added " + daysToAdd);
    console.log("this is the hours you wanted added " + hoursToAdd);
    console.log("this is the minutes you wanted added " + minutesToAdd);
    console.log("this is the seconds you wanted added " + secondsToAdd);

    document.getElementById("days").value = 0;
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;

    const radioButtons = document.querySelectorAll('input[name="option"]');
    let selectedOption = null;
    radioButtons.forEach(radio => {
        if (radio.checked) {
            selectedOption = radio.value;
        }
    });

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        console.log("this is token");
        console.log(token);

        fetch("http://127.0.0.1:3000/api/v1/sites", {
            method: "POST",
            body: JSON.stringify({
                url: url,
                duration: selectedOption,
                expiration_date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`,
                user_id: current_user.id
            }),
            headers: {
                "content-type": "application/json",
                Authorization: token
            }
        })
            .then(() => {
                document.getElementById('display').innerHTML = "";
                fetchData();
            });
    });
});

function block(array) {
    for (let i = 0; i < sites.length; i++) {

        console.log(i + ', ' + sites[i].url)
        console.log("https://" + window.location.hostname == sites[i].url)
        if ("https://" + window.location.hostname == sites[i].url) {
            document.body.innerHTML = generateHTML('site is blocked');
            console.log("blocked site")
            const displaySite = document.getElementById('site');
            displaySite.textContent = blockedsites[i].toString();
            blockedSite = blockedsites[i].toString();
            break;
        }
    }
    display()
}