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

boot()
function boot(){
    fetchData()
}
async function fetchData(){
    //change this function to use fetch later
    const Http = new XMLHttpRequest();
    const url='http://127.0.0.1:3000/sites';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
        sites = JSON.parse(Http.responseText)
        console.log(sites)
        display()
    }
}
function display(){
    var store = ""
    for(let i = 0; i < sites.length; i++) {
        store += "<div id='site " + i + "' style='display: flex'>" + sites[i].url + "                 " + "</div>" + "<div id='timer" + i + "' style='display: flex'>"
           +  "<div id='days " + i + "' style='display: flex'>" + new Date(sites[i].expiration_date).getDay() + "</div>" +
             ":" + "<div id='hours " + i + "' style='display: flex'>" + new Date(sites[i].expiration_date).getHours() + "</div>" +
            ":" + "<div id='minutes " + i + "' style='display: flex'>" + new Date(sites[i].expiration_date).getMinutes() + "</div>" +
            ":" + "<div id='seconds" + i + "' style='display: flex'>" + new Date(sites[i].expiration_date).getSeconds() + "</div>" +
            "</div>"
        startTimer(i, );
    }
    console.log("displaying sites")
    console.log(store)
    document.getElementById('display').innerHTML = store
}

function startTimer(number, duedate){
    let days = document.getElementById('days ' + number).innerHTML
    setInterval(function() {
        var d = Math.floor((new Date(duedate)-Date.now())/1000)
        days = display_days(d); document.getElementById('days ' + number).innerHTML = value }, 1000)
    let hours = document.getElementById('hours ' + number).innerHTML
    setInterval(function() {
        var d = Math.floor((new Date(duedate)-Date.now())/1000)
        hours = display_days(d); document.getElementById('days ' +number).innerHTML = value }, 1000)
    let minutes = document.getElementById('minutes ' + number).innerHTML
    setInterval(function() {
        var d = Math.floor((new Date(duedate)-Date.now())/1000)
        minutes = display_days(d); document.getElementById('days ' +number).innerHTML = value }, 1000)
    let seconds = document.getElementById('seconds  ' + number).innerHTML
    setInterval(function() {
        var d = Math.floor((new Date(duedate)-Date.now())/1000)
        seconds = display_days(d); document.getElementById('days ' + number).innerHTML = value }, 1000)
}

function display_days(duedate){
    return Math.floor(duedate / (3600 * 24));
}

function display_hours(duedate){
    return Math.floor((duedate % (3600 * 24)) / 3600);
}
function display_minutes(duedate){
    return Math.floor(((duedate % (3600*24))%3600)/60);
}

function display_seconds(duedate){
    return  duedate%60;
}


document.querySelector("#block").addEventListener("click", () => {
    var currentDate = new Date(Date.now() + document.getElementById("days").value*24*60*60*1000 + document.getElementById("hours").value*60*60*1000 + document.getElementById("minutes").value*60*1000 + document.getElementById("seconds").value*1000)
    document.getElementById("days").value = 0;
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;

        // Do something with url
        fetch("http://127.0.0.1:3000/sites", {
            method: "POST",
            body: JSON.stringify({
                url: url,
                duration: "Permanent",
                expiration_date: currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate()
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    });
    console.log(new Date(Date.now()))
});

function block(array) {
    console.log("let test this shit")
    console.log(array[0][0])
    console.log(window.location.hostname)
    console.log(window.location.href)
    for (let i = 0; i < array.length; i++) {

        console.log(i + ', ' + array[i][0])
        if (window.location.hostname == array[i][0] + '/' || window.location.href == array[i][0] + '/') {
            document.body.innerHTML = generateHTML('site is blocked');
            const displaySite = document.getElementById('site');
            displaySite.textContent = blockedsites[i].toString();
            blockedSite = blockedsites[i].toString();
            break;
        }
    }
}
//alert("this is a test")
//document.body.innerHTML = generateHTML('site is blocked')