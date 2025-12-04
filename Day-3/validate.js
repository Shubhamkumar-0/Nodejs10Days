import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- ROUTER ---------------- */
const userRouter = express.Router();

// GET → Show the form
userRouter.get('/form', (req, res) => {
  res.send(`
    <h2>User Register Form</h2>
    <form action="/users/register" method="POST">
      <input type="text" name="name" placeholder="Enter Name" /> <br><br>
      <input type="email" name="email" placeholder="Enter Email" /> <br><br>
      <input type="password" name="password" placeholder="Enter Password" /> <br><br>
      <button type="submit">Register</button>
    </form>
  `);
});

// POST → Receive form and validate
userRouter.post(
  '/register',
  [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Invalid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Convert errors array into object: { name: "...", email: "...", password: "..." }
      const errorObj = {};
      errors.array().forEach(err => {
        errorObj[err.path] = err.msg;
      });

      // Send form again with errors
      return res.send(`
        <h2>User Register Form</h2>
        <form action="/users/register" method="POST">
        
          <input type="text" name="name" placeholder="Enter Name" value="${req.body.name || ''}" />
          <p style="color:red">${errorObj.name || ''}</p>
          <br>

          <input type="email" name="email" placeholder="Enter Email" value="${req.body.email || ''}" />
          <p style="color:red">${errorObj.email || ''}</p>
          <br>

          <input type="password" name="password" placeholder="Enter Password" />
          <p style="color:red">${errorObj.password || ''}</p>
          <br>

          <button type="submit">Register</button>
        </form>
      `);
    }

    // If no errors → show success
    res.send(`
      <h2>User Registered Successfully ✅</h2>
      <p>Name: ${req.body.name}</p>
      <p>Email: ${req.body.email}</p>
      <a href="/users/form">Go Back</a>
    `);
  }
);

// Attach router
app.use('/users', userRouter);

/* ---------------- SERVER ---------------- */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/users/form");
});
