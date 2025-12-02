const EventEmitter = require('events');
const fs = require('fs');

class UserSystem extends EventEmitter {}
const system = new UserSystem();

// function to save logs
function saveLog(message) {
  const time = new Date().toLocaleString();
  fs.appendFileSync('activity.log', `${time} - ${message}\n`);
}

/* ------------------ EVENTS ------------------- */

// When user registers
system.on('register', (username) => {
  const msg = `New user registered: ${username}`;
  console.log(msg);
  saveLog(msg);
});

// When user logs in
system.on('login', (username) => {
  const msg = `User logged in: ${username}`;
  console.log(msg);
  saveLog(msg);
});

// When user sends message
system.on('message', (username, text) => {
  const msg = `Message from ${username}: ${text}`;
  console.log(msg);
  saveLog(msg);
});

// When user logs out
system.on('logout', (username) => {
  const msg = `User logged out: ${username}`;
  console.log(msg);
  saveLog(msg);
});

/* ------------- SIMULATION (emit events) ------------- */

system.emit('register', 'Shubham');
// system.emit('login', 'Shubham');
// system.emit('message', 'Shubham', 'Hello Node.js!');
// system.emit('logout', 'Shubham');
