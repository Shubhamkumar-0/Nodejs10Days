const EventEmitter = require('events');
const myEmitter = new EventEmitter();


myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});
myEmitter.emit('greet', 'Alice'); // Logs: Hello, Alice!
myEmitter.emit('greet', 'Alice'); // Logs: Hello, Alice!



myEmitter.once('farewell', () => {
  console.log('Goodbye!');
});
myEmitter.emit('farewell'); // Logs: Goodbye!
myEmitter.emit('farewell'); // No output, listener removed after first call
