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
      let departments = [];
      db.query('SELECT * FROM department', function (err, results) {
        results.map(department => {
          departments.push(department.name)
        })
        inquirer.prompt([
          {
            type: 'list',
            message: "What department does this role belong to?",
            name: 'addRoleDept',
            choices: departments
          },
        ])
          .then(function (data1) {
            console.log(data1, 1)
            console.log(data1.addRoleDept, 2)
            console.log(departments.indexOf(data1.addRoleDept))
            let deptId = departments.indexOf(data1.addRoleDept) + 1
            console.log(deptId, 3)

            console.log([data.addRoleName, data.addRoleSalary, deptId])
            db.query(`INSERT INTO roles (title, salary , department_id) VALUES (?, ?, ?)`, [data.addRoleName, data.addRoleSalary, deptId], function (err, results) {
              if (err) throw err;
              console.log([data.addRoleName, data.addRoleSalary, deptId])
            });
          })
      })
    })
  //startMenu() is popping up before I can enter the new role
}

function addEmployee() {
  inquirer.prompt(questions.addEmployee)
    .then(function (data) {
      let roles = []
      db.query('SELECT * FROM roles', function (err, results) {
        results.map(role => {
          roles.push(role.title)
        })
        inquirer.prompt([
          {
            type: 'list',
            message: "What is the role of the employee?",
            name: 'empRole',
            choices: roles
          }
        ])
          .then(function (data1) {
            let choices = ['none']
            db.query('SELECT * FROM employees', function (err, results) {
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
                .then(function (data2) {
                  let empRole = roles.indexOf(data1.empRole) + 1
                  let managerId = choices.indexOf(data2.empMan)
                  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.empFName, data.empLName, empRole, managerId], function (err, results) {
                    if (err) throw err;
                    console.log([data.empFName, data.empLName, empRole, managerId])
                  });
                })
            })
          })
      })
    });
}

function updateRole() {

}
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//startMenu() is popping up before I can enter the info to add
//You might also want to make your queries asynchronous
// why does it ask "What would you like to do?" twice?
