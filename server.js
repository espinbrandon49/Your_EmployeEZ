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

//startMenu()
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
          addDepartment();
          break;
        case "Add a role":
          addRole()
          break;
        case "Add an employee":
          addEmployee()
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
  inquirer.prompt(questions.addDepartment)
    .then(function (data) {
      const departmentName = data.addDepartment
      db.query('INSERT INTO department (name) VALUES (?)', departmentName, function (err, results) {
        if (err) throw err;
        console.log(`${departmentName} added as a new Deparment`);
      });
    })
  //startMenu() is popping up before I can enter the new department
}

function addRole() {
  inquirer.prompt(questions.addRole)
    .then(function (data) {
      let departmentID;
      switch (data.addRoleDept) {
        case 'Finance':
          departmentID = 1;
          break;
        case 'Sales':
          departmentID = 2;
          break;
        case 'Engineering':
          departmentID = 3;
          break;
        case 'Legal':
          departmentID = 4;
          break;
      }
      //const salary = parseInt(data.addRoleSalary)
      const deptId = departmentID
      const dataRole = data.addRoleSalary * 1
      db.query(`INSERT INTO roles (title, salary , department_id) VALUES (?, ?, ?)`, [data.addRoleName, (dataRole * 1), deptId], function (err, results) {
        if (err) throw err;
        console.log([data.addRoleName, data.addRoleSalary, deptId])
      });
    })
  //startMenu() is popping up before I can enter the new role
}

function addEmployee() {
  inquirer.prompt(questions.addEmployee)
    .then(function (data) {
      let empRole;
      switch (data.empRole) {
        case 'Finance Analyst':
          empRole = 1;
          break;
        case 'Accountant':
          empRole = 2;
          break;
        case 'Salesperson':
          empRole = 3;
          break;
        case 'Account Manager':
          empRole = 4;
          break;
        case 'Software Engineer':
          empRole = 5;
          break;
        case 'Lead Engineer':
          empRole = 6;
          break;
        case 'Legal Analyst':
          empRole = 7;
          break;
        case 'Lawyer':
          empRole = 8;
          break;
      }
      db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.empFName, data.empLName, empRole, 1], function (err, results) {
        if (err) throw err;
        console.log([data.empFName, data.empLName, empRole, 1])
      });
    })
}

function managers() {
  let choices = []
  let manager;
  db.query('SELECT * FROM employees', function (err, results) {
    console.table(results)
    results.map(employee => {
      choices.push(employee.first_name + ' ' + employee.last_name)
    })
    inquirer.prompt([
      {
        type: 'list',
        message: "Who is the manager of the employee?",
        name: 'empMan',
        choices: choices
      }
    ])
      .then(function (data) {
        manager = data.empMan
        console.log(manager, 1)
        console.log(choices.indexOf(manager) + 1)
      })
  });
  return manager
}
console.log(managers(), 2)

//other 2 functions
//startMenu() is popping up before I can enter the info to add
//You might also want to make your queries asynchronous

//  You might also want to make your queries asynchronous. MySQL2 exposes a `.promise()` function on Connections to upgrade an existing non-Promise connection to use Promises. To learn more and make your queries asynchronous, refer to the [npm documentation on MySQL2](https://www.npmjs.com/package/mysql2).


// why does it ask "What would you like to do?" twice?
// DEFAULT NULL ON MANAGER_ID ON SEEDS.JS

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
