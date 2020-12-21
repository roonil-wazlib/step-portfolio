// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


//global constants
const gridWidth = 40;
const gridHeight = 40;

//set up chart
google.charts.load('current', {'packages':['geochart'],
        'mapsApiKey': config.chartsApiKey
      });
google.charts.setOnLoadCallback(drawChart);

/**
 * Adds a random quote to the page.
 */
function addRandomQuote() {
  const quotes =
      ['Ride! Ride Riders of Rohan! Ride to ruin!', 'May the force be with you.', 
      'The secret to flying is to throw yourself at the ground and miss.', 'AHHHHHHHHHHHHH'];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

/**
 * Go forward one image in George gallery
 */
function goForward() {
    updateImage(1);
}

/**
 * Go back one image in George gallery
 */
function goBack() {
    updateImage(-1);
}

/**
 * Update image source to reflect forward/back change
 * @param {Number} update - 1 to go forward, -1 to go back
 */
function updateImage(update) {
    const totalImages = 12;

    //get current image source and number of image
    const currentImage = document.getElementById('george-gallery');
    const imageNumber = Number(currentImage.title);
    
    //create new image number and source
    const newImageNumber = String((imageNumber + update + totalImages) % totalImages); //need additional + totalImages since js doesn't use strict modulus
    const newImageName = 'images/george/george' + newImageNumber + '.jpg';

    //update image properties
    currentImage.src = newImageName;
    currentImage.title = newImageNumber;
}


// Set variables
const grid = document.getElementById("conway");
var rows = document.getElementsByClassName("row");
var cells = document.getElementsByClassName("cell");

/**
 * Create grid for Conway
 * @param {Number} numRows - number of rows to add to grid div
 * @param {Number} numCols - number of cols to add to grid div
 */
function populateGrid(numRows, numCols) {
    createRows(numRows);
    createCells(numRows, numCols);
}

/**
 * Populate the grid div with row divs
 * @param {Number} numRows - number of rows to populate with
 */
function createRows(numRows) {
    for (r = 0; r < numRows; r++) {
        var row = document.createElement("div");
        grid.appendChild(row).className = "row";
    };
};

/**
 * Populate the row divs with cells
 * @param {Number} numRows - number of rows that need populating
 * @param {Number} numCols - number of cells to add to each row
 */
function createCells(numRows, numCols) {
    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numCols; j++) {
            var newCell = document.createElement("div");
            rows[j].appendChild(newCell).className = "cell";
            let cell = newCell;
            newCell.onclick = function() {clickCell(cell);};
        };

    };
};

/**
 * Toggle colour of clicked grid cell
 * @param cell - cell object that was clicked on
 */
function clickCell(cell) {
    var currBackground = cell.style.background
    switch (currBackground) {
        case 'black':
            cell.style.background = 'white';
            break;
        default:
            cell.style.background = 'black';
            break;
    }
}

/**
 * Display next stage of Conway on grid
 */
function nextStage() {
    var newColours = [];
    for (x = 0; x < gridWidth; x++) {
        for (y = 0; y < gridHeight; y++) {
            var cellNum = y * gridWidth + x;
            newColours[cellNum] = newColour(x, y);
        }
    }
    updateGridView(newColours);
}

/**
 * Determine the colour of a given grid cell in the next stage based on neighbours
 * @param {Number} x - x coordinate of cell
 * @param {Number} y - y coordinate of cell
 */
function newColour(x, y) {
    var liveNeighbours = countNeighbours(x, y);
    var currCell = cells[y * gridWidth + x];
    //Conway's game of life rules
    if (currCell.style.background == 'black') {
        //cell is currently alive
        if (liveNeighbours < 2 || liveNeighbours > 3) {
            //cell dies next iteration
            console.log("Change");
            return 'white';
        } else {
            //cell lives next iteration
            return 'black'
        }
    } else {
        //cell is currently dead
        if (liveNeighbours == 3) {
            //cell comes alive
            console.log("Change");
            return 'black'
        } else {
            //cell remains dead
            return 'white'
        }
    }
}

/**
 * Count the number of living neighbours a given cell has
 * @param cell - cell object that was clicked on
 * @param {Number} x - x coordinate of cell
 * @param {Number} y - y coordinate of cell
 */
function countNeighbours(x, y) {
    var liveNeighbours = 0;
    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                // current cell, don't count
                continue;
            } else if (x + i < 0 || y + j < 0 || x + i >= gridWidth || y + j >= gridHeight) {
                // gone off grid, ignore
                continue;
            } else {
                //valid neighbour cell
                var cellNum = (y + j) * gridWidth + (x + i);
                if (cells[cellNum].style.background == 'black') {
                    liveNeighbours++;
                }
            }
        }
    }
    return liveNeighbours
}

/**
 * Update the css styling to reflect new dead and living cells
 * @param {Object} newColours - an array containing the colours to update to
 */
function updateGridView(newColours) {
    for (x = 0; x < newColours.length; x++) {
        cells[x].style.background = newColours[x];
    }
}

/**
 * Reset the Conway grid
 */
function reset() {
    for (i = 0; i < cells.length; i++) {
        cells[i].style.background = 'white';
    }
}

/**
 * Fetch comments from servlet
 */
function getComments() {
    var numComments = document.getElementById("comment-number").value;
    fetch('/data?num-comments=' + numComments)
    .then(response => response.json())
    .then((comments)=> {
        console.log(comments);
        const commentSection = document.getElementById('comments-container');
        //erase any persistent comments before readding them
        commentSection.innerHTML = "";
        //add each retrieved comment
        for (i = 0; i < comments.length; i++) {
            commentSection.appendChild(
                createListElement(comments[i])
            );
        }
    });
}

/**
 * Delete all comments from datastore
 */
function deleteComments() {
    const request = new Request('/delete-data', {method: 'POST'});
    console.log("Deleting comments");
    fetch(request)
    .then((response) => {
        getComments();
    });
}

/** Creates an <li> element containing screen name and text. */
function createListElement(comment) {
  const liElement = document.createElement('li');
  liElement.innerText = comment.screenName + ': ' + comment.text;
  return liElement;
}

function hideCommentsForm() {
    var form = document.getElementById("comments-form");
    form.style.display = "none";
}

function displayCommentsForm() {
    var form = document.getElementById("comments-form");
    form.style.display = "block"
}

/**
 * Show comment submit form and prefil email as username
 * @param {String} html - content to display logout button
 * @param {String} email - email of current user to use as screen-name
 */
function showLoggedInDisplay(html, email) {
    displayCommentsForm();
    var logInOutBox = document.getElementById("log-in-or-out");
    logInOutBox.innerHTML = html;
}

/**
 * Hide comment submit box from logged out users
 * @param {String} html - content to display login button
 */
function showLoggedOutDisplay(html) {
    hideCommentsForm();
    var logInOutBox = document.getElementById("log-in-or-out");
    logInOutBox.innerHTML = html;
}

/**
 * Fetch login status and display comment section accordingly
 */
function loadCommentSection() {
    fetch('/log-in')
    .then(response => response.json())
    .then((info) => {
        //update display
        if (info.isLoggedIn) {
            showLoggedInDisplay(info.logInOrOut, info.email);
        } else {
            showLoggedOutDisplay(info.logInOrOut);
        }
    });
    getComments();
}

function drawChart() {
    fetch('/covid')
    .then(response => response.json())
    .then((covidCases) => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Country');
        data.addColumn('number', 'Cases Per Million');

        Object.keys(covidCases).forEach((country) => {
            data.addRow([country, covidCases[country]]);
        });

        const options = {
        colorAxis : {colors: ['green', 'red']},
        'width':900,
        'height':500
        };

        const chart = new google.visualization.GeoChart(document.getElementById('chart-container'));
        chart.draw(data, options);
    });
}

/** 
 * Populate maps div with a map centered on California
 */
function initMap() {
  const map = new google.maps.Map(
        document.getElementById('map'),
        {center: {lat: 35.78613674, lng: -119.4491591}, zoom: 6});
    const trexMarker = new google.maps.Marker({
        position: {lat: 37.421903, lng: -122.084674},
        map: map,
        title: 'Google'
    });
}

loadScript();
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.mapsApiKey;
    document.head.appendChild(script);
}

/**
 * Actions to run once webpage has loaded
 */
function onLoad() {
    loadCommentSection();
    populateGrid(gridWidth, gridHeight);
    initMap();
}