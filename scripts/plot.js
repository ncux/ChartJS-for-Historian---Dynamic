
let API = {
    access_token: "",
    tagsUrl: 'https://dev.sealu.net:4433/api/v1/forward?url=/historian-rest-api/v1/tagslist',
    dataUrl: "https://dev.sealu.net:4433/api/v1/forward?url=/historian-rest-api/v1/datapoints/calculated"
};


// user inputs
const form = document.querySelector('#form');
const tagSelector = document.querySelector('#tagSelector');
const startDate = document.querySelector('#startDate');
const endDate = document.querySelector('#endDate');
const startTime = document.querySelector('#startTime');
const endTime = document.querySelector('#endTime');
const count = document.querySelector('#count');
const interval = document.querySelector('#interval');
const plotButton = document.querySelector('#plotButton');
const warning = document.querySelector('#warning');



const ctx = document.querySelector('#chart').getContext('2d');

// holds the tags
let tagsArray = [];

let valuesArray = [];
let timeArray = [];

let chartType = {
    bar: 'bar',
    line: 'line'
};

let data = {
    labels: timeArray,
    datasets: [{
        label: tagSelector.value,
        data: valuesArray,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
};

let options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:false
            }
        }]
    }
};



// gets tags
async function getTags() {
    try {

        let xhr = new XMLHttpRequest();
        // xhr.open('GET', API.tagsUrl, true);
        // xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        xhr.open('GET', `./data/tags - verbose.json`, true);

        xhr.onload = async () => {
            if(xhr.status === 200) {
                // console.log(xhr.responseText);
                let response = await JSON.parse(xhr.responseText);
                let tags = response.Tags;
                // console.log(tags);
                tags.map(tag => {
                    let allTags = tag.Tagname;
                    // console.log(allTags);
                    tagsArray.push(allTags);
                    // console.log(tagsArray);
                    populateTagsInput();
                });
            }
        };

        xhr.send();

    } catch (e) {
        console.log(e);
    }
}


// populates the tags dropdown menu
function populateTagsInput() {
    let tagOption = document.createElement('option');
    tagsArray.forEach(tag => {
        tagOption.textContent = tag;
        tagOption.setAttribute('value', tag);
        tagSelector.append(tagOption);
    });
}


plotButton.addEventListener('click', checkIfFormIsFullyFilled);
// plotButton.addEventListener('click', getValuesAndPlotChart);


function checkIfFormIsFullyFilled(e) {
    e.preventDefault();
    console.log('button clicked');

    let formInputs = form.elements;
    let emptyFields = [...formInputs].some(input => input.value === '');
    if (emptyFields) {
        warning.style.display = 'block';
        setTimeout(hideWarningMessage, 2000);
    } else {
        getValuesAndPlotChart();
    }
}

function hideWarningMessage() {
    warning.style.display = 'none';
}


function getValuesAndPlotChart() {

    let queryUrl = generateQueryUrl();
    console.log(queryUrl);

    try {

        let xhr = new XMLHttpRequest();
        // xhr.open('GET', queryUrl, true);
        // xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        xhr.open('GET', `./data/WIN-9DBOGP80695.Simulation00052 - OG.json`, true);

        xhr.onload = async () => {
            if(xhr.status === 200) {
                // console.log(xhr.responseText);
                let historianData = await JSON.parse(xhr.responseText);
                let timeStampsAndValues = historianData['Data'][0].Samples;
                console.log(timeStampsAndValues);
                timeStampsAndValues.forEach(value => {
                    timeArray.push(simplifyTime(value.TimeStamp));
                    // valuesArray.push(Math.ceil(value.Value));
                    valuesArray.push((parseInt(value.Value)).toFixed(0));
                    plotChart();
                })
            }
        };

        xhr.send();

    } catch (e) {
        console.log(e);
    }

}


// grabs the form inputs and builds the API query URL
function generateQueryUrl() {
    // change interval value to milliseconds
    const milliseconds = Math.ceil((parseInt(interval.value))*1000);
    return `${API.dataUrl}/${tagSelector.value}/${startDate.value}T${startTime.value}/${endDate.value}T${endTime.value}/1/${count.value}/${milliseconds}`;
}


// trims off the seconds
function simplifyTime(timestamp) {
    return timestamp.slice(0, 16);
}


function plotChart() {
    const chart = new Chart(ctx, {
        type: chartType.bar,
        data: data,
        options: options
    });
}





