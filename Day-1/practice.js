const EventEmitter = require("events");

const myEmitter = new EventEmitter();

// 1. listening to event
myEmitter.on("bell", () => {
    console.log("Bell rang 🔔 Someone is at the door");
});

// 2. trigger event
myEmitter.emit("bell");


myEmitter.on("bell", (name) => {
    console.log(`Bell rang 🔔 ${name} is at the door`);
});

myEmitter.emit("bell", "Shubham");
