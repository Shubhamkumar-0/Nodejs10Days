import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser()); // default: unsigned cookies

app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'Shubham'); // cookie name = 'username', value = 'Shubham'
  res.send('Cookie has been set!');
});
app.get('/get-cookie', (req, res) => {
  const username = req.cookies.username; // read cookie
  res.send(`Hello, ${username}`);
});



// Set signed cookie
app.get('/set-signed', (req, res) => {
  res.cookie('token', 'abc123', { signed: true });
  res.send('Signed cookie set!');
});

// Read signed cookie
app.get('/get-signed', (req, res) => {
  res.send(`Signed token: ${req.signedCookies.token}`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/set-cookie");
console.log("Server running on http://localhost:3000/set-signed");

});
