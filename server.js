const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const questions = require('./assets/js/questions')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

startApp()
function startApp() {
  inquirer.prompt(questions.startQuestions)
    .then(function (data) {
      console.log(data)
    })
}


// Query database
// db.query('SELECT * FROM department', function (err, results) {
//   console.log("********* SELECT * FROM department");
//   console.table(results[3]);
//   console.log("*********");
// });






























//IS THIS NECESSARY
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
