const inquirer = require('inquirer');
const questions = require('./questions')

function startApp() {
  inquirer.prompt(questions.startQuestions)
    .then(function (data) {
      console.log(data)
      switch(data.startMenu) {
        case "View all departments":
          console.log('meow');
          break;
      }
    })
}


module.exports = startApp();