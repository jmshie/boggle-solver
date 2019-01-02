
// Get references to required elements.
var solveButton = document.querySelector('#solve');
var changeSizeButton = document.querySelector('#changeSize');
var sizeField = document.querySelector('#sizeField');
var solution = document.querySelector('#solution');
var solutionChild = solution.firstChild;
var grid = document.querySelector('#grid');
var gridChild = grid.firstChild;

changeSizeButton.onclick = function() {
  changeSize();
}
  
solveButton.onclick = function() {
  // Flatten the puzzle to a single string so it can be sent to the solver.
  var tiles = document.querySelectorAll('.tile');
  puzzle = '';
  for (var i = 0; i < tiles.length; ++i) {
    puzzle += tiles[i].value;
  }

  // Send the puzzle as a query parameter to the Boggle solver URI.
  var request = new XMLHttpRequest();
  request.open('GET', 'boggle/solver?puzzle=' + encodeURIComponent(puzzle));
  request.onload = function() {
    // Remove the current solution and replace it with the one just retrieved.
    solution.removeChild(solutionChild);
    solutionChild = document.createElement('ol');
    solution.appendChild(solutionChild);

    // Create a list item for each word in the solution list.
    var words = request.response.split('\n');
    for (var i = 0; i < words.length; ++i) {
      var item = document.createElement('li');
      item.textContent = words[i];
      solutionChild.appendChild(item);
    }
  }
  
  request.send();
}

/**
 * Creates a new Boggle grid of the specified size.
 */
function changeSize() {
  var size = sizeField.value;
  // Validate the size of the grid.
  if (size >= 2 && size <= 10) {
    // Remove the current grid and replace it with one with the specified size.
    grid.removeChild(gridChild);
    gridChild = document.createElement('div');
    grid.appendChild(gridChild);
    var index = 1;
    for (var i = 0; i < size; ++i) {
      var div = document.createElement('div');
      gridChild.appendChild(div);
      for (var j = 0; j < size; ++j) {
        var tile = document.createElement('input');
        tile.setAttribute('type', 'text');
        tile.setAttribute('name', 'tile' + index++);
        tile.setAttribute('class', 'tile');
        tile.setAttribute('required', true);
        tile.setAttribute('minlength', 1);
        tile.setAttribute('maxlength', 1);
        tile.setAttribute('size', '1');
        tile.setAttribute('value', 'A');
        div.appendChild(tile);
      }
    }
  }
}

// Set the default size of the grid when the page loads.
changeSize();
