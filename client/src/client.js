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

(() => {
  const sock = io();

  sock.on('message',log);

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted);
})();
