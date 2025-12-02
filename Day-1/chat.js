const EventEmitter = require('events')
const fs = require('fs')

class ChatSystem extends EventEmitter {
  constructor() {
    super()
    this.users = {}
    this.messageCount = {}
  }

  join(username) {
    this.users[username] = true
    this.emit("join", username)
  }

  sendMessage(username, message) {
    if (!this.users[username]) {
      this.emit("error", `${username} not in room`)
      return
    }

    // track spam
    this.messageCount[username] = (this.messageCount[username] || 0) + 1

    if (this.messageCount[username] > 3) {
      this.emit("spam", username)
      return
    }

    this.emit("message", username, message)
  }

  afk(username) {
    this.emit("afk", username)
  }

  leave(username) {
    delete this.users[username]
    this.emit("leave", username)
  }
}

// Create chat system
const chat = new ChatSystem()

// Save logs
function log(message) {
  const time = new Date().toLocaleString()
  fs.appendFileSync('chat.log', `${time} - ${message}\n`)
}

/* -------- EVENTS -------- */

chat.on("join", (username) => {
  const msg = `${username} joined the chat`
  console.log(msg)
  log(msg)
})

chat.on("message", (username, text) => {
  const msg = `${username}: ${text}`
  console.log(msg)
  log(msg)
})

chat.on("afk", (username) => {
  const msg = `${username} is now AFK`
  console.log(msg)
  log(msg)
})

chat.on("leave", (username) => {
  const msg = `${username} left the chat`
  console.log(msg)
  log(msg)
})

chat.on("spam", (username) => {
  const msg = `${username} kicked for spamming!`
  console.log(msg)
  log(msg)
  chat.leave(username)
})

chat.on("error", (msg) => {
  console.log("ERROR:", msg)
  log("ERROR: " + msg)
})

/* -------- SIMULATION -------- */

chat.join("Shubham")
chat.sendMessage("Shubham", "Hello")
chat.sendMessage("Shubham", "How are you?")
chat.sendMessage("Shubham", "Anyone here?")
chat.sendMessage("Shubham", "Spam message")
chat.afk("Shubham")