import inquirer from 'inquirer';
import { pool } from './database/connection'
import Department from './database/classes/Department'
import Employee from './database/classes/Employee'
import Role from './database/classes/Role'


// Create a Main Menu   
async function mainMenu() {
    const {action} = await inquirer.prompt([
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
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Delete Department':
            await deleteDepartment();
            break;
        case 'Delete Role':
            await deleteRole();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }

    await mainMenu();
}

async function viewDepartments() {
    const result = await pool.query('SELECT * FROM department');
    const departments: Department[] = result.rows;
    console.log(departments);
}


async function viewRoles() {
    const result = await pool.query('SELECT * FROM role');
    const roles: Role[] = result.rows;
    console.log(roles)
}
// id, first name, last name, role title, department, salary, and manager
// (INNER) JOIN: Returns records that have matching values in both tables
// LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
// RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
// FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
async function viewEmployees() {
    const result = await pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, 
         role.title AS role, department.department_name AS department, 
         role.salary, 
         CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
         FROM employee
         INNER JOIN role ON employee.role_id = role.id
         INNER JOIN department ON role.department_id = department.id
         LEFT JOIN employee manager ON employee.manager_id = manager.id`
    );
    const employees: Employee[] = result.rows;
    console.log(employees);
}
// ($1) = pointing to first argument in sql function
async function addDepartment() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter Department Name:' },
    ]);
    await pool.query('INSERT INTO department (department_name) VALUES ($1)', [name]);
    console.log(`Added Department: ${name}`);
}

async function addRole() {
    const result = await pool.query('SELECT * FROM department');
    const departments: Department[] = result.rows; // Extract rows for the departments
    const { title, salary, departmentId } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter Role Title:' },
        { type: 'input', name: 'salary', message: 'Enter Role Salary:' },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select Department',
            choices: departments.map((jobs) => ({ name: jobs.department_name, value: jobs.id })),
        },
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    console.log(`Added Role: ${title}`);
}

async function addEmployee() {
    const roles: Role[] = (await pool.query('SELECT * FROM role')).rows;
    const employees: Employee[] = (await pool.query('SELECT * FROM employee')).rows;

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
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
    await pool.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, roleId, managerId]
    );
    console.log(`Added Employee: ${firstName} ${lastName}`);
}

async function deleteDepartment() {
    const departments: Department[] = (await pool.query('SELECT * FROM department')).rows;

    const { departmentId } = await inquirer.prompt([
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
        await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
        console.log(`Deleted Department with ID: ${departmentId}`);
    } catch (error) {
        if (error instanceof Error) {
            // Handle the error if it is an instance of Error
            console.error('Error deleting department:', error.message);
            }
        }
    }

async function deleteRole() {
    const roles: Role[] = (await pool.query('SELECT * FROM role')).rows;

    const { roleId } = await inquirer.prompt([
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
    try{
        await pool.query('DELETE FROM role WHERE id = $1', [roleId]);
        console.log(`Deleted Role.`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting department:', error.message);
            }
        }
    }
async function deleteEmployee() {
    const employees: Employee[] = (await pool.query('SELECT * FROM employee')).rows;

    const { employeeId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to delete:',
            choices: [ ...employees.map((emp) => ({
                name: `${emp.first_name} ${emp.last_name}`, value: emp.id, })),
                { name: 'Return to Menu', value: null },
            ]
                },
    ]);
    if (!employeeId) {
        console.log('Returned to Menu.');
        return mainMenu();
    }
    try{
        await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
        console.log(`Deleted Employee.`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting department:', error.message);
        }
    } 
}

mainMenu();