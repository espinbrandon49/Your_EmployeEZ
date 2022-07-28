INSERT INTO department (name) 
VALUES
('Finance'), ('Sales'),('Engineering'), ('Legal');
-- SELECT * FROM department;

INSERT INTO roles (title, salary, department_id)
VALUES
('Finance Analyst', 50000, 1), ('Accountant', 85000, 1), ('Salesperson', 40000, 2), ('Account Manager', 75000, 2), ('Software Engineer', 75000, 3),('Lead Engineer', 100000, 3),('Legal Analyst', 50000, 4),('Lawyer', 100000, 4);
-- SELECT * FROM roles;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('George', 'Washington', 1, 2),
('John', 'Adams', 2, NULL),
('Thomas', 'Jefferson', 3, 4),
('James', 'Madison', 4, NULL),
('John', 'Quincyadams', 5, 6),
('Andrew', 'Jackson', 6, NULL),
('Martin', 'Vanburen', 7, 8),
('Martin', 'Vanburen', 8, NULL),
('William', 'Harrison', 5, 6);
-- SELECT * FROM employees;

-- SELECT DISTINCT employees.id, employees.first_name, employees.last_name, roles.title, department.name, roles.salary, CONCAT(b.first_name, " ", b.last_name) AS Manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN department ON department.id = roles.department_id LEFT JOIN employees b ON employees.manager_id = b.id



