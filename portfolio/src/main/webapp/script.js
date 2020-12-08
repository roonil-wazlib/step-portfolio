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

function playGame() {
    var newColours = [];
    while (true) {
        for (x = 0; x < gridWidth; x++) {
            for (y = 0; y < gridHeight; y++) {
                var cellNum = y * gridWidth + x;
                newColours[cellNum] = newColour(x, y);
            }
        }
        setTimeout(() => {  updateGridView(newColours); }, 500);
    }
}

function newColour(x, y) {
    var liveNeighbours = countNeighbours;
    var currCell = cells[y * gridWidth + x];
    //Conway's game of life rules
    if (currCell.style.background == 'black') {
        //cell is currently alive
        if (liveNeighbours < 2 || liveNeighbours > 3) {
            //cell dies next iteration
            return 'white';
        } else {
            //cell lives next iteration
            return 'black'
        }
    } else {
        //cell is currently dead
        if (liveNeighbours == 3) {
            //cell comes alive
            return 'black'
        } else {
            //cell remains dead
            return 'white'
        }
    }
}

function countNeighbours(x, y) {
    var liveNeighbours = 0;
    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            if (i == 0 ||j == 0) {
                // current cell, don't count
                continue;
            } else if (i < 0 || j < 0 || i >= gridWidth || j >= gridHeight) {
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

function updateGridView(newColours) {
    for (x = 0; x < newColours.length; x++) {
        cells[x].style.background = newColours[x];
    }
}

//Create a 16 by 16 grid
const gridWidth = 16;
const gridHeight = 16;
populateGrid(gridWidth, gridHeight);