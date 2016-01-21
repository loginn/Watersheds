/**
 * Created by loginn on 19/01/2016.
 */

"use strict"; // Makes writing js more secure by throwing errors when an erroneous declaration is made

/**
 * getBasinMap parses the elevationMap into a basinMap made of basinCell each with a sink_name, elevation, position and whether the node has been visited
 * @param {Array} elevationMap The 2D array passed as an input. getBasinMap iterates over every element
 * @param {Array} basinMap The 2D array to be filled with basinCells
 */

function getBasinMap(elevationMap, basinMap) {
    var sink_name = 0;

    for (var i = 0 ; i < elevationMap.length ; i++) {
        var basinRow = []; // A variable to add rows to the basinMap array
        for (var j = 0 ; j < elevationMap[i].length ; j++) {
            // Push the new basinCell to the row array
            basinRow.push({
                sink_name: sink_name,
                height: elevationMap[i][j],
                x: i,
                y: j,
                visited: false
            });
            sink_name++; // Update the sink_name
        }
        basinMap.push(basinRow); // Add the row to the basinMap array
    }
}

/**
 * getLowestDrain recursively finds the lowest neighbouring node from the current node and sets the sink_name of the current node to that of the lowest node and returns
 * an updated letter_index if the fount local minimum wasn't already associated with a letter
 * @param {Array} basinMap The 2D array in which basinCell is found. Used to find the lowest neighbouring node
 * @param {Object} basinCell The cell for which we want to find the lowest node
 * @param {Number} letter_index The letter index to use as the name of the sink if it is a local minimum
 * @returns {Number} letter_index The updated letter index
 */

function getLowestDrain(basinMap, basinCell, letter_index) {
    var lowestDrain = basinCell; // Set the lowest nearby node to the current one. If no lower node is found, this is the local minimum
    var alphabet = "abcdefghijklmnopqrstuvwxyz"; // The alphabet used to pick the letter

    // Get the position of the current node
    var x = basinCell.x;
    var y = basinCell.y;

    // Check the neighbouring nodes in this order NORTH WEST EAST SOUTH
    // Set the node as lowest if its height is lower than the current lowest node
    if (x > 0 && basinMap[x - 1][y].height < lowestDrain.height) {
        lowestDrain = basinMap[x-1][y];
    }
    if (y > 0 && basinMap[x][y - 1].height < lowestDrain.height) {
        lowestDrain = basinMap[x][y - 1];
    }
    if (y < basinMap[x].length - 1 && basinMap[x][y + 1].height < lowestDrain.height) {
        lowestDrain = basinMap[x][y + 1];
    }
    if (x < basinMap.length - 1 && basinMap[x + 1][y].height < lowestDrain.height) {
        lowestDrain = basinMap[x + 1][y];
    }

    // Where the magic happens ! Call the function recursively if we found a node lower than the current one
    // and their names are different from one another
    // Then set the sink_name of the lowest node as the sink_name of the current node

    if (lowestDrain !== basinCell && lowestDrain.sink_name !== basinCell.sink_name) {
        letter_index = getLowestDrain(basinMap, lowestDrain, letter_index);
        basinCell.sink_name = lowestDrain.sink_name; // By putting this in the if statement, we avoid an useless operation when we find the sink
    } else if (typeof basinCell.sink_name === 'number') { // Check if the sink_name is a number
        basinCell.sink_name = alphabet[letter_index]; // if yes, assign a letter to it and update the letter index for the next time we find a local minimum
        letter_index++;
    }
    basinCell.visited = true; // Avoid duplicated work by setting the node as visited
    return letter_index; // return the letter to make sure it is incremented
}

/**
 * flowDown iterates over basinMap. For every unvisited node, calls getLowestDrain to find the node's sink
 * @param {Array} basinMap The 2D array flowDown iterates over.
 */

function flowDown(basinMap) {
    var letter_index = 0;

    for (var i = 0 ; i < basinMap.length ;  i++) {
        for (var j = 0 ; j < basinMap[i].length ; j++) {
            if (!basinMap[i][j].visited) { // Has the node been visited
                letter_index = getLowestDrain(basinMap, basinMap[i][j], letter_index); // If not get its lowest point and change the letter to set the lowest point if needed
            }
        }
    }
}

/**
 * displayBasinMap generates display for the html document running the script
 * @param {Array} basinMap The 2D array of basinCells. It is iterated over, displaying each cell's sink_name
 */

function displayBasinMap(basinMap) {

    var table = document.createElement("table"); // Create an html table

    for (var i = 0; i < basinMap.length; i++) {
        var row = document.createElement('tr'); // For each row in basinMap, create a row to put in the table
        for (var j = 0 ; j < basinMap[i].length ; j++) {
            var td = document.createElement('td'); // For each basinCell create a data cell to put in the row
            td.innerHTML = basinMap[i][j].sink_name; // Store the basinCell sink_name in the data cell
            row.appendChild(td); // Add the data to the row
        }
        table.appendChild(row); // Add the row to the table
    }
    document.body.appendChild(table); // Add the table to the html document
}

/**
 * Watersheds finds the drainage basin given the provided elevation map
 * @param {Array} elevationMap The 2D array representing the different altitudes
 */

function watersheds(elevationMap){
    var basinMap = []; // The array that will contain the new array of basinCells

    //Check if the array exists and isn't empty
    if (typeof elevationMap === 'undefined' || elevationMap.length === 0 &&
        typeof elevationMap[0] === 'undefined' || elevationMap[0].length === 0) {
        var p = document.createElement("p");

        p.innerHTML = "Error";
        document.body.appendChild(p);
        return ;
    }
    getBasinMap(elevationMap, basinMap); // We get the basin map
    flowDown(basinMap); // Flow down the basin map to find the sink_names
    displayBasinMap(basinMap); // Display the basinMap
}

/** TESTS these are the ones provided by google plus edge cases */


(function(){ // We use this function to isolate the main from the global scope

    function main() {
        var elevationMap =
            [[9, 6, 3],
                [5, 9, 6],
                [3, 5, 9]];

        var elevationMap2 =
            [[0, 1, 2, 3, 4, 5, 6, 7, 8, 7]];

        var elevationMap3 =
            [[7, 6, 7],
                [7, 6, 7]];

        var elevationMap4 =
            [[1, 2, 3, 4, 5],
                [2, 9, 3, 9, 6],
                [3, 3, 0, 8, 7],
                [4, 9, 8, 9, 8],
                [5, 6, 7, 8, 9]];

        var elevationMap5 =
            [[8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]];

        var undefinedArray; // Test with undefined array

        var emptyArray = []; // Test with an empty array
        var emptyArray2 = [[]];

        var singleArray = [[1]];

        watersheds(elevationMap);
        watersheds(elevationMap2);
        watersheds(elevationMap3);
        watersheds(elevationMap4);
        watersheds(elevationMap5);
        watersheds(singleArray);
        watersheds(emptyArray);
        watersheds(emptyArray2);
        watersheds(undefinedArray);
    }

    main();

})(); // The second set of parenthesis runs the function when the page is loaded