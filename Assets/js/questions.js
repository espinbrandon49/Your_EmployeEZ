const questions = {
  startQuestion: {
    type: 'list',
    message: "What would you like to do?",
    name: 'startMenu',
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
  },
  addDepartment: {
    type: 'input',
    message: "What is the name of the department?",
    name: 'addDepartment',
  },
  addRole: [
    {
      type: 'input',
      message: "What is the name of the role?",
      name: 'addRoleName',
    },
    {
      type: 'input',
      message: "What is the salary of the role?",
      name: 'addRoleSalary',
    },
  ],
  addEmployee: [
    {
      type: 'input',
      message: "What is the first name of the employee?",
      name: 'empFName',
    },
    {
      type: 'input',
      message: "What is the last name of the employee?",
      name: 'empLName',
    },
  ],
}
module.exports = questions;

