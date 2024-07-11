const wsURL = "wss://echo-ws-service.herokuapp.com";

const input = document.getElementById("input");
const btnSend = document.getElementById("btn-send");
const btnGeo = document.getElementById("btn-geo");
const output = document.getElementById("output");

let websocket = new WebSocket(wsURL);

function sendMessage(usersText, type = false) {
  const html = `<span class = 'output-text ${
    type ? "message-original" : "message-answer"
  }'>${usersText}</span>`;
  output.innerHTML += html;
}

btnSend.addEventListener("click", () => {
  let message = input.value.trim();
  if (message !== "") {
    sendMessage(message, true);
    websocket.send(message);
    input.value = "";
  } else {
    message = input.value = "";
    sendMessage("Введите текст");
  }
});

websocket.onmessage = function (e) {
  sendMessage(e.data);
};

function handleGeoError() {
  const geo = `<span class = 'output-text message-original geo-info'>Гео-локация:<br>${"Местоположение недоступно ("}</span>`;
  output.innerHTML += geo;
}

const handleGeo = (position) => {
  const { latitude, longitude } = position.coords;
  const html = `<span class = "output-text message-original geo-info">Гео-локация:<br><i>Широта:</i> ${latitude.toFixed(
    4
  )}°<br><i>Долгота:</i> ${longitude.toFixed(4)}° <br>
  <a href = https://www.openstreetmap.org/#map=13/${latitude.toFixed(
    4
  )}/${longitude.toFixed(4)} target = '_blank'>Ссылка на карту</a></span>`;
  output.innerHTML += html;
};

btnGeo.addEventListener("click", () => {
  if (!navigator.geolocation) {
    const html = `<span class = "output-text message-answer not-sup-geo">Geolocation не поддерживается вашим браузером</span>`;
    output.innerHTML += html;
  } else {
    navigator.geolocation.getCurrentPosition(handleGeo, handleGeoError);
  }
});