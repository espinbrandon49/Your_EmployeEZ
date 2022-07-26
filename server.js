const express = require('express');
const mysql = require('mysql2');
//const index = require('./assets/js/index')
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

startMenu()
function startMenu() {
  inquirer.prompt(questions.startQuestion)
    .then(function (data) {
      console.log(data.startMenu)
      switch (data.startMenu) {
        case "View all departments":
          viewDepartment();
          break;
        case "View all roles":
          viewRoles()
          break;
        case "View all employees":
          viewEmployees()
          break;
        case "Add a department":
          console.log('dept')
          addDepartment();
          break;
        case "Add a role":
          console.log('role')
          //addRole()
          break;
        case "Add an employee":
          console.log('employee')
          //addEmployee()
          break;
        case "Update an employee role":
          console.log('updaterole')
          //updateRole()
          break;
      }
    })
}

function viewDepartment() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    startMenu()
  });
}

function viewRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    console.table(results);
  });
  startMenu()
}

function viewEmployees() {
  db.query('SELECT * FROM employees', function (err, results) {
    console.table(results);
  });
  startMenu()
}

function addDepartment() {
  inquirer.prompt()
  db.query('INSERT INTO department (name) VALUES ("Farley")', function (err, results) {
    if (err) throw err;
    console.log(results);
  });
  startMenu()
}


//Why are my tables messy in the terminal?

// REMOVE INDEX COLUMN FROM CONSOLE.TABLE ON SERVER.JS
// why does it ask "What would you like to do?" twice?
// make a table from mysql2?
// DEFAULT NULL ON MANAGER_ID ON SEEDS.JS
//  You might also want to make your queries asynchronous. MySQL2 exposes a `.promise()` function on Connections to upgrade an existing non-Promise connection to use Promises. To learn more and make your queries asynchronous, refer to the [npm documentation on MySQL2](https://www.npmjs.com/package/mysql2).





























//IS THIS NECESSARY
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
