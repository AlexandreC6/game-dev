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

const getBoard = (canvas) => {
  const contexte = canvas.getContext('2d');

  const fillRect = (x, y, color) => {
    contexte.fillStyle = color;
    contexte.fillRect(x -10, y - 10, 20, 20)
  }

  return { fillRect };
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
  const {fillRect} = getBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const {x, y} = getClickCoordinates(canvas, e);
    // Render the rectangle
    sock.emit('turn', {x , y});
  }

  sock.on('message',log);
  sock.on('turn', ({x, y}) => fillRect(x, y))


  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted);

  canvas.addEventListener('click', onClick)
})();
