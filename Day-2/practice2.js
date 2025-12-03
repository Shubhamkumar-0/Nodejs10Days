import express from 'express';
import fs from 'fs';
import zlib from 'zlib';
import  EventEmitter  from 'events';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';


const app = express();
const PORT = 3000;

class StudentEmitter extends EventEmitter {}
const studentEmitter = new StudentEmitter();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create data file if not exists
if (!fs.existsSync("data.json")) {
  fs.writeFileSync("data.json", "[]");
}

// Event
studentEmitter.on("student-added", (name) => {
  console.log(`Student Added: ${name}`);
});

// Functions
function readData() {
  return JSON.parse(fs.readFileSync("data.json", "utf-8"));
}
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// =======================
// HOME PAGE (HTML UI)
// =======================
app.get("/", (req, res) => {
  const students = readData();

  let rows = students.map(
    s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.marks}</td>
        <td>
          <a href="/delete/${s.id}">Delete</a>
        </td>
      </tr>
    `
  ).join("");

  res.send(`
    <html>
    <head>
      <title>Student Manager</title>
      <style>
        body { font-family: Arial; padding: 20px; background: #f2f2f2;}
        h1 { color: #333; }
        form { margin-bottom: 20px; }
        input, button { padding: 8px; margin: 5px;}
        table { border-collapse: collapse; width: 100%; background: white;}
        th, td { border: 1px solid #666; padding: 10px; text-align: center;}
        a { color: red; text-decoration: none;}
      </style>
    </head>
    <body>
      <h1>📘 Student Record Manager</h1>

      <h3>Add Student</h3>
      <form action="/add" method="POST">
        <input type="text" name="name" placeholder="Name" required>
        <input type="number" name="marks" placeholder="Marks" required>
        <button type="submit">Add Student</button>
      </form>

      <h3>All Students</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Marks</th>
          <th>Action</th>
        </tr>
        ${rows}
      </table>

      <br>
      <a href="/compress"><button>Compress Data</button></a>
      <a href="/download"><button>Download Excel</button></a>
    </body>
    </html>
  `);
});

// =======================
// ADD STUDENT
// =======================
app.post("/add", 
  body("name").notEmpty(),
  body("marks").isNumeric(),
  (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.send("<h2>Invalid Data</h2><a href='/'>Go back</a>");
  }

  const students = readData();

  const newStudent = {
    id: Date.now().toString(),
    name: req.body.name,
    marks: req.body.marks
  };

  students.push(newStudent);
  writeData(students);

  studentEmitter.emit("student-added", newStudent.name);

  res.redirect("/");
});

// =======================
// DELETE STUDENT
// =======================
app.get("/delete/:id", (req, res) => {
  const students = readData();
  const newList = students.filter(s => s.id !== req.params.id);

  writeData(newList);

  res.redirect("/");
});

// =======================
// COMPRESS DATA (ZLIB + STREAM)
// =======================
app.get("/compress", (req, res) => {
  const readStream = fs.createReadStream("data.json");
  const writeStream = fs.createWriteStream("data.json.gz");

  readStream.pipe(zlib.createGzip()).pipe(writeStream);

  res.send(`<h2>✅ File Compressed!</h2><a href="/">Go Back</a><br>
`);
  
});


// =======================
// DOWNLOAD EXCEL (CSV)
// =======================
app.get("/download", (req, res) => {
  const students = readData();

  let csv = "Name,Marks\n";  // Header

  students.forEach(s => {
    csv += `${s.name},${s.marks}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students.csv");

  res.send(csv);
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
