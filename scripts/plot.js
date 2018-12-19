

let API = {
    access_token: "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJhMmUyNjM5Zi1lY2ZhLTQyZGYtYTEwMi1mODM5NWY0ZTkwODEiLCJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbImNsaWVudHMucmVhZCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5yZWFkIiwicGFzc3dvcmQud3JpdGUiLCJjbGllbnRzLnNlY3JldCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5hZG1pbiIsImhpc3Rvcmlhbl9yZXN0X2FwaS53cml0ZSIsImNsaWVudC5hZG1pbiIsImNsaWVudHMud3JpdGUiLCJ1YWEuYWRtaW4iLCJzY2ltLndyaXRlIiwic2NpbS5yZWFkIl0sInNjb3BlIjpbImNsaWVudHMucmVhZCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5yZWFkIiwicGFzc3dvcmQud3JpdGUiLCJjbGllbnRzLnNlY3JldCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5hZG1pbiIsImhpc3Rvcmlhbl9yZXN0X2FwaS53cml0ZSIsImNsaWVudC5hZG1pbiIsImNsaWVudHMud3JpdGUiLCJ1YWEuYWRtaW4iLCJzY2ltLndyaXRlIiwic2NpbS5yZWFkIl0sImNsaWVudF9pZCI6ImFkbWluIiwiY2lkIjoiYWRtaW4iLCJhenAiOiJhZG1pbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNGJlMWJiYzAiLCJpYXQiOjE1NDUxNzc0ODgsImV4cCI6MTU0NTIyMDY4OCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VhYS9vYXV0aC90b2tlbiIsInppZCI6InVhYSIsImF1ZCI6WyJhZG1pbiIsImNsaWVudHMiLCJoaXN0b3JpYW5fcmVzdF9hcGkiLCJwYXNzd29yZCIsImNsaWVudCIsInVhYSIsInNjaW0iXX0.c6sWJqauJ-Qc73ERYKwXcYeuqtjwOjfcx9UIkSNnPATdYd1L95IDDhAJ6R3k0MXMn7JbHmFw2e6FEsXk45EEKWBQkH8K1hDBE4zP0NN2OmkR_ZepphDE8rN5osYKMKMuTm4rQnfyruVHlVu5pzJ-z7hMeKpVGGEpwfM8s_fY41TCcwxNdNyPDeb98nooHadBDt-98lmba8ThJIu-RMI4cGlMFqnIAo-UMhEpory-Fkjm0mqGlFNurZPaQJ22M0RoCC50D4jX7aTZ1yUEXT6mRbUQgNsRKkL1cCA4QG1RThgjF--GshyJFwug3OqJn5Def6Zl5jgxyabEy0XKKJFjPA",
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
    } else {
        getValuesAndPlotChart();
    }
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
                let timeStampsAndValues = historianData.Data[0].Samples;
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





