"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const connection_1 = require("./database/connection");
// Create a Main Menu   
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const { action } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Delete Department',
                    'Delete Role',
                    'Delete Employee',
                    'Exit',
                ],
            },
        ]);
        // assign functions with awaits to choices
        switch (action) {
            case 'View All Departments':
                yield viewDepartments();
                break;
            case 'View All Roles':
                yield viewRoles();
                break;
            case 'View All Employees':
                yield viewEmployees();
                break;
            case 'Add Department':
                yield addDepartment();
                break;
            case 'Add Role':
                yield addRole();
                break;
            case 'Add Employee':
                yield addEmployee();
                break;
            case 'Delete Department':
                yield deleteDepartment();
                break;
            case 'Delete Role':
                yield deleteRole();
                break;
            case 'Delete Employee':
                yield deleteEmployee();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
        }
        yield mainMenu();
    });
}
function viewDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM department');
        const departments = result.rows;
        console.log(departments);
    });
}
function viewRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM role');
        const roles = result.rows;
        console.log(roles);
    });
}
// id, first name, last name, role title, department, salary, and manager
// (INNER) JOIN: Returns records that have matching values in both tables
// LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
// RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
// FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
function viewEmployees() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT employee.id, employee.first_name, employee.last_name, 
         role.title AS role, department.department_name AS department, 
         role.salary, 
         CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
         FROM employee
         INNER JOIN role ON employee.role_id = role.id
         INNER JOIN department ON role.department_id = department.id
         LEFT JOIN employee manager ON employee.manager_id = manager.id`);
        const employees = result.rows;
        console.log(employees);
    });
}
// ($1) = pointing to first argument in sql function
function addDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = yield inquirer_1.default.prompt([
            { type: 'input', name: 'name', message: 'Enter Department Name:' },
        ]);
        yield connection_1.pool.query('INSERT INTO department (department_name) VALUES ($1)', [name]);
        console.log(`Added Department: ${name}`);
    });
}
function addRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM department');
        const departments = result.rows; // Extract rows for the departments
        const { title, salary, departmentId } = yield inquirer_1.default.prompt([
            { type: 'input', name: 'title', message: 'Enter Role Title:' },
            { type: 'input', name: 'salary', message: 'Enter Role Salary:' },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select Department',
                choices: departments.map((jobs) => ({ name: jobs.department_name, value: jobs.id })),
            },
        ]);
        yield connection_1.pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
        console.log(`Added Role: ${title}`);
    });
}
function addEmployee() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = (yield connection_1.pool.query('SELECT * FROM role')).rows;
        const employees = (yield connection_1.pool.query('SELECT * FROM employee')).rows;
        const { firstName, lastName, roleId, managerId } = yield inquirer_1.default.prompt([
            { type: 'input', name: 'firstName', message: "Enter the employee's first name:" },
            { type: 'input', name: 'lastName', message: "Enter the employee's last name:" },
            {
                type: 'list',
                name: 'roleId',
                message: "Select the employee's role:",
                choices: roles.map((role) => ({ name: role.title, value: role.id })),
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Select the employee's manager:",
                choices: [
                    { name: 'None', value: null },
                    ...employees.map((emp) => ({
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id,
                    })),
                ],
            },
        ]);
        yield connection_1.pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
        console.log(`Added Employee: ${firstName} ${lastName}`);
    });
}
function deleteDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = (yield connection_1.pool.query('SELECT * FROM department')).rows;
        const { departmentId } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department to delete:',
                choices: [...departments.map((dept) => ({ name: dept.department_name, value: dept.id })),
                    { name: 'Return to Menu', value: null }
                ]
            },
        ]);
        // Check if the user selected "Cancel"
        if (!departmentId) {
            console.log('Returned to Menu.');
            return mainMenu(); // Return to the main menu
        }
        // Delete the selected department
        try {
            yield connection_1.pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
            console.log(`Deleted Department with ID: ${departmentId}`);
        }
        catch (error) {
            if (error instanceof Error) {
                // Handle the error if it is an instance of Error
                console.error('Error deleting department:', error.message);
            }
        }
    });
}
function deleteRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = (yield connection_1.pool.query('SELECT * FROM role')).rows;
        const { roleId } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the role to delete:',
                choices: [...roles.map((role) => ({ name: role.title, value: role.id })),
                    { name: 'Return to Menu', value: null },
                ],
            },
        ]);
        if (!roleId) {
            console.log('Returned to Menu.');
            return mainMenu();
        }
        try {
            yield connection_1.pool.query('DELETE FROM role WHERE id = $1', [roleId]);
            console.log(`Deleted Role.`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error deleting department:', error.message);
            }
        }
    });
}
function deleteEmployee() {
    return __awaiter(this, void 0, void 0, function* () {
        const employees = (yield connection_1.pool.query('SELECT * FROM employee')).rows;
        const { employeeId } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to delete:',
                choices: [...employees.map((emp) => ({
                        name: `${emp.first_name} ${emp.last_name}`, value: emp.id,
                    })),
                    { name: 'Return to Menu', value: null },
                ]
            },
        ]);
        if (!employeeId) {
            console.log('Returned to Menu.');
            return mainMenu();
        }
        try {
            yield connection_1.pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
            console.log(`Deleted Employee.`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error deleting department:', error.message);
            }
        }
    });
}
mainMenu();
