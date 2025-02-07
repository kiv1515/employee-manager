"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Employee {
    constructor(id, first_name, last_name, role_id, manager_id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
    printDetails() {
        console.log(`ID: ${this.id}`);
        console.log(`First Name: ${this.first_name}`);
        console.log(`Last Name: ${this.last_name}`);
        console.log(`Role: ${this.role_id}`);
        console.log(`Manager: ${this.manager_id}`);
    }
}
exports.default = Employee;
