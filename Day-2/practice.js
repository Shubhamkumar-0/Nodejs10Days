import express from 'express';
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary in-memory storage for registered users
const registeredUsers = []; // Initially empty

// Home route with links to login and signup
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome</h1>
        <a href="/login">Login</a> | <a href="/signup">Sign Up</a>
    `);
});

// Signup form
app.get("/signup", (req, res) => {
    res.send(`
        <h1>Sign Up</h1>
        <form action="/signup" method="POST">
            <label>Username:</label>
            <input type="text" name="username" required><br>
            <label>Password:</label>
            <input type="password" name="password" required><br>
            <button type="submit">Sign Up</button>
        </form>
    `);
});

// Handle signup
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = registeredUsers.find(u => u.username === username);
    if (userExists) {
        return res.status(400).send("Username already exists");
    }

    // Add new user
    registeredUsers.push({ username, password });
    res.send(`Sign Up successful! You can now <a href="/login">login</a>.`);
});

// Login form
app.get("/login", (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="POST">
            <label>Username:</label>
            <input type="text" name="username" required><br>
            <label>Password:</label>
            <input type="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Handle login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = registeredUsers.find(u => u.username === username);

    if (user && user.password === password) {
        res.send(`Welcome, ${username}!`);
    } else {
        res.status(401).send(`Invalid username or password <a href="/signup">Sign Up</a>`);
        // res.send(`<a href="/signup">Sign Up</a>`);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


