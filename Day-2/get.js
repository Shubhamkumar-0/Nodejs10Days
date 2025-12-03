import express from 'express';
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Home Page");
});

app.get("/about", (req, res) => {
    res.send("This is About Page");
});

app.get("/search", (req, res) => {
    const query = req.query.q; // ?q=nodejs   type in search bar
    res.send(`You searched for: ${query}`);
});

app.listen(3000, () => console.log("Server running on port 3000"));
