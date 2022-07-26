const questions = {
  startQuestion:{
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
}
module.exports = questions;

