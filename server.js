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
);//hide credentials

function startMenu() {
  inquirer.prompt(questions.startQuestion)
    .then(function (data) {
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
          updateRole()
          break;
      }
    })
}// why does it ask "What would you like to do?" twice?

function viewDepartment() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    startMenu()
  });
}//1. need to remove index column

function viewRoles() {
  db.query('SELECT DISTINCT roles.title, roles.id AS roles_Id, department.name, roles.salary FROM department JOIN roles ON department.id = department_id', function (err, results) {
    console.table(results);
    startMenu()
  })
}//1. need to remove index column;

function viewEmployees() {
  db.query('SELECT DISTINCT employees.id, employees.first_name, employees.last_name, roles.title, department.name, roles.salary, employees.manager_id, CONCAT(employees.first_name, " ", employees.last_name) AS Manager  FROM employees JOIN roles ON employees.role_id = roles.id JOIN department ON department.id = roles.department_id', function (err, results) {
    console.table(results);
    startMenu()
  });
}//1. PRIORITY need to add manager name 2. need to remove index column; 

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
}//GOOD

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
              console.log([data.addRoleName, data.addRoleSalary, deptId])
              startMenu()
            });
          })
      })
    })
  //GOOD
}//GOOD

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
                    console.log([data.empFName, data.empLName, roleId, managerId])
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
                console.log(data.updateEmp, data1.updateRole, 'red')
                startMenu()
              });
            })
        })
      })
  })
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startMenu()
})


