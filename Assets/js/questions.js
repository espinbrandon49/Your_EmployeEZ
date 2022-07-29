const questions = {
  startQuestion: {
    type: 'list',
    message: "What would you like to do?",
    name: 'startMenu',
    choices: ["View All Departments", "View All Roles", "View All Employees", "View Employees By Department", "View Aggregate Salaries By Department", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"]
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

