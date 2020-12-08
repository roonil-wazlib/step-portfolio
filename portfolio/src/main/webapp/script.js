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
    console.log("Rows created");
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
        };

    };
};

//Create a 16 by 16 grid
populateGrid(16, 16);