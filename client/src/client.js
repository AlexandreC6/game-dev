const log = (text) => {
  const parent = document.querySelector('#events');
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  const sock = io();
  sock.emit('message', text);
}

const getBoard = (canvas, numCells = 20) => {
  const contexte = canvas.getContext('2d');
  const cellSize = Math.floor(canvas.width/numCells);

  const fillCell = (x, y, color) => {
    contexte.fillStyle = color;
    contexte.fillRect(x*cellSize, y *cellSize, cellSize, cellSize)
  }

  // Grille canvas
  const drawGrid = () => {

    contexte.strokeStyle = '#333';
    contexte.beginPath();

    for (let i = 0; i < numCells + 1; i++) {
      // Vertical lines
      contexte.moveTo(i * cellSize, 0)
      contexte.lineTo(i* cellSize, cellSize*numCells);

      // Horizontal lines
      contexte.moveTo(0, i * cellSize)
      contexte.lineTo(cellSize*numCells, i* cellSize);

    }
    // Create the border of line
    contexte.stroke();
  }

  const clear = () => {
    contexte.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderBoard = (board = []) => {
    board.forEach((row, y) => {
      row.forEach((color, x) => {
        color && fillCell(x, y, color);
      });
    });
  };

  const reset = (board) => {
    clear();
    drawGrid();
    renderBoard(board);
  }

  const getCellCoordinates = (x, y) => {
    return {
      x: Math.floor(x/cellSize),
      y: Math.floor(y/cellSize)
    }
  }

  return { fillCell, reset, getCellCoordinates };
}

// The coordinate of the click within the canvas
const getClickCoordinates = (element, event) => {
  //.getBoundingClientRect = Return object about the size and position relarive to the viewport
  const {top, left} = element.getBoundingClientRect();
  const {clientX, clientY} = event;

  return {
    x: clientX - left,
    y: clientY - top
  }
};

(() => {
  const canvas = document.getElementById('canvas');
  const {fillCell, reset, getCellCoordinates} = getBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const {x, y} = getClickCoordinates(canvas, e);
    // Render the rectangle
    sock.emit('turn', getCellCoordinates(x, y));
  }

  sock.on('board', reset)
  sock.on('message',log);
  sock.on('turn', ({x, y, color}) => fillCell(x, y, color))


  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted);

  canvas.addEventListener('click', onClick)
})();
