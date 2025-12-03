// server.js
const { SerialPort } = require("serialport");
const { WebSocketServer } = require("ws");

const ARDUINO_PORT = "COM5";  
const BAUD_RATE = 9600;

let latestValue = null;

const serial = new SerialPort({
  path: ARDUINO_PORT,
  baudRate: BAUD_RATE,
});

serial.on("open", () => {
  console.log(`Puerto serial abierto en ${ARDUINO_PORT} a ${BAUD_RATE} bps`);
});

serial.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});

// Cada vez que llega un dato del Arduino
serial.on("data", (data) => {
  const raw = data.toString().trim();
  const value = parseInt(raw, 10);

  if (Number.isNaN(value)) {
    console.log("Dato no numérico:", raw);
    return;
  }

  latestValue = value;
  console.log("Arduino:", value);

  // Enviar a todos los clientes WebSocket conectados
  broadcast({
    sensor: "humedad",
    value,
    ts: Date.now(),
  });
});

//  Servidor WebSocket
const wss = new WebSocketServer({ port: 3001 }, () => {
  console.log("WebSocket escuchando en ws://localhost:3001");
});

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

// Si alguien se conecta nuevo, le mandamos el último valor disponible
wss.on("connection", (socket) => {
  console.log("Cliente WebSocket conectado");
  if (latestValue !== null) {
    socket.send(
      JSON.stringify({
        sensor: "humedad",
        value: latestValue,
        ts: Date.now(),
      })
    );
  }
});
