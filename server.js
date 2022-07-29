const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const questions = require('./assets/js/questions');

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

function startMenu() {
  inquirer.prompt(questions.startQuestion)
    .then(function (data) {
      switch (data.startMenu) {
        case "View All Departments":
          viewDepartment();
          break;
        case "View All Roles":
          viewRoles()
          break;
        case "View All Employees":
          viewEmployees()
          break;
        case "View Employees By Department":
          viewEmployeesByDept()
          break;
        case "View Aggregate Salaries By Department":
          viewTotalSalaries()
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole()
          break;
        case "Add An Employee":
          addEmployee()
          break;
        case "Update An Employee Role":
          updateRole()
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
  db.query('SELECT DISTINCT  roles.id AS id, roles.title, department.name AS department, roles.salary FROM department JOIN roles ON department.id = department_id', function (err, results) {
    console.table(results);
    startMenu()
  })
}

function viewEmployees() {
  db.query('SELECT DISTINCT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(b.first_name, " ", b.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN department ON department.id = roles.department_id LEFT JOIN employees b ON employees.manager_id = b.id', function (err, results) {
    console.table(results);
    startMenu()
  });
}

function viewEmployeesByDept() {
  db.query(`SELECT CONCAT(employees.first_name," ",employees.last_name) AS employee, department.name AS department FROM employees JOIN roles ON employees.role_id = roles.id JOIN department ON roles.department_id = department.id
  `, function (err, results) {
    console.table(results);
    startMenu()
  });
}

function viewTotalSalaries() {
  db.query(`SELECT department.name, SUM(roles.salary) AS aggregate_salaries FROM employees JOIN roles ON roles.id = employees.role_id JOIN department ON department.id = roles.department_id GROUP BY department.name`, function (err, results) {
    console.table(results);
    startMenu()
  });
}

function addDepartment() {
  inquirer.prompt(questions.addDepartment)
    .then(function (data) {
      const departmentName = data.addDepartment
      db.query('INSERT INTO department (name) VALUES (?)', departmentName, function (err, results) {
        if (err) throw err;
        console.log(`${departmentName} added as a new Deparment`)
        startMenu()
      })
    })
}

function addRole() {
  inquirer.prompt(questions.addRole)
    .then(function (data) {
      let departments = [];
      let departmentsId = []
      db.query('SELECT * FROM department', function (err, results) {
        results.map(department => {
          departments.push(department.name)
          departmentsId.push(department.id)
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
            let deptIdIndex = departments.indexOf(data1.addRoleDept) + 1
            let deptId = departmentsId[departmentsId.indexOf(deptIdIndex)]
            db.query(`INSERT INTO roles (title, salary , department_id) VALUES (?, ?, ?)`, [data.addRoleName, data.addRoleSalary, deptId], function (err, results) {
              if (err) throw err;
              console.log(`${data.addRoleName} added as a new role`)
              startMenu()
            });
          })
      })
    })
}

function addEmployee() {
  inquirer.prompt(questions.addEmployee)
    .then(function (data) {
      let titles = []
      let titleId = []
      let managers = ['none']
      let managerIds = [null]
      db.query('SELECT * FROM roles', function (err, results) {
        results.map(role => {
          titles.push(role.title)
          titleId.push(role.id)
        })
        inquirer.prompt([
          {
            type: 'list',
            message: "What is the role of the employee?",
            name: 'empRole',
            choices: titles
          }
        ])
          .then(function (data1) {
            db.query('SELECT * FROM employees', function (err, results) {
              results.map(employee => {
                managers.push(employee.first_name + ' ' + employee.last_name)
                managerIds.push(employee.id)
              })
              inquirer.prompt([
                {
                  type: 'list',
                  message: "Who is the manager of the employee?",
                  name: 'empMan',
                  choices: managers
                }
              ])
                .then(function (data2) {
                  let roleIdIndex = titles.indexOf(data1.empRole) + 1
                  let roleId = titleId[titleId.indexOf(roleIdIndex)]
                  let managerIdIndex = managers.indexOf(data2.empMan)
                  let managerId = managerIds[managerIds.indexOf(managerIdIndex)]
                  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.empFName, data.empLName, roleId, managerId], function (err, results) {
                    if (err) throw err;
                    console.log(`${data.empFName} ${data.empLName} added as a new employee`)
                    startMenu()
                  });
                })
            })
          })
      })
    });
}

function updateRole() {
  let names = []
  let namesId = []
  let roles = []
  let rolesId = []
  db.query(`SELECT * FROM employees`, function (err, results) {
    results.map(name => {
      names.push(name.first_name + ' ' + name.last_name)
      namesId.push(name.id)
    })
    inquirer.prompt([
      {
        type: 'list',
        message: "Which employee do you want to update?",
        name: 'updateEmp',
        choices: names
      }
    ])
      .then(function (data) {
        db.query(`SELECT * FROM roles`, function (err, results) {
          results.map(role => roles.push(role.title))
          results.map(role => rolesId.push(role.id))
          inquirer.prompt([
            {
              type: 'list',
              message: "What is the employee's new role?",
              name: 'updateRole',
              choices: roles
            }
          ])
            .then(function (data1) {
              let nameIdIndex = names.indexOf(data.updateEmp) + 1
              let nameId = namesId[namesId.indexOf(nameIdIndex)]
              let rolesIdIndex = roles.indexOf(data1.updateRole) + 1
              let roleId = rolesId[rolesId.indexOf(rolesIdIndex)]

              db.query(`UPDATE employees SET role_id=? WHERE id=?;`, [roleId, nameId], function (err, results) {
                if (err) throw err;
                console.log(`${data.updateEmp} updated as a ${data1.updateRole}`)
                startMenu()
              });
            })
        })
      })
  })
}

startMenu()


