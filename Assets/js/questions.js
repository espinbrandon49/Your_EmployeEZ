const questions = {
  startQuestions: [
    {
      type: 'list',
      message: "What would you like to do?",
      name: 'startMenu',
      choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    },
  ]
}
module.exports = questions;

