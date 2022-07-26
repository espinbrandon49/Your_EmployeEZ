DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

DROP DATABASE IF EXISTS department;
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

DROP DATABASE IF EXISTS roles;
CREATE TABLE roles (
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DEC,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  ON DELETE SET NULL
);

DROP DATABASE IF EXISTS employees;
CREATE TABLE employees (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
  ON DELETE SET NULL
);
