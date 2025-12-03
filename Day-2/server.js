import http from 'http';

// Create the server
const server = http.createServer((req, res) => {
    // Handle different routes
    if (req.url === "/") {
        res.writeHead(200, {"Content-Type": "text/plain"}); // OK
        res.end("Home Page");
    } 
    else if (req.url === "/about") {
        res.writeHead(200, {"Content-Type": "text/plain"}); // OK
        res.end("About Page");
    } 
    else if (req.url === "/contact") {
        res.writeHead(200, {"Content-Type": "text/plain"}); // OK
        res.end("Contact Page");
    } 
    else {
        res.writeHead(404, {"Content-Type": "text/plain"}); // Not Found
        res.end("Page Not Found");
    }
});

// Define the port
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
