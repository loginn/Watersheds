/**
 * Created by loginn on 19/01/2016.
 */

"use strict";

(function() { // We use this to isolate the code from the global scope
    /**
     * Parses the elevation map input into a basin map each with a sink name, elevation, position and whether the node has been visited
     * @param elevationMap
     * @param basinMap
     */

    function getBasinMap(elevationMap, basinMap) {
        var i;
        var j;
        var name = 0;
        var basinRow = []; // A variable to add rows to the basinMap array

        for (i = 0 ; i < elevationMap.length ; i++) {
            for (j = 0 ; j < elevationMap[i].length ; j++) {
                // Push the new basinCell to the row array
                basinRow.push({
                    name: name,
                    height: elevationMap[i][j],
                    x: i,
                    y: j,
                    visited: false
                });
                name++; // Update the name
            }
            basinMap.push(basinRow); // Add the row to the basinMap array
            basinRow = []; // Clear the row
        }
    }

    /**
     * Recursively finds the lowest node from the current node and sets the sink name of the current node to that of the lowest node
     * @param basinMap
     * @param basinCell
     */

    function getLowestDrain(basinMap, basinCell) {
        var lowestDrain = basinCell; // Set the lowest nearby node to the current one. If no lower node is found, this is the local minimum

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
        // and their sink names are different from each other
        // Then set the name of the lowest node as the name of the current node
        if (lowestDrain !== basinCell && basinCell.name !== lowestDrain.name) {
            getLowestDrain(basinMap, lowestDrain);
            basinCell.name = lowestDrain.name; // By putting this in the if statement, we avoid an useless operation when we find the sink
        }
        // Avoid duplicated work by setting the node as visited
        basinCell.visited = true;
    }

    /**
     * For every unvisited node, flow down the drains to find its sink
     * @param basinMap
     */

    function flowDown(basinMap) {
        var i;
        var j;

        for (i = 0 ; i < basinMap.length ;  i++) {
            for (j = 0 ; j < basinMap[i].length ; j++) {
                if (!basinMap[i][j].visited) // Has the node been visited
                    getLowestDrain(basinMap, basinMap[i][j]); // If not get its lowest point
            }
        }
    }

    /**
     * Generate display for the html document running the script
     * @param basinMap
     */

    function displayBasinMap(basinMap) {

        var table = document.createElement("table"); // Create an html table
        var i;
        var j;

        for (i = 0; i < basinMap.length; i++) {
            var row = document.createElement('tr'); // For each row in basinMap, create a row to put in the table
            for (j = 0 ; j < basinMap[i].length ; j++) {
                var td = document.createElement('td'); // For each basinCell create a data cell to put in the row
                td.innerHTML = basinMap[i][j].name; // Store the basinCell name in the data cell
                row.appendChild(td); // Add the data to the row
            }
            table.appendChild(row); // Add the row to the table
        }
        document.body.appendChild(table); // Add the table to the html document
    }

    /**
     * Launches the drainage basin finding given the provided elevation map
     * @param elevationMap
     */

    function watersheds(elevationMap){
        var basinMap = [];

        //Check if the array exists and isn't empty
        if (typeof elevationMap === 'undefined' || elevationMap.length === 0 &&
            typeof elevationMap[0] === 'undefined' || elevationMap[0].length === 0) {
            document.body.innerHTML += "<p>Error</p>";
            return ;
        }
        getBasinMap(elevationMap, basinMap); // We get the basin map
        flowDown(basinMap); // Flow down the basin map to find the sink names
        displayBasinMap(basinMap); // Display the basinMap
    }

    /** TESTS these are the ones provided by google plus edge cases */

// Using a main function to avoid global variables

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

})(); // The second set of parenthesis run the function when the page is loaded