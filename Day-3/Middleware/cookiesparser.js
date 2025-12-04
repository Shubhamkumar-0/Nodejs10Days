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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/set-cookie");
console.log("Server running on http://localhost:3000/get-cookie");

});
