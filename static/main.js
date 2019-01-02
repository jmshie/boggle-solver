
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
  var tiles = document.querySelectorAll('.tile');
  puzzle = '';
  for (var i = 0; i < tiles.length; ++i) {
    puzzle += tiles[i].value;
  }
  
  var request = new XMLHttpRequest();
  request.open('GET', 'boggle/solver?puzzle=' + encodeURIComponent(puzzle));
  request.onload = function() {
    solution.removeChild(solutionChild);
    solutionChild = document.createElement('ol');
    solution.appendChild(solutionChild);
    var words = request.response.split('\n');
    for (var i = 0; i < words.length; ++i) {
      var item = document.createElement('li');
      item.textContent = words[i];
      solutionChild.appendChild(item);
    }
  }
  request.send();
}

function changeSize() {
  var size = sizeField.value;
  if (size >= 2 && size <= 10) {
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
//        tile.setAttribute('pattern', '[A-Z]');
        tile.setAttribute('value', 'A');
        div.appendChild(tile);
      }
    }
  }
}

changeSize();
